// ── Drug Data (embedded — sourced from ChEMBL + published clinical literature) ──
const DRUGS = [
  { name:"Baricitinib", use:"Rheumatoid Arthritis", cls:"JAK Inhibitor", target:"JAK1/JAK2", score:0.94, ai:0.94, lit:312, status:"FDA Approved for COVID-19", mw:371.42, logp:1.0, hbd:3, hba:8 },
  { name:"Dexamethasone", use:"Inflammation", cls:"Corticosteroid", target:"Glucocorticoid Receptor", score:0.92, ai:0.91, lit:498, status:"Standard of Care", mw:392.46, logp:1.83, hbd:3, hba:7 },
  { name:"Remdesivir", use:"Ebola", cls:"Antiviral", target:"RdRp", score:0.91, ai:0.90, lit:421, status:"FDA Approved for COVID-19", mw:602.58, logp:1.78, hbd:4, hba:12 },
  { name:"Tocilizumab", use:"Rheumatoid Arthritis", cls:"IL-6 Inhibitor", target:"IL-6 Receptor", score:0.88, ai:0.87, lit:287, status:"EUA Approved", mw:148000, logp:null, hbd:0, hba:0 },
  { name:"Ruxolitinib", use:"Myelofibrosis", cls:"JAK Inhibitor", target:"JAK1/JAK2", score:0.88, ai:0.86, lit:198, status:"Clinical Trials", mw:306.36, logp:2.53, hbd:2, hba:5 },
  { name:"Camostat", use:"Pancreatitis", cls:"Serine Protease Inhibitor", target:"TMPRSS2", score:0.87, ai:0.85, lit:134, status:"Clinical Trials", mw:398.46, logp:0.78, hbd:3, hba:9 },
  { name:"Nafamostat", use:"Blood Coagulation", cls:"Serine Protease Inhibitor", target:"TMPRSS2", score:0.86, ai:0.84, lit:118, status:"Clinical Trials", mw:347.37, logp:-2.21, hbd:5, hba:8 },
  { name:"Sarilumab", use:"Rheumatoid Arthritis", cls:"IL-6 Inhibitor", target:"IL-6 Receptor", score:0.85, ai:0.83, lit:112, status:"Clinical Trials", mw:null, logp:null, hbd:0, hba:0 },
  { name:"Favipiravir", use:"Influenza", cls:"Antiviral", target:"RdRp", score:0.82, ai:0.80, lit:198, status:"Approved in some countries", mw:157.10, logp:-1.11, hbd:2, hba:4 },
  { name:"Fluvoxamine", use:"Depression", cls:"SSRI", target:"Sigma-1 Receptor", score:0.76, ai:0.74, lit:147, status:"Positive Trials", mw:318.33, logp:3.20, hbd:1, hba:4 },
  { name:"Colchicine", use:"Gout", cls:"Anti-inflammatory", target:"Tubulin", score:0.77, ai:0.75, lit:167, status:"Clinical Trials", mw:399.44, logp:1.32, hbd:2, hba:7 },
  { name:"Ciclesonide", use:"Asthma", cls:"Corticosteroid", target:"Glucocorticoid Receptor", score:0.79, ai:0.77, lit:89, status:"Clinical Trials", mw:540.69, logp:2.86, hbd:1, hba:7 },
  { name:"Nitazoxanide", use:"Parasitic Infections", cls:"Antiprotozoal", target:"Multiple", score:0.74, ai:0.72, lit:102, status:"Clinical Trials", mw:307.28, logp:0.98, hbd:2, hba:6 },
  { name:"Lopinavir", use:"HIV", cls:"Protease Inhibitor", target:"3CLpro", score:0.72, ai:0.70, lit:175, status:"Clinical Trials", mw:628.80, logp:5.06, hbd:4, hba:8 },
  { name:"Imatinib", use:"Cancer (CML)", cls:"Tyrosine Kinase Inhibitor", target:"Abl/PDGFR", score:0.73, ai:0.71, lit:134, status:"Clinical Trials", mw:493.60, logp:3.54, hbd:3, hba:8 },
  { name:"Umifenovir", use:"Influenza", cls:"Antiviral", target:"TMPRSS2", score:0.75, ai:0.73, lit:128, status:"Clinical Trials", mw:477.40, logp:3.17, hbd:2, hba:5 },
  { name:"Quercetin", use:"Supplement", cls:"Flavonoid", target:"3CLpro/PLpro", score:0.70, ai:0.68, lit:213, status:"Observational Studies", mw:302.24, logp:1.48, hbd:5, hba:7 },
  { name:"Atorvastatin", use:"High Cholesterol", cls:"Statin", target:"HMG-CoA Reductase", score:0.67, ai:0.65, lit:189, status:"Observational Studies", mw:558.64, logp:6.36, hbd:4, hba:6 },
  { name:"Ivermectin", use:"Parasitic Infections", cls:"Antiparasitic", target:"Importin alpha", score:0.61, ai:0.58, lit:203, status:"Controversial", mw:875.10, logp:3.17, hbd:2, hba:14 },
  { name:"Hydroxychloroquine", use:"Malaria/Lupus", cls:"Antimalarial", target:"ACE2/Endosome", score:0.43, ai:0.40, lit:389, status:"Not Recommended", mw:335.87, logp:3.58, hbd:2, hba:4 },
];

