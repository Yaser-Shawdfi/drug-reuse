"""
Data Fetching Script — ChEMBL API
===================================
Fetches real SARS-CoV-2 bioactivity data from the ChEMBL database
using the official chembl_webresource_client Python library.

Run this script once to download the data:
    pip install chembl_webresource_client pandas
    python src/fetch_data.py

Data source: ChEMBL Database (EMBL-EBI)
URL: https://www.ebi.ac.uk/chembl/
"""

import os
import sys
import io
# Force UTF-8 output on Windows
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
import pandas as pd

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data")
os.makedirs(DATA_DIR, exist_ok=True)

# ── SARS-CoV-2 ChEMBL Target IDs ─────────────────────────────────────────────
SARS_COV2_TARGETS = {
    "CHEMBL3927": "SARS-CoV-2 Main Protease (3CLpro / Mpro)",
    "CHEMBL4523582": "SARS-CoV-2 RNA-dependent RNA Polymerase (RdRp / nsp12)",
    "CHEMBL4523583": "SARS-CoV-2 Papain-like Protease (PLpro)",
    "CHEMBL4523584": "SARS-CoV-2 Helicase (nsp13)",
}


def fetch_chembl_bioactivity(target_chembl_id: str,
                              target_name: str,
                              bioactivity_type: str = "IC50",
                              max_records: int = 500) -> pd.DataFrame:
    """
    Fetch bioactivity data from ChEMBL for a given target.

    Parameters
    ----------
    target_chembl_id : str
        ChEMBL ID of the target protein (e.g., 'CHEMBL3927')
    target_name : str
        Human-readable name for display
    bioactivity_type : str
        Type of bioactivity measurement (IC50, Ki, Kd, EC50)
    max_records : int
        Maximum number of records to fetch

    Returns
    -------
    pd.DataFrame
    """
    try:
        from chembl_webresource_client.new_client import new_client
    except ImportError:
        raise ImportError(
            "Please install: pip install chembl_webresource_client"
        )

    print(f"\nFetching {bioactivity_type} data for: {target_name} ({target_chembl_id})")

    activity = new_client.activity
    records = activity.filter(
        target_chembl_id=target_chembl_id,
        standard_type=bioactivity_type
    ).only([
        "molecule_chembl_id",
        "molecule_pref_name",
        "standard_type",
        "standard_value",
        "standard_units",
        "pchembl_value",
        "assay_chembl_id",
        "assay_description",
        "document_year",
        "canonical_smiles",
    ])

    rows = list(records[:max_records])
    print(f"  -> Retrieved {len(rows)} records")

    if not rows:
        return pd.DataFrame()

    df = pd.DataFrame(rows)
    df["target_chembl_id"] = target_chembl_id
    df["target_name"] = target_name
    return df


def clean_bioactivity_df(df: pd.DataFrame) -> pd.DataFrame:
    """
    Clean and preprocess bioactivity DataFrame.

    Steps:
    1. Drop rows with missing standard_value or pchembl_value
    2. Convert standard_value to numeric
    3. Filter to nM units only
    4. Remove duplicate molecule-target pairs (keep lowest IC50)
    5. Add potency classification
    """
    if df.empty:
        return df

    df = df.copy()
    df["standard_value"] = pd.to_numeric(df["standard_value"], errors="coerce")
    df["pchembl_value"] = pd.to_numeric(df["pchembl_value"], errors="coerce")

    # Keep only nM measurements
    df = df[df["standard_units"] == "nM"].dropna(subset=["standard_value"])

    # Remove outliers (IC50 > 100,000 nM is practically inactive)
    df = df[df["standard_value"] <= 100_000]

    # Deduplicate: keep best (lowest) IC50 per molecule-target pair
    df = df.sort_values("standard_value").drop_duplicates(
        subset=["molecule_chembl_id", "target_chembl_id"], keep="first"
    )

    # pIC50 = -log10(IC50 in M) — higher is better
    df["pIC50"] = df["pchembl_value"].fillna(
        -df["standard_value"].apply(lambda x: __import__("math").log10(x / 1e9))
    ).round(2)

    # Potency classification
    def classify_potency(ic50_nM):
        if ic50_nM < 100:
            return "High (< 100 nM)"
        elif ic50_nM < 1000:
            return "Moderate (100–1000 nM)"
        elif ic50_nM < 10000:
            return "Low (1–10 µM)"
        else:
            return "Very Low (> 10 µM)"

    df["potency_class"] = df["standard_value"].apply(classify_potency)
    return df.reset_index(drop=True)


def fetch_molecule_info(chembl_ids: list) -> pd.DataFrame:
    """Fetch drug name and approval status for a list of ChEMBL IDs."""
    try:
        from chembl_webresource_client.new_client import new_client
    except ImportError:
        return pd.DataFrame()

    molecule = new_client.molecule
    results = []
    batch_size = 50

    for i in range(0, len(chembl_ids), batch_size):
        batch = chembl_ids[i:i + batch_size]
        mols = molecule.filter(molecule_chembl_id__in=batch).only([
            "molecule_chembl_id", "pref_name", "max_phase",
            "first_approval", "molecule_type"
        ])
        results.extend(list(mols))

    if not results:
        return pd.DataFrame()

    df = pd.DataFrame(results)
    df["max_phase"] = pd.to_numeric(df["max_phase"], errors="coerce")
    df["is_approved"] = df["max_phase"] == 4
    return df


def main():
    all_bioactivity = []

    for chembl_id, name in SARS_COV2_TARGETS.items():
        df = fetch_chembl_bioactivity(chembl_id, name, bioactivity_type="IC50")
        if not df.empty:
            df_clean = clean_bioactivity_df(df)
            all_bioactivity.append(df_clean)

    if not all_bioactivity:
        print("No data fetched. Check your internet connection or ChEMBL IDs.")
        return

    combined = pd.concat(all_bioactivity, ignore_index=True)
    print(f"\nTotal bioactivity records: {len(combined)}")
    print(f"Unique molecules: {combined['molecule_chembl_id'].nunique()}")

    # Enrich with molecule metadata
    unique_ids = combined["molecule_chembl_id"].dropna().unique().tolist()
    mol_info = fetch_molecule_info(unique_ids)
    if not mol_info.empty:
        combined = combined.merge(
            mol_info, on="molecule_chembl_id", how="left"
        )

    out_path = os.path.join(DATA_DIR, "chembl_sars_bioactivity.csv")
    combined.to_csv(out_path, index=False)
    print(f"\nSaved to: {out_path}")
    print(combined[["molecule_pref_name", "target_name",
                     "standard_value", "pIC50", "potency_class"]].head(10))


if __name__ == "__main__":
    main()
