"""
Drug Similarity Scoring Module
================================
Computes drug-drug and drug-target similarity using feature vectors.
Uses Jaccard similarity on drug property fingerprints — no RDKit required.
"""

import pandas as pd
import numpy as np
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics.pairwise import cosine_similarity


def load_drugs(csv_path: str) -> pd.DataFrame:
    """Load and preprocess the drug candidates dataset."""
    df = pd.read_csv(csv_path)
    # Replace 'N/A' strings with NaN
    df.replace("N/A", np.nan, inplace=True)
    return df


def build_feature_matrix(df: pd.DataFrame) -> np.ndarray:
    """
    Build a numerical feature matrix from drug properties.
    Used for computing pairwise similarity between drugs.
    """
    numeric_cols = ["mw", "logp", "hbd", "hba", "binding_affinity_score",
                    "literature_mentions", "side_effect_score"]

    feature_df = df[numeric_cols].copy()
    feature_df = feature_df.fillna(feature_df.median())

    scaler = MinMaxScaler()
    scaled = scaler.fit_transform(feature_df)
    return scaled


def compute_similarity_matrix(feature_matrix: np.ndarray) -> np.ndarray:
    """Compute cosine similarity between all drug pairs."""
    return cosine_similarity(feature_matrix)


def get_similar_drugs(drug_name: str, df: pd.DataFrame,
                      sim_matrix: np.ndarray, top_n: int = 5) -> pd.DataFrame:
    """
    Return the top-N most similar drugs to the query drug.

    Parameters
    ----------
    drug_name : str
        Name of the reference drug
    df : pd.DataFrame
        Drug dataframe
    sim_matrix : np.ndarray
        Precomputed similarity matrix
    top_n : int
        Number of similar drugs to return

    Returns
    -------
    pd.DataFrame with columns: drug_name, similarity_score, covid_score
    """
    if drug_name not in df["drug_name"].values:
        raise ValueError(f"Drug '{drug_name}' not found in dataset.")

    idx = df[df["drug_name"] == drug_name].index[0]
    scores = sim_matrix[idx]

    similar_indices = np.argsort(scores)[::-1][1:top_n + 1]  # exclude self

    result = df.iloc[similar_indices][["drug_name", "original_use",
                                       "drug_class", "covid_score",
                                       "clinical_status"]].copy()
    result["similarity_score"] = scores[similar_indices].round(3)
    result = result.sort_values("similarity_score", ascending=False)
    return result


def compute_repurposing_score(df: pd.DataFrame) -> pd.DataFrame:
    """
    Compute a composite AI repurposing score combining:
    - Binding affinity to COVID-19 targets
    - Literature evidence (number of papers)
    - Safety profile (inverse of side effects)
    - Clinical trial status bonus
    """
    df = df.copy()
    df["mw"] = pd.to_numeric(df["mw"], errors="coerce")
    df["logp"] = pd.to_numeric(df["logp"], errors="coerce")
    df["binding_affinity_score"] = pd.to_numeric(df["binding_affinity_score"], errors="coerce")
    df["literature_mentions"] = pd.to_numeric(df["literature_mentions"], errors="coerce")
    df["side_effect_score"] = pd.to_numeric(df["side_effect_score"], errors="coerce")
    df["covid_score"] = pd.to_numeric(df["covid_score"], errors="coerce")

    # Normalize literature mentions to [0, 1]
    lit_max = df["literature_mentions"].max()
    df["lit_norm"] = df["literature_mentions"] / lit_max

    # Safety score: lower side effects = better
    df["safety_norm"] = 1 - df["side_effect_score"]

    # Clinical bonus: approved drugs get a boost
    status_bonus = {
        "FDA Approved for COVID-19": 0.15,
        "EUA Approved": 0.12,
        "Standard of Care": 0.13,
        "EUA (with Nirmatrelvir)": 0.12,
        "Positive Trials": 0.08,
        "Clinical Trials": 0.05,
        "Approved in some countries": 0.04,
        "Observational Studies": 0.02,
        "In Vitro Only": 0.01,
        "Controversial": -0.05,
        "Not Recommended": -0.10,
        "Weak Evidence": -0.03,
    }
    df["clinical_bonus"] = df["clinical_status"].map(status_bonus).fillna(0)

    # Composite AI Score (weighted sum)
    df["ai_repurposing_score"] = (
        0.40 * df["binding_affinity_score"].fillna(0) +
        0.25 * df["lit_norm"].fillna(0) +
        0.20 * df["safety_norm"].fillna(0) +
        0.15 * df["covid_score"].fillna(0) +
        df["clinical_bonus"]
    ).clip(0, 1).round(3)

    return df.sort_values("ai_repurposing_score", ascending=False)


if __name__ == "__main__":
    import os
    data_path = os.path.join(os.path.dirname(__file__), "..", "data", "covid_drug_candidates.csv")
    df = load_drugs(data_path)

    print("=== AI Drug Repurposing Scores ===")
    scored = compute_repurposing_score(df)
    print(scored[["drug_name", "original_use", "ai_repurposing_score",
                  "clinical_status"]].head(10).to_string(index=False))

    print("\n=== Drugs Most Similar to Baricitinib ===")
    features = build_feature_matrix(df)
    sim_matrix = compute_similarity_matrix(features)
    similar = get_similar_drugs("Baricitinib", df, sim_matrix, top_n=5)
    print(similar.to_string(index=False))