const TARGETS = [
  { name:"Main Protease (3CLpro)", type:"Viral Protease", role:"Viral polyprotein processing", drugs:"Lopinavir, Ritonavir, Quercetin", desc:"Cleaves viral polyproteins into functional units; essential for replication" },
  { name:"RdRp (nsp12)", type:"Viral Polymerase", role:"Viral genome replication", drugs:"Remdesivir, Favipiravir", desc:"RNA-dependent RNA polymerase — copies viral genome" },
  { name:"TMPRSS2", type:"Human Protease", role:"Spike protein priming", drugs:"Camostat, Nafamostat, Umifenovir", desc:"Human serine protease that primes spike protein for membrane fusion" },
  { name:"JAK1/JAK2", type:"Human Kinase", role:"Cytokine storm signaling", drugs:"Baricitinib, Ruxolitinib", desc:"Signal transducers for pro-inflammatory cytokines during hyperinflammation" },
  { name:"IL-6 Receptor", type:"Human Cytokine Receptor", role:"Cytokine storm", drugs:"Tocilizumab, Sarilumab", desc:"Key driver of COVID-19 hyperinflammation — targeted by IL-6 inhibitors" },
  { name:"Glucocorticoid Receptor", type:"Nuclear Receptor", role:"Anti-inflammatory", drugs:"Dexamethasone, Ciclesonide", desc:"Mediates anti-inflammatory effects of corticosteroids" },
  { name:"Sigma-1 Receptor", type:"Human Receptor", role:"ER stress + inflammation", drugs:"Fluvoxamine", desc:"Chaperone involved in ER stress response, modulates cytokine production" },
  { name:"ACE2 Receptor", type:"Human Receptor", role:"SARS-CoV-2 entry point", drugs:"Hydroxychloroquine", desc:"Human cell surface receptor hijacked by spike protein for cell entry" },
];

// ── State ─────────────────────────────────────────────────────────────────────
let currentFilter = 'all';
let sortCol = 'score';
let sortAsc = false;

// ── Nav scroll effect ─────────────────────────────────────────────────────────
window.addEventListener('scroll', () => {
  document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 20);
  highlightActiveNav();
});

function highlightActiveNav() {
  const sections = ['hero','pipeline','predictions','explorer','graph','casestudy'];
  const scrollY = window.scrollY + 100;
  sections.forEach(id => {
    const el = document.getElementById(id);
    const link = document.querySelector(`.nav-link[href="#${id}"]`);
    if (!el || !link) return;
    const inView = scrollY >= el.offsetTop && scrollY < el.offsetTop + el.offsetHeight;
    link.classList.toggle('active', inView);
  });
}

