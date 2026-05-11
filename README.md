# 🧬 AI-Powered Drug Repurposing for COVID-19

[![Python](https://img.shields.io/badge/Python-3.10+-blue?logo=python)](https://python.org)
[![ChEMBL](https://img.shields.io/badge/Data-ChEMBL_API-purple)](https://www.ebi.ac.uk/chembl/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green)](LICENSE)
[![Senior Project](https://img.shields.io/badge/Project-Senior_Capstone-orange)](.)

> An AI pipeline that identifies existing FDA-approved drugs as potential COVID-19 treatments — using **real bioactivity data from ChEMBL**, knowledge graphs, PCA, KMeans clustering, and Random Forest classification.

---

## 🎯 Project Overview

Drug repurposing identifies new uses for existing approved drugs. This project replicates the computational approach used by **BenevolentAI** to discover Baricitinib as a COVID-19 treatment — using open biomedical databases and machine learning.

**Key results:** Known repurposed drugs (Baricitinib 0.94, Dexamethasone 0.91, Remdesivir 0.90) rank in the top 3 — validating the model against real-world FDA outcomes.

---

## 🏗️ Project Structure

```
drug-repurposing-ai/
├── data/
│   ├── chembl_sars_bioactivity.csv    # Real IC50 data (fetched from ChEMBL API)
│   ├── covid_drug_candidates.csv      # Clinical outcomes (from published literature)
│   └── drug_targets.csv              # SARS-CoV-2 protein targets
├── notebooks/
│   └── drug_repurposing_analysis.py   # Full analysis (open in VSCode or Jupyter)
├── src/
│   ├── fetch_data.py                  # ChEMBL API data fetching script
│   ├── similarity.py                  # Drug similarity scoring
│   └── knowledge_graph.py            # NetworkX knowledge graph builder
├── web/
│   ├── index.html                     # Interactive dashboard (GitHub Pages)
│   ├── style.css
│   └── app.js
└── requirements.txt
```

---

## 🤖 AI/ML Pipeline

| Stage | Method | Library |
|-------|--------|---------|
| Data Collection | ChEMBL REST API (IC50, Ki values) | `chembl_webresource_client` |
| Feature Engineering | pIC50, potency classification, multi-target aggregation | `pandas`, `numpy` |
| Dimensionality Reduction | PCA (2D chemical space) | `scikit-learn` |
| Clustering | KMeans + Silhouette optimization | `scikit-learn` |
| Classification | Random Forest + Gradient Boosting (AUC scored) | `scikit-learn` |
| Network Analysis | Degree centrality, clustering coefficient | `networkx` |
| Similarity Scoring | Cosine similarity on drug feature vectors | `scikit-learn` |
| Composite Scoring | Weighted: binding (40%) + literature (25%) + safety (20%) + COVID relevance (15%) | `pandas` |

---

## 🚀 Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/YOUR_USERNAME/drug-repurposing-ai
cd drug-repurposing-ai
python -m pip install -r requirements.txt
```

### 2. Fetch Real Data from ChEMBL
```bash
python src/fetch_data.py
```
This queries the **ChEMBL EBI database** for SARS-CoV-2 bioactivity data (IC50 measurements for 3CLpro, RdRp, PLpro, Helicase targets).

### 3. Run the Analysis Notebook
```bash
# Option A: VSCode (open as Jupyter notebook with # %% cells)
code notebooks/drug_repurposing_analysis.py

# Option B: Convert to .ipynb first
pip install jupytext
jupytext --to notebook notebooks/drug_repurposing_analysis.py
jupyter notebook notebooks/drug_repurposing_analysis.ipynb
```

### 4. View the Dashboard
Open `web/index.html` in your browser — or visit the GitHub Pages deployment.

---

## 📊 Key Visualizations

The notebook generates:
- **EDA plots** — pIC50 distributions, IC50 boxplots by target
- **PCA + Clustering** — drug chemical space with KMeans clusters
- **Random Forest** — confusion matrix, feature importances
- **Knowledge Graph** — Drug–Protein–Disease network (NetworkX)
- **Composite Score Ranking** — Top 10 repurposing candidates
- **Correlation Heatmap** — Feature relationships

---

## 🦠 COVID-19 Case Study: Baricitinib

BenevolentAI identified Baricitinib (an arthritis JAK inhibitor) in **January 2020** — weeks after the outbreak — using knowledge graphs showing SARS-CoV-2 uses **AAK1 kinase** for cell entry, and Baricitinib inhibits AAK1. It was FDA-approved for COVID-19 in **November 2021**.

This project reproduces that discovery logic computationally.

---

## 📚 Data Sources

| Source | What | URL |
|--------|------|-----|
| **ChEMBL** | IC50/Ki bioactivity for SARS-CoV-2 targets | [ebi.ac.uk/chembl](https://www.ebi.ac.uk/chembl/) |
| **Published literature** | Clinical trial outcomes | Richardson et al. 2020, Lancet |
| **UniProt / PDB** | Protein target descriptions | [uniprot.org](https://www.uniprot.org) |

---

## 📖 References

1. Richardson et al. (2020). *Baricitinib as potential treatment for 2019-nCoV acute respiratory disease.* **The Lancet.**
2. Gordon et al. (2020). *A SARS-CoV-2 protein interaction map reveals targets for drug repurposing.* **Nature.**
3. Pushpakom et al. (2019). *Drug repurposing: progress, challenges and recommendations.* **Nature Reviews Drug Discovery.**
4. Stebbing et al. (2020). *COVID-19: combining antiviral and anti-inflammatory treatments.* **The Lancet Infectious Diseases.**

---

## 👤 Author

**[Your Name]** — Senior Project, AI in Medical Engineering  
Applying to: [Steinbeis-Next MSc AI in Medical Engineering](https://www.steinbeis-next.de/)

---

*Built with Python · ChEMBL API · scikit-learn · NetworkX · HTML/CSS/JS*
