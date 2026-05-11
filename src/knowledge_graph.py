"""
Knowledge Graph Builder
========================
Constructs a Drug-Protein-Disease knowledge graph using NetworkX.
Nodes: Drugs, Proteins (targets), Drug Classes, Clinical Statuses
Edges: drug→target, drug→class, drug→status

Exports to JSON format for D3.js visualization in the web dashboard.
"""

import json
import os
import pandas as pd
import numpy as np
import networkx as nx


def build_knowledge_graph(drugs_df: pd.DataFrame,
                          targets_df: pd.DataFrame) -> nx.DiGraph:
    """
    Build a directed knowledge graph connecting drugs to their targets,
    drug classes, and COVID-19 clinical statuses.

    Returns
    -------
    nx.DiGraph
    """
    G = nx.DiGraph()

    G.add_node("COVID-19", node_type="disease", color="#e74c3c", size=30)

    for _, row in targets_df.iterrows():
        G.add_node(
            row["target_name"],
            node_type="protein",
            color="#9b59b6",
            size=20,
            description=row["description"],
            pdb_id=row.get("pdb_id", "N/A")
        )
        G.add_edge("COVID-19", row["target_name"],
                   relation="has_target", weight=2)

    drug_classes_added = set()

    for _, drug in drugs_df.iterrows():
        name = drug["drug_name"]
        score = float(drug["covid_score"]) if pd.notna(drug["covid_score"]) else 0.5

        status_colors = {
            "FDA Approved for COVID-19": "#27ae60",
            "EUA Approved": "#2ecc71",
            "Standard of Care": "#27ae60",
            "EUA (with Nirmatrelvir)": "#2ecc71",
            "Positive Trials": "#3498db",
            "Clinical Trials": "#3498db",
            "Approved in some countries": "#f39c12",
            "Observational Studies": "#f39c12",
            "Controversial": "#e67e22",
            "Not Recommended": "#e74c3c",
            "Weak Evidence": "#95a5a6",
            "In Vitro Only": "#95a5a6",
        }
        color = status_colors.get(str(drug["clinical_status"]), "#3498db")

        G.add_node(
            name,
            node_type="drug",
            color=color,
            size=10 + score * 15,
            original_use=str(drug["original_use"]),
            drug_class=str(drug["drug_class"]),
            covid_score=score,
            clinical_status=str(drug["clinical_status"])
        )

        targets_str = str(drug["target_protein"])
        for t in targets_str.split("/"):
            t = t.strip()
            for _, trow in targets_df.iterrows():
                if t.lower() in trow["target_name"].lower() or \
                   trow["target_name"].lower() in t.lower():
                    G.add_edge(name, trow["target_name"],
                               relation="inhibits", weight=score)
                    break

        drug_class = str(drug["drug_class"])
        if drug_class not in drug_classes_added:
            G.add_node(drug_class, node_type="class",
                       color="#f39c12", size=14)
            drug_classes_added.add(drug_class)
        G.add_edge(drug_class, name, relation="contains", weight=1)

    return G


def graph_to_d3_json(G: nx.DiGraph) -> dict:
    """
    Convert NetworkX graph to D3.js force-directed graph format.

    Returns
    -------
    dict with 'nodes' and 'links' lists
    """
    nodes = []
    node_index = {node: i for i, node in enumerate(G.nodes())}

    for node, attrs in G.nodes(data=True):
        nodes.append({
            "id": node,
            "index": node_index[node],
            "node_type": attrs.get("node_type", "unknown"),
            "color": attrs.get("color", "#95a5a6"),
            "size": float(attrs.get("size", 10)),
            "original_use": attrs.get("original_use", ""),
            "drug_class": attrs.get("drug_class", ""),
            "covid_score": attrs.get("covid_score", 0),
            "clinical_status": attrs.get("clinical_status", ""),
            "description": attrs.get("description", ""),
        })

    links = []
    for src, tgt, attrs in G.edges(data=True):
        links.append({
            "source": node_index[src],
            "target": node_index[tgt],
            "source_id": src,
            "target_id": tgt,
            "relation": attrs.get("relation", ""),
            "weight": float(attrs.get("weight", 1)),
        })

    return {"nodes": nodes, "links": links}


def export_graph_json(G: nx.DiGraph, output_path: str):
    """Export the graph as JSON for the web dashboard."""
    data = graph_to_d3_json(G)
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, "w") as f:
        json.dump(data, f, indent=2)
    print(f"Graph exported: {len(data['nodes'])} nodes, {len(data['links'])} edges")
    print(f"Saved to: {output_path}")


def get_graph_stats(G: nx.DiGraph) -> dict:
    """Return summary statistics of the knowledge graph."""
    node_types = {}
    for _, attrs in G.nodes(data=True):
        t = attrs.get("node_type", "unknown")
        node_types[t] = node_types.get(t, 0) + 1

    return {
        "total_nodes": G.number_of_nodes(),
        "total_edges": G.number_of_edges(),
        "node_types": node_types,
        "density": round(nx.density(G), 4),
    }


if __name__ == "__main__":
    base = os.path.join(os.path.dirname(__file__), "..")
    drugs_df = pd.read_csv(os.path.join(base, "data", "covid_drug_candidates.csv"))
    drugs_df.replace("N/A", None, inplace=True)

    targets_df = pd.read_csv(os.path.join(base, "data", "drug_targets.csv"))

    G = build_knowledge_graph(drugs_df, targets_df)

    stats = get_graph_stats(G)
    print("=== Knowledge Graph Statistics ===")
    for k, v in stats.items():
        print(f"  {k}: {v}")

    out_path = os.path.join(base, "web", "data", "graph.json")
    export_graph_json(G, out_path)