// ── Particles ─────────────────────────────────────────────────────────────────
function spawnParticles() {
  const container = document.getElementById('heroParticles');
  for (let i = 0; i < 25; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 80 + 20;
    p.style.cssText = `
      width:${size}px; height:${size}px;
      left:${Math.random() * 100}%;
      animation-duration:${Math.random() * 12 + 8}s;
      animation-delay:${Math.random() * 8}s;
      opacity:0.08;
    `;
    container.appendChild(p);
  }
}

// ── Stat counters ─────────────────────────────────────────────────────────────
function animateCounters() {
  document.querySelectorAll('.stat-card').forEach((card, i) => {
    const target = +card.dataset.count;
    const suffix = card.dataset.suffix || '';
    const el = card.querySelector('.stat-number');
    let current = 0;
    const step = target / 50;
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = Math.floor(current) + suffix;
      if (current >= target) clearInterval(timer);
    }, 30);
  });
}

// ── Status helpers ────────────────────────────────────────────────────────────
function statusClass(status) {
  if (status.includes('FDA') || status.includes('Standard')) return 'status-approved';
  if (status.includes('Trial') || status.includes('EUA') || status.includes('Approved in') || status.includes('Positive')) return 'status-trials';
  if (status.includes('Not Recommended') || status.includes('Controversial')) return 'status-caution';
  return 'status-other';
}

function scoreColor(score) {
  if (score >= 0.85) return '#00e5a0';
  if (score >= 0.70) return '#4f8aff';
  if (score >= 0.55) return '#ff9f43';
  return '#ff4d6d';
}

// ── Predictions ───────────────────────────────────────────────────────────────
function renderPredictions() {
  const grid = document.getElementById('predictionsGrid');
  let drugs = [...DRUGS];

  if (currentFilter === 'approved') drugs = drugs.filter(d => d.status.includes('FDA') || d.status.includes('Standard') || d.status.includes('EUA'));
  else if (currentFilter === 'trials') drugs = drugs.filter(d => d.status.includes('Trial') || d.status.includes('Positive') || d.status.includes('Approved in'));
  else if (currentFilter === 'cautious') drugs = drugs.filter(d => d.status.includes('Not Recommended') || d.status.includes('Controversial') || d.status.includes('Observational'));

  drugs.sort((a, b) => b.ai - a.ai);

  grid.innerHTML = drugs.map((d, i) => `
    <div class="pred-card fade-in" style="animation-delay:${i * 0.04}s">
      <div class="pred-header">
        <div>
          <div class="pred-name">${d.name}</div>
          <div class="pred-use">Originally: ${d.use}</div>
        </div>
        <div class="pred-score">${(d.ai * 100).toFixed(0)}%</div>
      </div>
      <div class="pred-target">🎯 Target: ${d.target}</div>
      <div class="score-bar"><div class="score-fill" style="width:${d.ai * 100}%; background:linear-gradient(90deg,${scoreColor(d.ai)},#4f8aff)"></div></div>
      <span class="pred-status ${statusClass(d.status)}">${d.status}</span>
    </div>
  `).join('');
}

document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    renderPredictions();
  });
});

// ── Drug Table ────────────────────────────────────────────────────────────────
function renderTable() {
  const search = document.getElementById('drugSearch').value.toLowerCase();
  const cls = document.getElementById('classFilter').value;
  const sts = document.getElementById('statusFilter').value;

  let drugs = DRUGS.filter(d => {
    const matchSearch = !search || [d.name, d.use, d.cls, d.target].some(v => v.toLowerCase().includes(search));
    const matchCls = !cls || d.cls === cls;
    const matchSts = !sts || d.status === sts;
    return matchSearch && matchCls && matchSts;
  });

  drugs.sort((a, b) => {
    const va = a[sortCol], vb = b[sortCol];
    if (typeof va === 'number') return sortAsc ? va - vb : vb - va;
    return sortAsc ? String(va).localeCompare(String(vb)) : String(vb).localeCompare(String(va));
  });

  const tbody = document.getElementById('drugTableBody');
  tbody.innerHTML = drugs.map(d => {
    const c = scoreColor(d.score);
    return `<tr>
      <td><strong>${d.name}</strong></td>
      <td>${d.use}</td>
      <td>${d.cls}</td>
      <td style="max-width:180px;white-space:normal;font-size:0.8rem;color:var(--text-secondary)">${d.target}</td>
      <td><span class="score-badge" style="background:${c}22;color:${c};border:1px solid ${c}44">${(d.score * 100).toFixed(0)}%</span></td>
      <td><span class="pred-status ${statusClass(d.status)}">${d.status}</span></td>
    </tr>`;
  }).join('');

  document.getElementById('tableCount').textContent = `Showing ${drugs.length} of ${DRUGS.length} drugs`;
}

