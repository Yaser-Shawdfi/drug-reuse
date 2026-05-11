import os
import re

def strip_python_comments(content):
    lines = []
    for line in content.split('\n'):
        stripped = line.strip()
        # Keep Jupyter cell markers and shebangs
        if stripped.startswith('# %%') or stripped.startswith('#!'):
            lines.append(line)
        # Skip full line comments
        elif stripped.startswith('#'):
            continue
        else:
            # Very basic inline comment removal (unsafe for '#' in strings, but okay for this project)
            if ' #' in line and '"' not in line[line.find('#'):] and "'" not in line[line.find('#'):]:
                line = line.split(' #')[0]
            lines.append(line)
    return '\n'.join(lines)

def strip_js_css_comments(content):
    # Remove /* ... */
    content = re.sub(r'/\*[\s\S]*?\*/', '', content)
    # Remove // ... (only for JS, but simple regex)
    content = re.sub(r'//.*', '', content)
    return content

def strip_html_comments(content):
    return re.sub(r'<!--[\s\S]*?-->', '', content)

targets = [
    ('src/fetch_data.py', strip_python_comments),
    ('src/knowledge_graph.py', strip_python_comments),
    ('src/similarity.py', strip_python_comments),
    ('notebooks/drug_repurposing_analysis.py', strip_python_comments),
    ('web/app.js', strip_js_css_comments),
    ('web/style.css', strip_js_css_comments),
    ('web/index.html', strip_html_comments),
]

for filepath, processor in targets:
    if os.path.exists(filepath):
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        cleaned = processor(content)
        
        # Remove empty lines that were just comments
        cleaned = '\n'.join([line for line in cleaned.split('\n') if line.strip() or line == ''])
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(cleaned)
        print(f"Cleaned {filepath}")
