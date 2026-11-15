/* MISSAO IPE — engine determinística (MVP)
   Regras puras: estado -> números. Nenhum acesso ao DOM. */
(function () {
  const D = window.MIP_DATA;
  const B = D.balance;

  const OPS_MES = { cubesat: 0.1, smallsat: 0.4, microsat: 0.8, midsize: 1.5, large: 3.0, hab: 8.0 };
  const SHIELD = [[0.3, 1.0], [1.0, 0.9], [2.5, 0.75], [4.0, 0.62], [8.0, 0.45]];

  function shieldFactor(d) {
    let f = 1;
    for (const [dens, fac] of SHIELD) if (d >= dens) f = fac;
    return f;
  }

  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function hash(str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }

  const byId = (arr, id) => arr.find((x) => x.id === id) || null;

  function emptyBuild(scn) {
    return {
      bus: null, power: null, batteries: 1, comms: null, ground: null,
      avionica: null, instruments: [], protection: [], dataLevel: scn.tripulacao ? 'L2' : 'L2',
    };
  }

  function get(state, kind, id) {
    if (kind === 'bus') return byId(D.buses, id);
    if (kind === 'power') return byId(D.power, id);
    if (kind === 'comms') return byId(D.comms, id);
    if (kind === 'ground') return byId(D.ground, id);
    if (kind === 'avionica') return byId(D.avionica, id);
    if (kind === 'instr') return byId(D.instruments, id);
    if (kind === 'prot') return byId(D.protection, id);
    return null;
  }

  function compute(state) {
    const scn = byId(D.scenarios, state.mission);
    const b = state.build;
    const bus = get(state, 'bus', b.bus);
    const pw = get(state, 'power', b.power);
    const cm = get(state, 'comms', b.comms);
    const gr = get(state, 'ground', b.ground);
    const av = get(state, 'avionica', b.avionica);
    const orbit = byId(D.orbits, state.orbit);
    const launcher = byId(D.launchers, state.launcher);
    const instr = b.instruments.map((id) => get(state, 'instr', id)).filter(Boolean);
    const prot = b.protection.map((id) => get(state, 'prot', id)).filter(Boolean);
    const crew = scn ? scn.tripulacao : 0;

    const reqs = (scn ? scn.requisitos : []).map((r) => {
      const lvl = state.reqs[r.id] || 'esp';
      const l = r.niveis.find((n) => n.nivel === lvl) || r.niveis[1];
      return { ...r, nivel: lvl, alvo: l.alvo, custo_ms: l.custo_ms, massa_kg: l.massa_kg };
    });
    const reqCost = reqs.reduce((s, r) => s + r.custo_ms, 0);
    const reqMass = reqs.reduce((s, r) => s + r.massa_kg, 0);

    let maska = 0, custo = 0;
    if (bus) { maska += bus.massa_kg; custo += bus.custo_ms; }
    if (pw) { maska += pw.massa_kg; custo += pw.custo_ms; }
    maska += 30 * b.batteries; custo += 3 * b.batteries;
    if (cm) { maska += cm.massa_kg; custo += cm.custo_ms; }
    if (gr) custo += gr.custo_ms;
    if (av) { maska += av.massa_kg; custo += av.custo_ms; }
    instr.forEach((i) => { maska += i.massa_kg; custo += i.custo_ms; });
    prot.forEach((p) => {
      if (p.por_tripulante) { maska += p.massa_kg * Math.max(1, crew); custo += p.custo_ms * Math.max(1, crew); }
      else { maska += p.massa_kg; custo += p.custo_ms; }
    });
    maska += reqMass;
    custo += reqCost;
    if (launcher) custo += launcher.custo_ms;

    const massaTotal = maska * (1 + B.margem_massa);
    const custoTotal = custo * (1 + B.integração_pct)
      + (scn ? scn.duracao_meses * (OPS_MES[b.bus] || 0) : 0)
      + (scn ? scn.duracao_meses * ((D.dataLevels.find((d) => d.id === b.dataLevel) || { custo_ms_mes: 0 }).custo_ms_mes) : 0);

    const cap = launcher && orbit ? (launcher.capacidade_kg[orbit.id] || 0) : 0;
    const gen = pw && orbit ? (pw.tipo === 'solar' ? pw.potencia_w * orbit.fator_solar : pw.potencia_w) : 0;
    const load = (bus ? bus.potencia_base_w : 0) + (cm ? cm.potencia_w : 0) + (av ? av.potencia_w : 0)
      + instr.reduce((s, i) => s + i.potencia_w, 0);
    const margemEnergia = gen > 0 ? (gen - load) / gen : -1;

    const eclipseH = orbit ? 24 * orbit.eclipse_fracao : 0;
    const precisaWh = load * eclipseH;
    const temWh = b.batteries * 1400 * B.profundidade_descarga;
    const bateriaOk = temWh >= precisaWh;

    const gerado = instr.reduce((s, i) => s + i.dados_gb_dia, 0);
    const downlink = cm && gr ? Math.min(cm.mbps, gr.mbps) * gr.downlink_h_dia * 0.45 : 0;
    const integridade = gerado > 0 ? Math.min(1, downlink / gerado) : 1;

    const dl = D.dataLevels.find((d) => d.id === b.dataLevel) || { multiplicador: 1 };
    const cienciaBruta = instr.reduce((s, i) => s + i.ciencia, 0);
    const ciencia = cienciaBruta * integridade * dl.multiplicador;

    const dias = scn ? scn.duracao_meses * 30 : 0;
    let dose = 0;
    if (orbit) {
      dose = orbit.dose_msv_dia * dias * (orbit.trajetoria || 1) * shieldFactor(bus ? bus.blindagem_g_cm2 : 0.3);
      prot.filter((p) => p.gcr).forEach((p) => { dose *= p.gcr; });
    }
    const dosePct = dose / B.limite_carreira_msv * 100;

    const optical = instr.filter((i) => i.res).map((i) => i.res);
    const resolucao = optical.length ? Math.min(...optical) : 999;
    const vida = orbit ? Math.min(orbit.vida_meses, 12 + 6 * b.batteries) : 0;

    const metrics = {
      cobertura: orbit ? orbit.cobertura : 0,
      resolucao, cadencia: orbit ? orbit.cadencia : 99,
      latencia: gr ? gr.latencia_h : 99,
      vida, dose_pct: dosePct,
      profundidade: instr.some((i) => i.id === 'radar') ? 3 : 0,
      autonomia: instr.some((i) => i.id === 'health_kit') ? 5 : 30,
      margem_energia: margemEnergia,
      ciencia,
    };

    const checks = reqs.map((r) => {
      const v = metrics[r.metrica];
      const ok = r.melhor === 'maior' ? v >= r.alvo : v <= r.alvo;
      return { ...r, valor: v, ok };
    });

    const overMass = launcher ? massaTotal > cap + 0.001 : false;
    const overBudget = custoTotal > (scn ? scn.orcamento_ms : Infinity) + 0.001;
    const overPower = margemEnergia < 0;
    const dataLoss = integridade < 0.8;

    return {
      scn, bus, pw, cm, gr, av, orbit, launcher, instr, prot, crew, reqs, checks, metrics,
      massaTotal, cap, custoTotal, gen, load, margemEnergia, bateriaOk, precisaWh, temWh,
      gerado, downlink, integridade, ciencia, cienciaBruta, dose, dosePct, vida,
      overMass, overBudget, overPower, dataLoss,
      ok: !overMass && !overBudget && !overPower && !dataLoss,
    };
  }

  function score(state, ops, stats) {
    const scn = stats.scn;
    const cps = [
      { id: 'objetivo', ok: !!state.objetivo, txt: 'Declarou o objetivo antes de abrir a bancada' },
      { id: 'justificou', ok: !!state.flags.justificou, txt: 'Justificou a escolha do objetivo' },
      { id: 'sem-estouro', ok: !stats.overMass && !stats.overBudget && !stats.overPower, txt: 'Nenhum recurso estourou no commit' },
      { id: 'massa', ok: !!state.flags.checouMassa, txt: 'Verificou a massa antes de lançar' },
      { id: 'dados', ok: stats.integridade >= 0.8, txt: 'Tinha plano de dados (downlink ≥ geração)' },
      { id: 'dose', ok: stats.crew === 0 || stats.dosePct < 80, txt: 'Manteve a dose abaixo de 80% da carreira' },
      { id: 'evento', ok: !!state.flags.reagiu, txt: 'Reagiu ao primeiro evento com decisão coerente' },
      { id: 'janela', ok: !state.flags.perdeuJanela, txt: 'Não perdeu janela de comunicação' },
      { id: 'assinatura', ok: (state.flags.assinaturas || 0) >= 3, txt: 'Registrou 3 assinaturas com justificativa' },
      { id: 'veto', ok: !!state.flags.resolveuVeto, txt: 'Resolveu um veto sem escalar para o Diretor' },
    ];
    const cpsOk = cps.filter((c) => c.ok).length;

    const mandatory = stats.checks.filter((c) => c.obrigatorio);
    const allMandatory = mandatory.every((c) => c.ok);
    const cienciaProjeto = stats.cienciaProjeto != null ? stats.cienciaProjeto : stats.ciencia;
    const objetivoOk = cienciaProjeto >= scn.meta_ciencia;
    const sucesso = objetivoOk && allMandatory ? 350 : objetivoOk ? 175 : 0;

    const cienciaPts = 250 * Math.min(1, stats.ciencia / scn.meta_ciencia);
    const ref = scn.referencia;
    const efC = Math.min(1, ((stats.ciencia / Math.max(1, stats.custoTotal)) / (ref.ciencia / ref.custo_ms)) / 1.15);
    const efM = Math.min(1, ((stats.ciencia / Math.max(1, stats.massaTotal)) / (ref.ciencia / ref.massa_kg)) / 1.15);
    const efE = Math.max(0, Math.min(1, stats.margemEnergia / 0.35));
    const efD = ops ? ops.integridade : stats.integridade;
    const eficiencia = 200 * ((efC + efM + efE + efD) / 4);
    const decisao = 15 * cpsOk;
    const bonusLimpo = !ops || ops.dano === 0 ? 30 : 0;
    const bonusDescoberta = stats.ciencia >= 1.2 * scn.meta_ciencia ? 20 : 0;
    const total = Math.round(sucesso + cienciaPts + eficiencia + decisao + bonusLimpo + bonusDescoberta);

    return {
      total, sucesso, ciencia: Math.round(cienciaPts), eficiencia: Math.round(eficiencia),
      decisao, bonus: bonusLimpo + bonusDescoberta, cps, cpsOk,
      objetivoOk, allMandatory, efC, efM, efE, efD,
    };
  }

  function drawDeck(state) {
    const scn = byId(D.scenarios, state.mission);
    const pool = D.events.filter((e) => !e.cenarios || e.cenarios.includes(scn.id));
    const rng = mulberry32(hash(state.seed + ':' + state.mission));
    const arr = pool.slice();
    for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1));[arr[i], arr[j]] = [arr[j], arr[i]]; }
    // eventos de ambiente primeiro; os humanos/institucionais só depois do turno 3
    arr.sort((a, b) => ((a.turno_min || 0) - (b.turno_min || 0)) || (rng() - 0.5));
    return arr;
  }

  function applyOption(ops, opt, stats) {
    const e = opt.efeito || {};
    if (e.dose_msv) ops.doseExtra += e.dose_msv;
    if (e.ciencia_fracao) ops.cienciaMult *= (1 - e.ciencia_fracao);
    if (e.saude) ops.saude += e.saude;
    if (e.perda_dados_fracao) ops.integridade *= (1 - e.perda_dados_fracao);
    if (e.orcamento_pct) ops.custoExtra += stats.custoTotal * e.orcamento_pct;
    if (e.instrumento_off) {
      const idx = stats.instr.map((i) => i.ciencia).indexOf(Math.min(...stats.instr.map((i) => i.ciencia)));
      if (idx >= 0) ops.perdaInstrumento += stats.instr[idx].ciencia;
    }
    ops.dano += (e.dose_msv || (e.saude && e.saude < 0) || e.perda_dados_fracao) ? 1 : 0;
  }

  function code(state) {
    const payload = { m: state.mission, o: state.objetivo, r: state.reqs, b: state.build, orb: state.orbit, l: state.launcher, s: state.seed };
    return btoa(unescape(encodeURIComponent(JSON.stringify(payload)))).replace(/=+$/, '');
  }

  function decode(str) {
    try {
      const p = JSON.parse(decodeURIComponent(escape(atob(str))));
      return p;
    } catch (e) { return null; }
  }

  window.MIP = { compute, score, drawDeck, applyOption, code, decode, mulberry32, hash, byId, emptyBuild, shieldFactor };
})();