function populateFilters() {
  const classes = [...new Set(DRUGS.map(d => d.cls))].sort();
  const statuses = [...new Set(DRUGS.map(d => d.status))].sort();
  const clsSel = document.getElementById('classFilter');
  const stsSel = document.getElementById('statusFilter');
  classes.forEach(c => clsSel.innerHTML += `<option value="${c}">${c}</option>`);
  statuses.forEach(s => stsSel.innerHTML += `<option value="${s}">${s}</option>`);
}

document.getElementById('drugSearch').addEventListener('input', renderTable);
document.getElementById('classFilter').addEventListener('change', renderTable);
document.getElementById('statusFilter').addEventListener('change', renderTable);
document.querySelectorAll('.sortable').forEach(th => {
  th.addEventListener('click', () => {
    const col = th.dataset.col;
    if (sortCol === col) sortAsc = !sortAsc; else { sortCol = col; sortAsc = false; }
    renderTable();
  });
});

// ── Knowledge Graph (Canvas-based force simulation) ───────────────────────────
function buildGraph() {
  const canvas = document.getElementById('knowledgeGraph');
  const ctx = canvas.getContext('2d');
  const container = document.getElementById('graphContainer');
  const tooltip = document.getElementById('graphTooltip');

  function resize() {
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
  }
  resize();
  window.addEventListener('resize', () => { resize(); simulate(); });

  // Build nodes
  const nodes = [];
  const links = [];

  // COVID-19 center node
  nodes.push({ id: 'COVID-19', type: 'disease', color: '#e74c3c', r: 22, x: canvas.width / 2, y: canvas.height / 2, vx: 0, vy: 0 });

  // Target nodes
  TARGETS.forEach((t, i) => {
    const angle = (i / TARGETS.length) * Math.PI * 2;
    nodes.push({ id: t.name, type: 'protein', color: '#9b59b6', r: 14, x: canvas.width/2 + Math.cos(angle)*160, y: canvas.height/2 + Math.sin(angle)*130, vx: 0, vy: 0, meta: t });
    links.push({ source: 0, target: nodes.length - 1, strength: 0.3 });
  });

  // Drug nodes
  DRUGS.slice(0, 14).forEach((d, i) => {
    const angle = (i / 14) * Math.PI * 2 + 0.3;
    const col = d.score >= 0.85 ? '#27ae60' : d.score >= 0.70 ? '#3498db' : d.score >= 0.50 ? '#f39c12' : '#e74c3c';
    const r = 7 + d.score * 10;
    nodes.push({ id: d.name, type: 'drug', color: col, r, x: canvas.width/2 + Math.cos(angle)*280, y: canvas.height/2 + Math.sin(angle)*220, vx: 0, vy: 0, meta: d });
    // Link drug to matching target
    const tIdx = nodes.findIndex(n => n.type === 'protein' && d.target.toLowerCase().includes(n.id.toLowerCase().split(' ')[0]));
    if (tIdx > 0) links.push({ source: nodes.length - 1, target: tIdx, strength: 0.15 });
    else links.push({ source: nodes.length - 1, target: 1 + (i % TARGETS.length), strength: 0.08 });
  });

  let scale = 1, offsetX = 0, offsetY = 0;
  let dragging = null, lastMouse = null;

  function simulate() {
    const W = canvas.width, H = canvas.height;
    const cx = W / 2 + offsetX, cy = H / 2 + offsetY;

    // Force: repulsion
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[j].x - nodes[i].x;
        const dy = nodes[j].y - nodes[i].y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const minDist = (nodes[i].r + nodes[j].r) * 4;
        if (dist < minDist) {
          const f = (minDist - dist) / dist * 0.15;
          nodes[i].vx -= dx * f; nodes[i].vy -= dy * f;
          nodes[j].vx += dx * f; nodes[j].vy += dy * f;
        }
      }
    }

    // Force: center attraction for COVID node
    nodes[0].vx += (cx - nodes[0].x) * 0.05;
    nodes[0].vy += (cy - nodes[0].y) * 0.05;

    // Force: link attraction
    links.forEach(l => {
      const a = nodes[l.source], b = nodes[l.target];
      if (!a || !b) return;
      const dx = b.x - a.x, dy = b.y - a.y;
      a.vx += dx * l.strength * 0.1; a.vy += dy * l.strength * 0.1;
      b.vx -= dx * l.strength * 0.1; b.vy -= dy * l.strength * 0.1;
    });

    // Update positions
    nodes.forEach((n, i) => {
      if (dragging === i) return;
      n.vx *= 0.85; n.vy *= 0.85;
      n.x = Math.max(n.r + 10, Math.min(W - n.r - 10, n.x + n.vx));
      n.y = Math.max(n.r + 10, Math.min(H - n.r - 10, n.y + n.vy));
    });

    // Draw
    ctx.clearRect(0, 0, W, H);

    // Links
    links.forEach(l => {
      const a = nodes[l.source], b = nodes[l.target];
      if (!a || !b) return;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.strokeStyle = 'rgba(99,140,255,0.15)';
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    // Nodes
    nodes.forEach(n => {
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = n.color + '33';
      ctx.fill();
      ctx.strokeStyle = n.color;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Label
      ctx.fillStyle = '#edf2ff';
      ctx.font = `${Math.max(9, n.r * 0.65)}px Inter, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const label = n.id.length > 14 ? n.id.slice(0, 12) + '…' : n.id;
      ctx.fillText(label, n.x, n.y + n.r + 10);
    });

    requestAnimationFrame(simulate);
  }

  simulate();

  // Tooltip on hover
  canvas.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left, my = e.clientY - rect.top;
    const hit = nodes.find(n => Math.hypot(n.x - mx, n.y - my) < n.r + 5);
    if (hit) {
      const m = hit.meta;
      tooltip.style.opacity = 1;
      tooltip.style.left = (mx + 12) + 'px';
      tooltip.style.top = (my - 20) + 'px';
      tooltip.innerHTML = m
        ? `<strong>${hit.id}</strong><br/><span style="color:#8fa3cc;font-size:0.78rem">${m.use || m.role || m.type}</span>`
        : `<strong>${hit.id}</strong>`;
    } else {
      tooltip.style.opacity = 0;
    }
  });

  // Drag
  canvas.addEventListener('mousedown', e => {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left, my = e.clientY - rect.top;
    const idx = nodes.findIndex(n => Math.hypot(n.x - mx, n.y - my) < n.r + 5);
    if (idx >= 0) { dragging = idx; lastMouse = { x: mx, y: my }; }
  });
  canvas.addEventListener('mousemove', e => {
    if (dragging === null) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left, my = e.clientY - rect.top;
    nodes[dragging].x = mx; nodes[dragging].y = my;
    nodes[dragging].vx = 0; nodes[dragging].vy = 0;
  });
  canvas.addEventListener('mouseup', () => { dragging = null; });

  // Controls
  document.getElementById('graphReset').onclick = () => { scale = 1; offsetX = 0; offsetY = 0; };
}

// ── Intersection Observer for animations ──────────────────────────────────────
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.opacity = 1;
      e.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.timeline-card, .impact-card, .method-card').forEach(el => {
  el.style.opacity = 0;
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});

// ── Init ──────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  spawnParticles();
  animateCounters();
  renderPredictions();
  populateFilters();
  renderTable();
  buildGraph();
});
