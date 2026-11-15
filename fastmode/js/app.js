/* MISSAO IPE — app (MVP) */
(function () {
  const D = window.MIP_DATA;
  const M = window.MIP;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const stage = $('#stage');

  const S = {
    screen: 'boot', mission: null, objetivo: null, reqs: {},
    build: null, orbit: null, launcher: null, seed: '', party: false, role: 0,
    flags: { justificou: false, checouMassa: false, reagiu: false, perdeuJanela: false, assinaturas: 0, resolveuVeto: false },
    cat: 'bar',
  };
  let stats = null, deck = [], ops = null, lastResult = null, muted = false;

  /* ---------- utils ---------- */
  const fmt = (n, d = 0) => n.toLocaleString('pt-BR', { minimumFractionDigits: d, maximumFractionDigits: d });
  const money = (n) => fmt(n, 1) + ' M$';
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const scn = () => D.scenarios.find((s) => s.id === S.mission);

  function toast(msg) {
    const t = $('#toast'); t.textContent = msg; t.classList.add('on');
    clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove('on'), 2200);
  }

  /* tiny audio */
  let actx = null;
  function blip(f = 520, dur = 0.06, type = 'sine', vol = 0.05) {
    if (muted) return;
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      const o = actx.createOscillator(), g = actx.createGain();
      o.type = type; o.frequency.value = f;
      g.gain.value = vol; o.connect(g); g.connect(actx.destination);
      o.start(); g.gain.exponentialRampToValueAtTime(0.0001, actx.currentTime + dur);
      o.stop(actx.currentTime + dur + 0.02);
    } catch (e) { }
  }

  /* ---------- state helpers ---------- */
  const clone = (o) => JSON.parse(JSON.stringify(o));
  function bestOf(m) { try { return (JSON.parse(localStorage.getItem('mip:best') || '{}'))[m] || 0; } catch (e) { return 0; } }
  function setBest(m, v) { try { const b = JSON.parse(localStorage.getItem('mip:best') || '{}'); if (v > (b[m] || 0)) { b[m] = v; localStorage.setItem('mip:best', JSON.stringify(b)); } } catch (e) { } }
  function boot() {
    const hash = location.hash.replace(/^#c=/, '');
    const saved = localStorage.getItem('mip:save');
    if (hash) {
      const p = M.decode(hash);
      if (p) { restore(p); return; }
    }
    if (saved) {
      try { const p = JSON.parse(saved); restore(p, true); return; } catch (e) { }
    }
    go('boot');
  }

  function restore(p, silent) {
    S.mission = p.m; S.objetivo = p.o; S.reqs = p.r || {}; S.build = p.b;
    S.orbit = p.orb; S.launcher = p.l; S.seed = p.s || 'MIP';
    stats = M.compute(S);
    if (silent) toast('missão restaurada');
    go(S.build && S.orbit ? 'projeto' : 'objetivo');
    renderAll();
  }

  function save() {
    localStorage.setItem('mip:save', JSON.stringify({ m: S.mission, o: S.objetivo, r: S.reqs, b: S.build, orb: S.orbit, l: S.launcher, s: S.seed }));
  }

  function startMission(id) {
    S.mission = id; S.objetivo = null; S.reqs = {};
    const s = scn();
    S.build = M.emptyBuild(s);
    S.orbit = (s.orbitos && s.orbitos[0]) || null;
    S.launcher = null; S.seed = 'IPE-' + Math.random().toString(36).slice(2, 7).toUpperCase();
    S.flags = { justificou: false, checouMassa: false, reagiu: false, perdeuJanela: false, assinaturas: 0, resolveuVeto: false };
    S.compare = null;
    document.body.dataset.mission = id;
    s.requisitos.forEach((r) => { S.reqs[r.id] = r.obrigatorio ? 'esp' : 'min'; });
    stats = M.compute(S);
    go('brief');
  }

  function go(name) {
    S.screen = name;
    $$('.screen').forEach((el) => el.classList.toggle('is-active', el.dataset.screen === name));
    window.scrollTo({ top: 0, behavior: 'smooth' });
    $('#top-mission').textContent = scn() ? scn().codigo + ' · ' + scn().nome_curto : 'seleção';
    if (S.mission) document.body.dataset.mission = S.mission;
    render();
  }

  function render() {
    const map = {
      boot: renderBoot, select: renderSelect, brief: renderBrief, objetivo: renderObjetivo,
      requisitos: renderRequisitos, projeto: renderProjeto, lancamento: renderLancamento,
      operacoes: renderOps, relatorio: renderRelatorio,
    };
    (map[S.screen] || (() => { }))();
    $('#top-seed').textContent = S.seed || '—';
  }

  function renderAll() { render(); }

  /* ---------- screens ---------- */
  function renderBoot() {
    $('#s-boot').innerHTML = `
      <div class="boot">
        <div class="rings">${ringsSvg()}</div>
        <div class="stagger">
          <div class="kicker" style="justify-content:center">NASA SPACE APPS 2026 · SPACE MISSION DESIGN</div>
          <h1>MISSAO<br>IPE</h1>
          <p class="sub">A tripulação é o instrumento mais frágil da missão.
          Projete, lance e opere uma missão espacial — e descubra, no relatório, exatamente por que ela floresceu ou quebrou.</p>
          <div class="btn-row" style="justify-content:center">
            <button class="btn" data-act="start">Iniciar missão</button>
            <button class="btn ghost" data-act="sandbox">Como jogar</button>
          </div>
          <div class="meta">
            <span>1–4 jogadores</span><span>45 min</span><span>determinístico</span><span>offline</span>
          </div>
        </div>
      </div>`;
  }

  function ringsSvg() {
    const r = [90, 130, 175, 225, 280];
    return `<svg viewBox="0 0 700 700" fill="none">
      ${r.map((x, i) => `<circle cx="350" cy="350" r="${x}" stroke="rgba(140,180,255,${0.10 - i * 0.012})" stroke-width="1" stroke-dasharray="${i % 2 ? '3 9' : '1 7'}"/>`).join('')}
      <circle cx="350" cy="350" r="4" fill="#f5b841"/>
      <circle cx="350" cy="80" r="3" fill="#6fe3ff"/>
      <circle cx="596" cy="470" r="2.5" fill="#ff5c8a"/>
    </svg>`;
  }

  function renderSelect() {
    $('#s-select').innerHTML = `
      <div class="stagger">
        <div class="kicker">seleção de missão</div>
        <div class="between"><h2>Qual janela você vai abrir?</h2><span class="small">${D.scenarios.length} cenários</span></div>
        <p class="lead" style="margin-top:10px">Cada missão é um pacote de restrições. Nenhuma cobre tudo — o conjunto cobre.</p>
        <div class="grid g3" style="margin-top:26px">
          ${D.scenarios.map((s) => `
            <button class="card" data-act="pick-mission" data-id="${s.id}">
              <span class="tick">✓</span>
              <div class="small">${s.codigo} · ${s.tripulacao ? 'tripulada' : 'robótica'}</div>
              <h3 style="margin-top:6px">${s.nome_curto}</h3>
              <div class="desc">${s.briefing}</div>
              <div class="stats">
                <span><b>${money(s.orcamento_ms)}</b></span>
                <span><b>${s.duracao_meses}</b> meses</span>
                <span><b>${s.meta_ciencia}</b> pts meta</span>
                ${bestOf(s.id) ? `<span>recorde <b>${bestOf(s.id)}</b></span>` : ''}
              </div>
            </button>`).join('')}
        </div>
        <div class="foot"><span>Escolha uma missão para ver o briefing</span><span>MISSAO IPE · MVP</span></div>
      </div>`;
  }

  function renderBrief() {
    const s = scn();
    $('#s-brief').innerHTML = `
      <div class="stagger">
        <div class="kicker">${s.codigo} · briefing</div>
        <div class="between">
          <h2>${s.nome}</h2>
          <div class="hstack"><span class="chip">orçamento <b>${money(s.orcamento_ms)}</b></span>
          <span class="chip">prazo <b>${s.prazo_meses} meses</b></span>
          <span class="chip">duração <b>${s.duracao_meses} meses</b></span></div>
        </div>
        <div class="grid g2" style="margin-top:24px">
          <div class="panel">
            <div class="label">a missão</div>
            <p class="lead" style="color:var(--text)">${s.briefing}</p>
            <div class="hr"></div>
            <div class="label">regra de ouro</div>
            <p class="desc" style="color:var(--muted)">Objetivo → requisitos → projeto. Nada é de graça: cada peça cobra massa, potência, dinheiro ou dados.</p>
          </div>
          <div class="panel">
            <div class="label">ficha operacional</div>
            <table>
              <tr><th>Órbitas permitidas</th><td class="mono">${s.orbitos.map((o) => D.orbits.find((x) => x.id === o).nome.split('·')[0].trim()).join(' · ')}</td></tr>
              <tr><th>Tripulação</th><td class="mono">${s.tripulacao || 'nenhuma'}</td></tr>
              <tr><th>Meta científica</th><td class="mono">${s.meta_ciencia} pts</td></tr>
              <tr><th>Dificuldade</th><td class="mono">${s.dificuldade_padrao}</td></tr>
              <tr><th>Semente</th><td class="mono">${S.seed}</td></tr>
            </table>
          </div>
        </div>
        <div class="btn-row"><button class="btn" data-act="to-objetivo">Assumir missão ▸</button></div>
      </div>`;
  }

  function renderObjetivo() {
    const s = scn();
    $('#s-objetivo').innerHTML = `
      <div class="stagger">
        <div class="kicker">fase 2 · CML 1 — ideia</div>
        <h2>O que vale a pena descobrir?</h2>
        <p class="lead" style="margin-top:8px">Escolha o objetivo primário. Ele trava — e define o critério de sucesso do resto da missão.</p>
        <div class="grid g2" style="margin-top:24px">
          ${s.objetivos.map((o) => `
            <button class="card ${S.objetivo === o.id ? 'sel' : ''}" data-act="pick-obj" data-id="${o.id}">
              <span class="tick">✓</span>
              <div class="small">objetivo ${o.id}</div>
              <h3 style="margin-top:6px">${o.titulo}</h3>
              <div class="desc">${o.criterio}</div>
              <div class="stats"><span>meta <b>${o.meta_ciencia}</b> pts</span><span>risco <b>${o.risco}</b></span></div>
              <div class="why">${o.frase}</div>
            </button>`).join('')}
        </div>
        ${S.objetivo ? `
          <div class="panel" style="margin-top:20px">
            <div class="label">justificativa (vale checkpoint)</div>
            <p class="desc" style="color:var(--muted);margin:0 0 12px">Por que esta descoberta importa mais que as outras três?</p>
            <div class="hstack">
              ${['muda a política pública', 'fecha uma lacuna de dado', 'protege vidas', 'é o que ninguém mediu'].map((t) =>
                `<button class="btn ghost" data-act="justify" data-id="${t}" style="padding:9px 14px;font-size:10px">${t}</button>`).join('')}
            </div>
          </div>
          <div class="btn-row"><button class="btn" data-act="to-req" ${S.flags.justificou ? '' : 'disabled'}>Travar objetivo ▸</button></div>` : ''}
      </div>`;
  }

  function renderRequisitos() {
    const s = scn();
    $('#s-req').innerHTML = `
      <div class="stagger">
        <div class="kicker">fase 3 · CML 2 — viabilidade</div>
        <h2>Do desejo ao número.</h2>
        <p class="lead" style="margin-top:8px">O objetivo diz o que descobrir; o requisito diz o quanto. Níveis ambiciosos custam massa e dinheiro — e falhar um obrigatório derruba o sucesso para 175.</p>
        <div class="grid" style="margin-top:24px;gap:10px">
          ${s.requisitos.map((r) => {
            const cur = S.reqs[r.id] || 'min';
            const lvl = r.niveis.find((n) => n.nivel === cur);
            return `<div class="req">
              <div>
                <div class="name">${r.nome} ${r.obrigatorio ? '<span class="badge">obrigatório</span>' : '<span class="badge">opcional</span>'}</div>
                <div class="hint">alvo: ${lvl.alvo} ${r.unidade} · ${r.metrica.replace(/_/g, ' ')}${lvl.custo_ms ? ' · +' + money(lvl.custo_ms) : ''}</div>
              </div>
              <div class="seg">
                ${r.niveis.map((n) => `<button data-act="req" data-req="${r.id}" data-level="${n.nivel}" class="${cur === n.nivel ? 'on' : ''}">${n.nivel === 'min' ? 'mín' : n.nivel === 'esp' ? 'esp' : 'amb'}</button>`).join('')}
              </div>
            </div>`;
          }).join('')}
        </div>
        <div class="btn-row"><button class="btn" data-act="to-bench">Abrir bancada ▸</button>
          <button class="btn ghost" data-act="back-obj">Voltar ao objetivo</button></div>
      </div>`;
  }

  /* ---------- bench ---------- */
  const CATS = [
    { id: 'bar', nome: 'Barramento' }, { id: 'pwr', nome: 'Energia' },
    { id: 'com', nome: 'Comunicações' }, { id: 'solo', nome: 'Solo' },
    { id: 'carga', nome: 'Carga útil' }, { id: 'avi', nome: 'Aviônica' },
    { id: 'prot', nome: 'Proteção' }, { id: 'dados', nome: 'Dados' },
  ];

  function renderProjeto() {
    stats = M.compute(S);
    const s = scn();
    $('#s-projeto').innerHTML = `
      <div class="between" style="margin-bottom:18px">
        <div><div class="kicker">fase 4 · CML 3 — point design</div><h2>Bancada de projeto</h2></div>
        <div class="hstack">
          <button class="btn ghost" data-act="toggle-party" style="padding:9px 14px;font-size:10px">${S.party ? '4 papéis' : '1 jogador'}</button>
          <button class="btn ghost" data-act="compare" style="padding:9px 14px;font-size:10px">${S.compare ? 'Comparar A/B' : 'Capturar A'}</button>
          <button class="btn" data-act="to-launch">Lançar ▸</button>
        </div>
      </div>
      <div class="bench">
        <nav class="rail">
          ${CATS.map((c) => `<button data-act="cat" data-id="${c.id}" class="${S.cat === c.id ? 'on' : ''}">${c.nome}<b>${catCount(c.id)}</b></button>`).join('')}
        </nav>
        <div class="options" id="options"></div>
        <aside class="hud panel">
          <div class="label">sistemas</div>
          <div class="meters" id="meters"></div>
          <div class="hr hud-reqs" style="margin:16px 0"></div>
          <div class="label hud-reqs">requisitos</div>
          <div id="reqs-mini" class="hud-reqs" style="display:grid;gap:6px;margin-top:6px"></div>
          <div class="hr hud-arch" style="margin:16px 0"></div>
          <div class="label hud-arch">arquitetura</div>
          <div id="arch" class="mono hud-arch" style="font-size:11px;color:var(--muted);line-height:1.7"></div>
        </aside>
      </div>`;
    renderOptions(); renderHud();
  }

  function catCount(id) {
    const b = S.build;
    if (id === 'bar') return b.bus ? 1 : 0;
    if (id === 'pwr') return (b.power ? 1 : 0) + b.batteries;
    if (id === 'com') return b.comms ? 1 : 0;
    if (id === 'solo') return b.ground ? 1 : 0;
    if (id === 'carga') return b.instruments.length;
    if (id === 'avi') return b.avionica ? 1 : 0;
    if (id === 'prot') return b.protection.length;
    if (id === 'dados') return 1;
    return 0;
  }

  function renderOptions() {
    const box = $('#options'); if (!box) return;
    const b = S.build, s = scn();
    const sel = (cond) => cond ? 'sel' : '';
    let html = '';
    if (S.cat === 'bar') {
      html = D.buses.map((x) => cardOpt(x, b.bus === x.id, 'bus', `${x.massa_kg} kg · ${x.potencia_base_w} W base`, x.descricao, `slots ${x.slots}`)).join('');
    } else if (S.cat === 'pwr') {
      html = D.power.map((x) => {
        const bad = x.orbitos !== '*' && !x.orbitos.includes(S.orbit);
        return cardOpt(x, b.power === x.id, 'power', `${x.massa_kg || 0} kg · ${x.potencia_w} W`, x.descricao, bad ? 'incompatível com a órbita' : '', bad);
      }).join('');
      html += `<div class="panel" style="margin-top:6px">
        <div class="label">baterias · 30 kg · 3 M$ cada</div>
        <div class="hstack" style="justify-content:space-between">
          <div class="mono" style="color:var(--muted)">${b.batteries} × 1.400 Wh · ${fmt(b.batteries * 980)} Wh úteis</div>
          <div class="hstack"><button class="btn ghost" data-act="bat" data-id="-1" style="padding:8px 14px">−</button>
          <button class="btn ghost" data-act="bat" data-id="1" style="padding:8px 14px">+</button></div>
        </div></div>`;
    } else if (S.cat === 'com') {
      html = D.comms.map((x) => cardOpt(x, b.comms === x.id, 'comms', `${x.massa_kg} kg · ${x.potencia_w} W`, x.descricao, `${x.mbps} Mbps`)).join('');
    } else if (S.cat === 'solo') {
      html = D.ground.map((x) => {
        const bad = x.requisito === 'espaco_profundo' && !['dso', 'mars_orbit', 'l1', 'nrho'].includes(S.orbit);
        return cardOpt(x, b.ground === x.id, 'ground', money(x.custo_ms), x.observacao, `${x.downlink_h_dia} h/dia`, bad);
      }).join('');
    } else if (S.cat === 'carga') {
      const slots = b.bus ? D.buses.find((x) => x.id === b.bus).slots : 4;
      html = `<div class="small" style="margin-bottom:4px">slots ${b.instruments.length}/${slots}${b.bus ? '' : ' · provisório: escolha o barramento'}</div>` +
        D.instruments.map((x) => {
          const crewBad = x.tripulacao_requerida && !s.tripulacao;
          const full = b.instruments.length >= slots && !b.instruments.includes(x.id);
          return cardOpt(x, b.instruments.includes(x.id), 'instr', `${x.massa_kg} kg · ${x.potencia_w} W`, x.descricao || x.nome, `${x.ciencia} pts`, crewBad || full, crewBad ? 'requer tripulação' : full ? 'sem slot' : '');
        }).join('');
    } else if (S.cat === 'avi') {
      html = D.avionica.map((x) => cardOpt(x, b.avionica === x.id, 'avionica', `${x.massa_kg} kg · ${x.potencia_w} W`, `buffer ${x.buffer_dias}d · ±${x.apontamento_graus}°`, money(x.custo_ms))).join('');
    } else if (S.cat === 'prot') {
      html = D.protection.map((x) => cardOpt(x, b.protection.includes(x.id), 'prot', `${x.massa_kg} kg${x.por_tripulante ? ' × tripulante' : ''}`, x.porque, money(x.custo_ms))).join('');
    } else if (S.cat === 'dados') {
      html = D.dataLevels.map((x) => cardOpt(x, b.dataLevel === x.id, 'data', `×${x.multiplicador.toFixed(2)} ciência`, x.observacao, x.custo_ms_mes ? money(x.custo_ms_mes) + '/mês' : 'grátis')).join('');
    }
    box.innerHTML = html;
  }

  function cardOpt(x, on, kind, stats1, desc, extra, bad, badMsg) {
    return `<button class="card ${on ? 'sel' : ''} ${bad ? 'bad' : ''}" data-act="pick" data-kind="${kind}" data-id="${x.id}" ${bad ? 'data-bad="1"' : ''}>
      <span class="tick">✓</span>
      <h3>${x.nome}</h3>
      <div class="desc">${desc || ''}</div>
      <div class="stats"><span>${stats1 || ''}</span><span>${extra || ''}</span></div>
      ${bad && badMsg ? `<div class="why">${badMsg}</div>` : ''}
    </button>`;
  }

  function renderHud() {
    stats = M.compute(S);
    const s = scn();
    const massPct = stats.launcher && stats.cap ? clamp(stats.massaTotal / stats.cap, 0, 1) : 0;
    const budgetPct = clamp(stats.custoTotal / s.orcamento_ms, 0, 1);
    const meters = [
      { k: 'MASSA', v: stats.launcher ? `${fmt(stats.massaTotal)} / ${fmt(stats.cap)} kg` : `${fmt(stats.massaTotal)} kg`, p: massPct, bad: stats.overMass },
      { k: 'POTÊNCIA', v: `${fmt(stats.load)} / ${fmt(stats.gen)} W`, p: stats.gen ? clamp(stats.load / stats.gen, 0, 1) : 0, bad: stats.overPower },
      { k: 'DADOS', v: `${fmt(stats.gerado, 1)} / ${fmt(stats.downlink, 1)} GB`, p: stats.gerado ? clamp(stats.downlink / stats.gerado, 0, 1) : 0, bad: stats.dataLoss },
      { k: 'ORÇAMENTO', v: `${money(stats.custoTotal)} / ${money(s.orcamento_ms)}`, p: budgetPct, bad: stats.overBudget },
      ...(s.tripulacao ? [{ k: 'DOSE', v: `${fmt(stats.dosePct, 1)}% carreira`, p: clamp(stats.dosePct / 100, 0, 1), bad: stats.dosePct > 80 }] : []),
    ];
    $('#meters').innerHTML = meters.map((m) => `<div class="meter ${m.bad ? 'warn' : ''}">
      <span>${m.k}</span><span class="bar"><i style="transform:scaleX(${m.p.toFixed(3)})"></i></span><b>${m.v}</b></div>`).join('');
    $('#reqs-mini').innerHTML = stats.checks.map((c) => `<div class="hstack" style="justify-content:space-between">
      <span class="mono" style="color:var(--muted)">${c.nome}</span>
      <span class="badge ${c.ok ? 'ok' : 'no'}">${c.ok ? 'ok' : 'falha'}</span></div>`).join('');
    $('#arch').innerHTML = [
      stats.bus ? `${stats.bus.nome}` : '— sem barramento',
      stats.orbit ? D.orbits.find((o) => o.id === S.orbit).nome : '—',
      `${S.build.instruments.length} instrumento(s)`,
      `ciência ${fmt(stats.ciencia)} pts`,
    ].join('<br>');
  }

  /* ---------- launch ---------- */
  function renderLancamento() {
    stats = M.compute(S);
    const s = scn();
    const orbits = D.orbits.filter((o) => s.orbitos.includes(o.id));
    const launchers = D.launchers.filter((l) => l.capacidade_kg[S.orbit]);
    $('#s-launch').innerHTML = `
      <div class="stagger">
        <div class="kicker">fase 5 · CML 3 — fechamento</div>
        <h2>Órbita e veículo.</h2>
        <p class="lead" style="margin-top:8px">A órbita define cobertura, dose e comunicação. O veículo define o que cabe. A conta é simples e não perdoa.</p>
        <div class="grid g2" style="margin-top:22px">
          <div>
            <div class="label">órbita</div>
            <div class="grid" style="gap:8px">
              ${orbits.map((o) => `<button class="opt ${S.orbit === o.id ? 'sel' : ''}" data-act="orbit" data-id="${o.id}">
                <div><div class="n">${o.nome}</div><div class="d">${o.frase}</div></div>
                <div class="p">${o.dose_msv_dia} mSv/d<br>${Math.round(o.eclipse_fracao * 100)}% eclipse</div></button>`).join('')}
            </div>
          </div>
          <div>
            <div class="label">veículo</div>
            <div class="grid" style="gap:8px">
              ${launchers.map((l) => {
                const cap = l.capacidade_kg[S.orbit];
                const ok = stats.massaTotal <= cap;
                return `<button class="opt ${S.launcher === l.id ? 'sel' : ''}" data-act="launcher" data-id="${l.id}">
                  <div><div class="n">${l.nome}</div><div class="d">${ok ? 'cabem' : 'não cabem'} ${fmt(stats.massaTotal)} kg de ${fmt(cap)} kg</div></div>
                  <div class="p"><b>${money(l.custo_ms)}</b></div></button>`;
              }).join('')}
            </div>
          </div>
        </div>
        <div class="panel" style="margin-top:22px">
          <div class="label">verificação final</div>
          <div class="grid g2">
            <div class="mono" style="font-size:12px;line-height:2;color:var(--muted)">
              massa <b style="color:${stats.overMass ? 'var(--rose)' : 'var(--green)'}">${fmt(stats.massaTotal)} / ${fmt(stats.cap)} kg</b><br>
              orçamento <b style="color:${stats.overBudget ? 'var(--rose)' : 'var(--green)'}">${money(stats.custoTotal)}</b><br>
              energia <b style="color:${stats.overPower ? 'var(--rose)' : 'var(--green)'}">${fmt(stats.margemEnergia * 100, 0)}% de margem</b><br>
              dados <b style="color:${stats.dataLoss ? 'var(--rose)' : 'var(--green)'}">${fmt(stats.integridade * 100, 0)}% de integridade</b>
            </div>
            <div class="mono" style="font-size:12px;line-height:2;color:var(--muted)">
              ciência <b style="color:var(--text)">${fmt(stats.ciencia)} pts</b> / meta ${s.meta_ciencia}<br>
              requisitos <b style="color:${stats.checks.filter(c=>c.obrigatorio&&c.ok).length === stats.checks.filter(c=>c.obrigatorio).length ? 'var(--green)' : 'var(--amber)'}">${stats.checks.filter(c=>c.obrigatorio&&c.ok).length}/${stats.checks.filter(c=>c.obrigatorio).length} obrigatórios</b><br>
              vida útil <b style="color:var(--text)">${stats.vida} meses</b>
            </div>
          </div>
          ${stats.overMass ? `<p class="small" style="color:var(--rose);margin-top:14px">sua espaçonave não cabe neste veículo. troque de veículo, corte massa ou mude a órbita.</p>` : ''}
        </div>
        <div class="btn-row">
          <button class="btn" data-act="launch" ${stats.overMass || !S.launcher ? 'disabled' : ''}>Fechar e lançar ▸</button>
          <button class="btn ghost" data-act="back-bench">Voltar à bancada</button>
        </div>
      </div>`;
    if (stats.overMass) S.flags.checouMassa = true; else if (S.launcher) S.flags.checouMassa = true;
  }

  function doLaunch() {
    stats = M.compute(S);
    const ov = $('#launch');
    ov.classList.add('on');
    ov.innerHTML = `<canvas id="lc"></canvas>
      <div class="msg"><div class="count" id="cnt">3</div><div id="lmsg">ignição</div></div>`;
    const canvas = $('#lc');
    let n = 3;
    const tick = setInterval(() => {
      n--; const el = $('#cnt');
      if (el) el.textContent = n > 0 ? n : '0';
      blip(320 + (3 - n) * 90, 0.08, 'square', 0.04);
      if (n <= 0) {
        clearInterval(tick);
        $('#lmsg').textContent = 'inserção orbital';
        window.FX.launch(canvas, () => {
          setTimeout(() => { ov.classList.remove('on'); startOps(); }, 350);
        });
      }
    }, 620);
  }

  /* ---------- operations ---------- */
  function startOps() {
    stats = M.compute(S);
    deck = M.drawDeck(S);
    ops = { turn: 0, total: 6, cienciaMult: 1, integridade: stats.integridade, doseExtra: 0, saude: 100, custoExtra: 0, perda: 0, dano: 0, log: [] };
    go('operacoes');
  }

  function renderOps() {
    if (!ops) return;
    const s = scn();
    const ev = deck[ops.turn];
    if (!ev) return finish();
    const pctDose = clamp(((stats.dose + ops.doseExtra) / 600) * 100, 0, 100);
    $('#s-ops').innerHTML = `
      <div class="stagger">
        <div class="between">
          <div><div class="kicker">fase 6 · CML 4 — operações</div><h2>Turno ${ops.turn + 1} / ${ops.total}</h2></div>
          <div class="hstack">
            ${s.tripulacao ? `<span class="chip">dose <b>${fmt(pctDose, 1)}%</b></span>` : ''}
            <span class="chip">ciência <b>${fmt(stats.ciencia * ops.cienciaMult)}</b></span>
            ${s.tripulacao ? `<span class="chip">saúde <b>${fmt(ops.saude)}</b></span>` : ''}
          </div>
        </div>
        <div class="turnline">${Array.from({ length: ops.total }, (_, i) => `<span class="tl ${i < ops.turn ? 'done' : i === ops.turn ? 'now' : ''}">${i + 1}</span>`).join('')}</div>
        <div class="panel">
          <div class="label">evento · ${ev.nivel === 1 ? 'ambiente' : ev.nivel === 2 ? 'sistema' : 'humano'}</div>
          <div class="event">${ev.titulo}</div>
          <p class="lead" style="margin-top:10px">${ev.texto}</p>
          <div class="opt-list">
            ${ev.opcoes.map((o, i) => `<button class="choice" data-act="choice" data-i="${i}">
              <div><div>${o.label}</div><div class="c" style="margin-top:6px">${effectText(o.efeito)}</div></div>
              <div class="c">▸</div></button>`).join('')}
          </div>
        </div>
        <div class="panel" style="margin-top:14px">
          <div class="label">registro de bordo</div>
          <div class="log">${ops.log.length ? ops.log.map((l) => `<div class="row"><b>T${l.t}</b><span>${l.txt}</span></div>`).join('') : '<div class="row"><b>—</b><span>nenhuma decisão registrada</span></div>'}</div>
        </div>
      </div>`;
  }

  function effectText(e) {
    const p = [];
    if (e.dose_msv) p.push(`+${e.dose_msv} mSv`);
    if (e.ciencia_fracao) p.push(`−${Math.round(e.ciencia_fracao * 100)}% ciência`);
    if (e.saude) p.push(`${e.saude > 0 ? '+' : ''}${e.saude} saúde`);
    if (e.perda_dados_fracao) p.push(`−${Math.round(e.perda_dados_fracao * 100)}% dados`);
    if (e.orcamento_pct) p.push(`−${Math.round(e.orcamento_pct * 100)}% orçamento`);
    if (e.instrumento_off) p.push('−1 instrumento');
    return p.join(' · ') || 'sem custo direto';
  }

  function choose(i) {
    const ev = deck[ops.turn];
    const opt = ev.opcoes[i];
    M.applyOption(ops, opt, stats);
    ops.log.push({ t: ops.turn + 1, txt: `${ev.titulo} → ${opt.label}` });
    if (!S.flags.reagiu) S.flags.reagiu = true;
    if (ev.id === 'falha_comms') S.flags.perdeuJanela = true;
    ops.turn++;
    blip(440, 0.07, 'triangle', 0.04);
    if (ops.turn >= ops.total) finish(); else renderOps();
  }

  function finish() {
    const s = scn();
    const cienciaFinal = Math.max(0, stats.ciencia * ops.cienciaMult * (stats.integridade ? clamp(ops.integridade / stats.integridade, 0, 1) : 1) - ops.perda * 0.5);
    const doseFinal = stats.dose + ops.doseExtra;
    const st = Object.assign({}, stats, { ciencia: cienciaFinal, cienciaProjeto: stats.ciencia, dose: doseFinal, dosePct: doseFinal / 600 * 100 });
    const sc = M.score(S, { integridade: ops.integridade, dano: ops.dano }, st);
    lastResult = { sc, st, ops };
    setBest(S.mission, sc.total);
    go('relatorio');
  }

  /* ---------- report ---------- */
  function renderRelatorio() {
    const { sc, st, ops: o } = lastResult;
    const s = scn();
    const analog = (D.missoes_reais || []).find((m) => m.id === (s.missao_analoga || [])[0]);
    const total = sc.total;
    const pct = clamp(total / 1000, 0, 1);
    const R = 86, C = 2 * Math.PI * R;
    const frac = sc.objetivoOk && sc.allMandatory;
    $('#s-report').innerHTML = `
      <div class="stagger">
        <div class="kicker">relatório de missão · ${s.codigo}</div>
        <div class="between"><h2>${frac ? 'A missão floresceu.' : sc.objetivoOk ? 'Floresceu pela metade.' : 'Não floresceu.'}</h2>
          <div class="hstack"><span class="chip">${fmt(st.ciencia)} / ${s.meta_ciencia} pts</span><span class="chip">recorde <b>${bestOf(S.mission)}</b></span><span class="chip">semente <b>${S.seed}</b></span></div></div>
        <div class="panel" style="margin-top:22px">
          <div class="score">
            <div class="ring">
              <svg width="200" height="200" viewBox="0 0 200 200">
                <circle cx="100" cy="100" r="${R}" stroke="rgba(255,255,255,.08)" stroke-width="8" fill="none"/>
                <circle cx="100" cy="100" r="${R}" stroke="url(#g1)" stroke-width="8" fill="none" stroke-linecap="round"
                  stroke-dasharray="${C}" stroke-dashoffset="${C * (1 - pct)}"/>
                <defs><linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stop-color="#6fe3ff"/><stop offset="1" stop-color="#f5b841"/></linearGradient></defs>
              </svg>
              <div class="val"><b>${total}</b><span>de 1000</span></div>
            </div>
            <div class="brk">
              ${bar('sucesso', sc.sucesso, 350)}${bar('ciência', sc.ciencia, 250)}${bar('eficiência', sc.eficiencia, 200)}
              ${bar('decisão', sc.decisao, 150)}${bar('bônus', sc.bonus, 50)}
            </div>
          </div>
        </div>
        <div class="grid g2" style="margin-top:14px">
          <div class="panel">
            <div class="label">cadeia causal</div>
            <p class="lead" style="color:var(--text);margin-top:0">${causal(st, o)}</p>
            <div class="hr"></div>
            <div class="label">o que teria mudado</div>
            <p class="desc" style="color:var(--muted);margin:0">${levers(st, o)}</p>
          </div>
          <div class="panel">
            <div class="label">conformidade de requisitos</div>
            <table>
              ${st.checks.map((c) => `<tr><td>${c.nome}</td><td class="mono">${fmt(c.valor, c.valor < 10 ? 1 : 0)} ${c.unidade}</td>
                <td class="mono ${c.ok ? 'ok-t' : 'no-t'}">${c.ok ? 'ok' : 'falha'}</td></tr>`).join('')}
            </table>
          </div>
        </div>
        <div class="grid g2" style="margin-top:14px">
          <div class="panel">
            <div class="label">missão análoga</div>
            <p class="desc" style="color:var(--muted);margin:0">${analog ? `<b style="color:var(--text)">${analog.nome}</b> · ${analog.agencia} — ${analog.nota}` : 'sem análoga cadastrada.'}</p>
          </div>
          <div class="panel">
            <div class="label">código da missão</div>
            <div class="hstack" style="justify-content:space-between">
              <code class="mono" style="font-size:10px;color:var(--ice);word-break:break-all">${M.code(S).slice(0, 46)}…</code>
            </div>
            <div class="btn-row" style="margin-top:12px">
              <button class="btn ghost" data-act="copy" style="padding:9px 14px;font-size:10px">copiar link</button>
              <button class="btn ghost" data-act="restart" style="padding:9px 14px;font-size:10px">refazer</button>
              <button class="btn ghost" data-act="print" style="padding:9px 14px;font-size:10px">exportar PDF</button>
            </div>
          </div>
        </div>
        <div class="btn-row"><button class="btn" data-act="again">Nova missão ▸</button></div>
      </div>`;
  }

  function s_meta(st) { return st.scn ? st.scn.meta_ciencia : 0; }

  function bar(label, v, max) {
    return `<div class="row"><span>${label}</span><span class="b"><i style="width:${clamp(v / max, 0, 1) * 100}%"></i></span><b>${Math.round(v)}</b></div>`;
  }

  function causal(st, o) {
    const s = scn();
    if (st.cienciaProjeto >= s.meta_ciencia && st.ciencia < s.meta_ciencia) {
      const perda = Math.round((1 - st.ciencia / st.cienciaProjeto) * 100);
      return `O projeto entregava <b>${fmt(st.cienciaProjeto)} pts</b>. As operações custaram <b>${perda}%</b> — a missão chegou ao fim com ${fmt(st.ciencia)}. O que quebrou foi a decisão de cada turno, não a arquitetura.`;
    }
    if (st.overMass) return `Sua espaçonave pesa <b>${fmt(st.massaTotal)} kg</b> e o veículo levava ${fmt(st.cap)} kg. A massa não é burocracia: é o primeiro limite da física.`;
    if (st.overBudget) return `O projeto custou <b>${money(st.custoTotal)}</b> contra ${money(s.orcamento_ms)} disponíveis. Cada instrumento adiciona 0,8 mês e 12% de integração — e o orçamento não estica.`;
    if (st.overPower) return `A carga consome <b>${fmt(st.load)} W</b> e a geração entrega ${fmt(st.gen)} W. No eclipse, os instrumentos desligam em cascata.`;
    if (st.dataLoss) return `Você gerou <b>${fmt(st.gerado, 1)} GB/dia</b> e transmitiu ${fmt(st.downlink, 1)} GB/dia. O buffer guarda 2 dias: o dado antigo é sobrescrito.`;
    if (st.crew && st.dosePct > 80) return `A dose chegou a <b>${fmt(st.dosePct, 0)}% da carreira</b>. A 1,18 mSv/dia no espaço profundo, blindagem não é opcional.`;
    if (st.ciencia < s.meta_ciencia) return `A missão entregou <b>${fmt(st.ciencia)} de ${s.meta_ciencia} pontos</b> de ciência. Faltou instrumento — ou sobrou perda de dados.`;
    return `A arquitetura funcionou: <b>${fmt(st.ciencia)} pontos</b> de ciência com ${fmt(st.margemEnergia * 100, 0)}% de margem de energia e ${fmt(st.integridade * 100, 0)}% de integridade de dados.`;
  }

  function levers(st, o) {
    const p = [];
    if (st.cienciaProjeto >= s_meta(st) && st.ciencia < s_meta(st)) p.push('revisar o protocolo dos eventos: cada turno tem uma opção que não custa ciência');
    if (st.dataLoss) p.push('subir a banda ou reduzir o duty cycle do instrumento mais faminto');
    if (st.overMass) p.push('trocar o veículo ou cortar 30 kg de bateria');
    if (st.overPower) p.push('painel maior ou menos instrumentos ligados ao mesmo tempo');
    if (st.crew && st.dosePct > 60) p.push('uma blindagem passiva (−20% de GCR) ou colete para o SPE');
    if (!p.length) p.push('manter a arquitetura e investir o excedente em ciência');
    return p.join(' · ') + '.';
  }

  /* ---------- events ---------- */
  document.addEventListener('click', (e) => {
    const el = e.target.closest('[data-act]'); if (!el) return;
    const act = el.dataset.act;
    if (el.dataset.bad) { toast('incompatível — veja o motivo no cartão'); return; }
    switch (act) {
      case 'start': go('select'); blip(600); break;
      case 'sandbox': openHelp(); break;
      case 'pick-mission': startMission(el.dataset.id); blip(520); break;
      case 'to-objetivo': go('objetivo'); break;
      case 'pick-obj': S.objetivo = el.dataset.id; blip(560); renderObjetivo(); break;
      case 'justify': S.flags.justificou = true; toast('justificativa registrada'); renderObjetivo(); break;
      case 'back-obj': go('objetivo'); break;
      case 'to-req': go('requisitos'); break;
      case 'req': S.reqs[el.dataset.req] = el.dataset.level; blip(500); save(); renderRequisitos(); break;
      case 'to-bench': S.cat = 'bar'; go('projeto'); break;
      case 'back-bench': go('projeto'); break;
      case 'cat': S.cat = el.dataset.id; renderProjeto(); break;
      case 'pick': pick(el.dataset.kind, el.dataset.id); break;
      case 'bat': {
        const d = parseInt(el.dataset.id, 10);
        S.build.batteries = clamp(S.build.batteries + d, 0, 6); save(); renderProjeto(); break;
      }
      case 'to-launch': if (!S.build.bus) { toast('escolha um barramento primeiro'); return; } go('lancamento'); break;
      case 'orbit': S.orbit = el.dataset.id; save(); renderLancamento(); break;
      case 'launcher': S.launcher = el.dataset.id; save(); renderLancamento(); break;
      case 'launch': doLaunch(); break;
      case 'choice': choose(parseInt(el.dataset.i, 10)); break;
      case 'again': go('select'); break;
      case 'restart': S.objetivo = null; S.flags.justificou = false; S.build = M.emptyBuild(scn()); S.launcher = null; stats = M.compute(S); go('objetivo'); break;
      case 'copy': {
        const url = location.origin + location.pathname + '#c=' + M.code(S);
        navigator.clipboard?.writeText(url).then(() => toast('link copiado'), () => toast(url));
        break;
      }
      case 'close-help': $('#modal').classList.remove('on'); break;
      case 'compare': {
        if (!S.compare) { S.compare = { build: clone(S.build), orbit: S.orbit, launcher: S.launcher }; toast('arquitetura A capturada — mude o projeto e compare'); renderProjeto(); }
        else openCompare();
        break;
      }
      case 'use-a': {
        S.build = clone(S.compare.build); S.orbit = S.compare.orbit; S.launcher = S.compare.launcher;
        S.compare = null; $('#modal').classList.remove('on'); toast('arquitetura A restaurada'); save(); renderProjeto(); break;
      }
      case 'keep-b': $('#modal').classList.remove('on'); break;
      case 'print': window.print(); break;
      case 'toggle-party': S.party = !S.party; toast(S.party ? 'modo 4 papéis' : 'modo solo'); renderProjeto(); break;
    }
  });

  function pick(kind, id) {
    const b = S.build;
    const s = scn();
    if (kind === 'bus') { b.bus = b.bus === id ? null : id; if (b.bus) { const sl = D.buses.find((x) => x.id === b.bus).slots; if (b.instruments.length > sl) b.instruments = b.instruments.slice(0, sl); } }
    else if (kind === 'power') b.power = b.power === id ? null : id;
    else if (kind === 'comms') b.comms = b.comms === id ? null : id;
    else if (kind === 'ground') b.ground = b.ground === id ? null : id;
    else if (kind === 'avionica') b.avionica = b.avionica === id ? null : id;
    else if (kind === 'data') b.dataLevel = id;
    else if (kind === 'instr') {
      const i = b.instruments.indexOf(id);
      const slots = b.bus ? D.buses.find((x) => x.id === b.bus).slots : 4;
      if (i >= 0) b.instruments.splice(i, 1);
      else if (b.instruments.length < slots) b.instruments.push(id);
      else { toast('sem slot livre'); return; }
    } else if (kind === 'prot') {
      const i = b.protection.indexOf(id);
      if (i >= 0) b.protection.splice(i, 1);
      else if (id === 'blindagem' && b.protection.filter((x) => x === 'blindagem').length >= 2) { toast('máximo de 2 blindagens'); return; }
      else b.protection.push(id);
    }
    if (S.party) {
      S.flags.assinaturas = Math.min(3, (S.flags.assinaturas || 0) + 1);
      S.role = (S.role + 1) % 4;
      if (!S.flags.resolveuVeto && S.flags.assinaturas >= 2) { S.flags.resolveuVeto = true; toast('veto resolvido em negociação'); }
    }
    blip(660, 0.05, 'sine', 0.03);
    save(); renderProjeto();
  }

  function openCompare() {
    const A = Object.assign({}, S, { build: S.compare.build, orbit: S.compare.orbit, launcher: S.compare.launcher });
    const a = M.compute(A), b = M.compute(S);
    const rows = [
      ['massa', a.massaTotal, b.massaTotal, 'kg', false],
      ['custo', a.custoTotal, b.custoTotal, 'M$', false],
      ['ciência', a.ciencia, b.ciencia, 'pts', true],
      ['integridade', a.integridade * 100, b.integridade * 100, '%', true],
      ['margem energia', a.margemEnergia * 100, b.margemEnergia * 100, '%', true],
      ['requisitos ok', a.checks.filter((c) => c.ok).length, b.checks.filter((c) => c.ok).length, 'de ' + a.checks.length, true],
    ];
    $('#modal').innerHTML = `<div class="modal-panel" style="max-width:760px">
      <div class="kicker">trade study · CML 2</div>
      <h2 style="font-size:28px">A vs B — decida com número.</h2>
      <table style="margin-top:14px">
        <tr><th>métrica</th><th>A</th><th>B</th><th>Δ</th></tr>
        ${rows.map(([n, va, vb, u, up]) => {
          const d = vb - va; const good = d === 0 ? '' : (up ? d > 0 : d < 0) ? 'ok-t' : 'no-t';
          return `<tr><td>${n}</td><td class="mono">${fmt(va, 1)} ${u}</td><td class="mono">${fmt(vb, 1)} ${u}</td>
            <td class="mono ${good}">${d === 0 ? '—' : (d > 0 ? '+' : '') + fmt(d, 1)}</td></tr>`;
        }).join('')}
      </table>
      <div class="btn-row">
        <button class="btn ghost" data-act="use-a">Voltar para A</button>
        <button class="btn" data-act="keep-b">Manter B</button>
      </div></div>`;
    $('#modal').classList.add('on');
  }

  function openHelp() {
    const m = $('#modal');
    m.innerHTML = `<div class="modal-panel">
      <div class="kicker">como jogar</div>
      <h2 style="font-size:30px">Cinco passos, uma missão.</h2>
      <div class="grid" style="gap:14px;margin-top:18px">
        <div><b>1 · Objetivo</b> — escolha o que vale a pena descobrir. Ele trava.</div>
        <div><b>2 · Requisitos</b> — transforme o desejo em número: cobertura, resolução, latência, vida útil.</div>
        <div><b>3 · Bancada</b> — barramento, energia, comunicações, solo, carga útil, aviônica e proteção. Cada peça cobra massa, potência, dinheiro e dados.</div>
        <div><b>4 · Lançamento</b> — órbita e veículo. Se a massa não couber, o jogo diz o motivo — e você negocia com a física.</div>
        <div><b>5 · Operações e relatório</b> — seis turnos de eventos; no fim, a cadeia causal, a conformidade e a nota.</div>
      </div>
      <div class="btn-row"><button class="btn" data-act="close-help">Entendi</button>
      <button class="btn ghost" data-act="start">Escolher missão</button></div>
    </div>`;
    m.classList.add('on');
  }

  /* ---------- keyboard ---------- */
  addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { if ($('#launch').classList.contains('on')) return; }
  });

  /* ---------- init ---------- */
  const muteBtn = $('#mute');
  muteBtn?.addEventListener('click', () => { muted = !muted; muteBtn.textContent = muted ? '◌' : '◉'; toast(muted ? 'som desligado' : 'som ligado'); });
  $('#reset')?.addEventListener('click', () => { localStorage.removeItem('mip:save'); location.hash = ''; location.reload(); });

  window.__MIP = { S, stats: () => M.compute(S) };
  window.FX.initStars($('#fx'));
  boot();
})();
