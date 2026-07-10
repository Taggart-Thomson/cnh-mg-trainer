/* ============================================================================
   DETRAN-MG CNH TRAINER — APP LOGIC (vanilla JS, no build step)
   ----------------------------------------------------------------------------
   Screens: home -> lesson (vocab + teach + practice) -> results
                 -> practice-only -> results
                 -> exam (timed, 30 Q) -> results
   Progress is kept in memory for this session and mirrored to localStorage when
   available (works when installed to the home screen; harmless if blocked).
   ========================================================================== */

const { VOCAB, MODULES, EXAM_WEIGHTS } = window.CNH_DATA;
const root = document.getElementById('root');

/* ---------- tiny persistence (safe if storage is unavailable) ---------- */
const store = {
  read(){
    try { return JSON.parse(localStorage.getItem('cnh_mg') || '{}'); }
    catch(e){ return {}; }
  },
  write(o){
    try { localStorage.setItem('cnh_mg', JSON.stringify(o)); } catch(e){}
  }
};
let STATE = Object.assign({ done:{}, bestExam:0, streak:0 }, store.read());
function save(){ store.write(STATE); }

/* ---------- helpers ---------- */
function shuffle(a){ a=a.slice(); for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];} return a; }
function sample(arr,n){ return shuffle(arr).slice(0, Math.min(n, arr.length)); }
function el(html){ const d=document.createElement('div'); d.innerHTML=html.trim(); return d.firstElementChild; }
function esc(s){ return String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }

/* Build a fresh randomized question object from a raw pool entry:
   answer options are shuffled and the correct index is recomputed, so the
   same source question never presents the same way twice. */
function bakeQuestion(raw){
  const correctText = raw.options[raw.answer];
  const opts = shuffle(raw.options);
  return {
    q: raw.q,
    hint: raw.hint || null,
    why: raw.why || '',
    options: opts,
    answer: opts.indexOf(correctText),
  };
}

/* Draw a randomized quiz set for a module (or across all modules for the exam) */
function drawModuleQuiz(mod, count){
  return sample(mod.examPool, count).map(bakeQuestion);
}
function drawExam(count){
  /* Real-exam draw. The official DETRAN-MG paper allocates a fixed number of
     questions per section and presents them in section order (Legislação
     first, Mecânica last). We mirror that exactly using EXAM_WEIGHTS.
     Only the Portuguese verbatim examPool is used, so practice matches the
     real test language. Tops up from other sections if any pool is short. */
  if(!EXAM_WEIGHTS){
    let bag = [];
    MODULES.forEach(m => { bag = bag.concat(m.examPool); });
    return sample(bag, count).map(bakeQuestion);
  }
  const picked = [];
  const leftovers = [];
  MODULES.forEach(m => {
    const want = EXAM_WEIGHTS[m.id] || 0;
    const taken = sample(m.examPool, want);
    picked.push(...taken.map(bakeQuestion));
    const used = new Set(taken);
    m.examPool.forEach(q => { if(!used.has(q)) leftovers.push(q); });
  });
  while(picked.length < count && leftovers.length){
    const i = Math.floor(Math.random() * leftovers.length);
    picked.push(bakeQuestion(leftovers.splice(i, 1)[0]));
  }
  return picked.slice(0, count);
}

/* ============================================================================
   ROUTER
   ========================================================================== */
let SCREEN = { name:'home' };
function go(name, data){ SCREEN = Object.assign({ name }, data); render(); window.scrollTo(0,0); }

function render(){
  root.innerHTML = '';
  switch(SCREEN.name){
    case 'home':     return renderHome();
    case 'lesson':   return renderLesson();
    case 'quiz':     return renderQuiz();
    case 'exam':     return renderExam();
    case 'results':  return renderResults();
  }
}

/* ============================================================================
   HOME — the sign-post map
   ========================================================================== */
function moduleProgress(){
  const total = MODULES.length;
  const done = MODULES.filter(m => STATE.done[m.id]).length;
  return { done, total, pct: Math.round(done/total*100) };
}

function renderHome(){
  const p = moduleProgress();
  const wrap = el(`<div class="safe-top"></div>`);

  wrap.appendChild(el(`
    <div class="home-hero">
      <div class="plate">
        <span class="br">BR</span>
        <span class="num">CNH · MG</span>
      </div>
      <div class="hero-title">Pass the prova<br>teórica in English.</div>
      <div class="hero-sub">Learn the traffic rules and the Portuguese signal words that unlock each question. Belo Horizonte / DETRAN-MG format.</div>
    </div>
  `));

  wrap.appendChild(el(`
    <div class="progress-band">
      <div class="ring" style="--p:${p.pct}"><i>${p.pct}%</i></div>
      <div class="txt">
        <b>${p.done} of ${p.total} sections complete</b>
        <span>${STATE.bestExam ? 'Best mock exam: '+STATE.bestExam+'/30' : 'No mock exam taken yet'}</span>
      </div>
    </div>
  `));

  wrap.appendChild(el(`
    <div class="section-label">
      <span class="eyebrow">Sections</span><span class="ln"></span>
    </div>
  `));

  // path of nodes
  const path = el(`<div class="path"></div>`);
  MODULES.forEach((m)=>{
    const isDone = !!STATE.done[m.id];
    const node = el(`
      <div class="node">
        <div class="connector"></div>
        <button class="badge ${m.color}" aria-label="${esc(m.title)}">
          ${signIcon(m.color)}
          ${isDone ? '<span class="done">✓</span>' : ''}
        </button>
        <button class="meta" style="text-align:left;background:none">
          <b>${esc(m.title)}</b>
          <span>${esc(m.subtitle)} · ${m.examPool.length} questões</span>
        </button>
        <span class="chev">›</span>
      </div>
    `);
    const open = ()=>go('menu-jump', { mod:m }); // interim: open section menu
    node.querySelector('.badge').onclick = ()=>openSectionSheet(m);
    node.querySelector('.meta').onclick = ()=>openSectionSheet(m);
    node.querySelector('.chev').onclick = ()=>openSectionSheet(m);
    path.appendChild(node);
  });
  wrap.appendChild(path);

  // final exam destination
  const exam = el(`
    <div class="exam-node">
      <span class="eyebrow">The real thing</span>
      <h2>Simulated Exam</h2>
      <p>30 questions · 21 to pass · timed. Freshly shuffled every attempt.</p>
      <button class="btn-white">Start mock exam →</button>
    </div>
  `);
  exam.querySelector('button').onclick = startExam;
  wrap.appendChild(exam);

  wrap.appendChild(el(`
    <div class="foot-hint">
      Tap any section to <b>study</b> or jump straight to its <b>practice test</b>.
      Add this page to your Home Screen to use it offline.
    </div>
  `));

  wrap.appendChild(el(`<div class="safe-bot"></div>`));
  root.appendChild(wrap);
}

/* small inline SVG-ish glyphs per sign family (kept as emoji-free unicode marks) */
function signIcon(color){
  const map = { red:'⛔', yellow:'⚠', blue:'ℹ', green:'✚' };
  return `<span style="filter:drop-shadow(0 1px 1px rgba(0,0,0,.25));color:#fff;font-size:24px">${map[color]||'●'}</span>`;
}

/* ---------- section action sheet (study vs practice) ---------- */
function openSectionSheet(mod){
  const done = !!STATE.done[mod.id];
  const sheet = el(`
    <div style="position:fixed;inset:0;z-index:60;display:flex;align-items:flex-end;justify-content:center">
      <div class="sheet-bg" style="position:absolute;inset:0;background:rgba(28,26,23,.45)"></div>
      <div style="position:relative;width:100%;max-width:520px;background:var(--paper);
        border-radius:26px 26px 0 0;box-shadow:0 -10px 40px rgba(0,0,0,.25);padding:22px 20px calc(env(safe-area-inset-bottom) + 22px);animation:rise .2s ease">
        <div style="width:40px;height:5px;background:var(--line);border-radius:3px;margin:0 auto 16px"></div>
        <div style="display:flex;align-items:center;gap:14px;margin-bottom:6px">
          <div class="badge ${mod.color}" style="width:48px;height:48px;font-size:22px">${signIcon(mod.color)}</div>
          <div>
            <div class="h-lg">${esc(mod.title)}</div>
            <div style="color:var(--ink2);font-size:13px">${esc(mod.subtitle)}</div>
          </div>
        </div>
        <p style="color:var(--ink2);font-size:14px;line-height:1.5;margin:12px 0 18px">
          ${mod.vocab.length} key terms · ${mod.teach.length} concepts · ${mod.examPool.length} exam questions (Portuguese).
          ${done ? 'You have completed this section. Revisit any time.' : ''}
        </p>
        <button class="btn" id="s-study" style="margin-bottom:12px">${done ? 'Study again' : 'Start lesson'}</button>
        <button class="btn blue" id="s-practice">Practice test (${Math.min(10,mod.examPool.length)} Q)</button>
        <button class="btn ghost" id="s-close" style="margin-top:12px">Cancel</button>
      </div>
    </div>
  `);
  const close = ()=>sheet.remove();
  sheet.querySelector('.sheet-bg').onclick = close;
  sheet.querySelector('#s-close').onclick = close;
  sheet.querySelector('#s-study').onclick = ()=>{ close(); startLesson(mod); };
  sheet.querySelector('#s-practice').onclick = ()=>{ close(); startPractice(mod); };
  document.body.appendChild(sheet);
}

/* ============================================================================
   LESSON FLOW  (vocab flashcards -> teach cards -> practice quiz)
   ========================================================================== */
function startLesson(mod){
  const steps = [];
  mod.vocab.forEach(v => steps.push({ type:'vocab', data:VOCAB[v] }));
  mod.teach.forEach(t => steps.push({ type:'teach', data:t }));
  // bilingual worked examples: understand the rule in English before drilling in Portuguese
  (mod.studyExamples || []).slice(0, 4).forEach(q => steps.push({ type:'example', data:q }));
  go('lesson', { mod, steps, i:0, flipped:false });
}

function renderLesson(){
  const { mod, steps, i } = SCREEN;
  const step = steps[i];
  const pct = Math.round((i)/(steps.length)*100);

  const top = el(`
    <div class="topbar safe-top">
      <button class="back" aria-label="Close">✕</button>
      <div class="title">${esc(mod.title)}</div>
    </div>
  `);
  top.querySelector('.back').onclick = ()=>confirmQuit();
  root.appendChild(top);

  root.appendChild(el(`<div class="progline"><i style="width:${pct}%"></i></div>`));

  const stage = el(`<div class="stage"></div>`);

  if(step.type === 'vocab'){
    stage.appendChild(el(`<div class="kicker">Key term · tap the card to flip</div>`));
    const v = step.data;
    const card = el(`
      <div class="flash" role="button" tabindex="0">
        <span class="tag">Português</span>
        <div class="face-front">
          <div class="pt">${esc(v.pt)}</div>
          <div class="flip-hint">tap to reveal meaning</div>
        </div>
        <div class="face-back hidden">
          <div class="pt" style="font-size:30px">${esc(v.pt)}</div>
          <div class="en">${esc(v.en)}</div>
          <div class="note">${esc(v.note)}</div>
        </div>
      </div>
    `);
    let flipped=false;
    const flip = ()=>{
      flipped=!flipped;
      card.querySelector('.face-front').classList.toggle('hidden', flipped);
      card.querySelector('.face-back').classList.toggle('hidden', !flipped);
    };
    card.onclick = flip;
    card.onkeydown = e => { if(e.key===' '||e.key==='Enter'){ e.preventDefault(); flip(); } };
    stage.appendChild(card);
  } else if(step.type === 'example'){
    stage.appendChild(el(`<div class="kicker">Worked example · answer shown</div>`));
    const q = step.data;
    const correct = q.options[q.answer];
    const optHtml = q.options.map(o =>
      `<div class="ex-opt ${o===correct?'ex-correct':''}">${esc(o)}</div>`
    ).join('');
    stage.appendChild(el(`
      <div class="teach">
        <div class="ex-lang">EN · learning example</div>
        <h3 style="font-size:19px">${esc(q.q)}</h3>
        <div class="ex-opts">${optHtml}</div>
        ${q.why ? `<p class="ex-why"><b>Why:</b> ${esc(q.why)}</p>` : ''}
        <p class="ex-note">On the real test this appears in Portuguese. These English examples help you learn the rule; every exam and practice question is in Portuguese.</p>
      </div>
    `));
  } else {
    stage.appendChild(el(`<div class="kicker">Concept</div>`));
    const t = step.data;
    // bold any *asterisked* emphasis if present; else render plain
    stage.appendChild(el(`
      <div class="teach">
        <div class="cnum">${String(i - mod.vocab.length + 1).padStart(2,'0')}</div>
        <h3>${esc(t.c)}</h3>
        <p>${boldPT(t.t)}</p>
      </div>
    `));
  }

  const isLast = i === steps.length - 1;
  const bar = el(`<div class="btn-row"><button class="btn">${isLast ? 'Start practice →' : 'Continue'}</button></div>`);
  bar.querySelector('button').onclick = ()=>{
    if(isLast){ startPractice(mod, /*fromLesson*/true); }
    else { SCREEN.i++; render(); window.scrollTo(0,0); }
  };
  stage.appendChild(bar);
  root.appendChild(stage);
}

/* wrap Portuguese words in the teach text with subtle emphasis */
function boldPT(text){
  // emphasise italicised-by-convention PT terms that appear in parentheses or common keywords
  const keys = ['proibido','obrigatório','advertência','regulamentação','indicação','preferência',
    'ultrapassagem','velocidade máxima','faixa de pedestres','pedestres','Lei Seca','bafômetro',
    'cinto de segurança','farol baixo','primeiros socorros','sinalizar','poluição','conversão','rotatória'];
  let out = esc(text);
  keys.forEach(k=>{
    const re = new RegExp('('+k.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+')','gi');
    out = out.replace(re,'<b>$1</b>');
  });
  return out;
}

/* ============================================================================
   QUIZ ENGINE (shared by practice + drives results)
   ========================================================================== */
function startPractice(mod, fromLesson){
  const n = Math.min(10, mod.examPool.length);
  const questions = drawModuleQuiz(mod, n);
  go('quiz', { mod, questions, i:0, answers:[], fromLesson:!!fromLesson });
}

function renderQuiz(){
  const S = SCREEN;
  const q = S.questions[S.i];

  const top = el(`
    <div class="topbar safe-top">
      <button class="back" aria-label="Quit">✕</button>
      <div class="title">${esc(S.mod.title)} · Practice</div>
    </div>
  `);
  top.querySelector('.back').onclick = confirmQuit;
  root.appendChild(top);

  const pct = Math.round(S.i / S.questions.length * 100);
  root.appendChild(el(`<div class="progline"><i style="width:${pct}%"></i></div>`));

  const stage = el(`<div class="stage"></div>`);
  stage.appendChild(el(`<div class="q-count">Question ${S.i+1} of ${S.questions.length}</div>`));
  stage.appendChild(el(`<div class="q-text"><span class="ptq">${esc(q.q)}</span></div>`));

  const optWrap = el(`<div></div>`);
  const letters = ['A','B','C','D','E'];
  q.options.forEach((opt,idx)=>{
    const b = el(`<button class="opt"><span class="key">${letters[idx]}</span><span>${esc(opt)}</span></button>`);
    b.onclick = ()=>answerQuiz(idx, optWrap, stage);
    optWrap.appendChild(b);
  });
  stage.appendChild(optWrap);
  root.appendChild(stage);
}

function answerQuiz(choice, optWrap, stage){
  const S = SCREEN;
  const q = S.questions[S.i];
  const correct = q.answer;
  S.answers.push({ q, choice, correct: choice===correct });

  [...optWrap.children].forEach((b,idx)=>{
    b.disabled = true; b.setAttribute('disabled','');
    if(idx===correct) b.classList.add('correct');
    else if(idx===choice) b.classList.add('wrong');
    else b.classList.add('dim');
  });

  const ok = choice===correct;
  const fb = el(`
    <div class="feedback ${ok?'ok':'no'}">
      <div class="fh">${ok?'✓ Correct':'✕ Not quite'}</div>
      ${q.why?`<div class="why">${esc(q.why)}</div>`:''}
      ${q.hint?`<div class="hintword">Signal word: <b>${esc(q.hint)}</b></div>`:''}
    </div>
  `);
  stage.appendChild(fb);

  const isLast = S.i === S.questions.length - 1;
  const bar = el(`<div class="btn-row"><button class="btn ${ok?'':'red'}">${isLast?'See results →':'Next question'}</button></div>`);
  bar.querySelector('button').onclick = ()=>{
    if(isLast) finishQuiz();
    else { S.i++; render(); window.scrollTo(0,0); }
  };
  stage.appendChild(bar);
  bar.scrollIntoView({behavior:'smooth', block:'end'});
}

function finishQuiz(){
  const S = SCREEN;
  const score = S.answers.filter(a=>a.correct).length;
  const total = S.answers.length;
  // mark section done if they passed practice comfortably (>=70%)
  if(score/total >= 0.7){ STATE.done[S.mod.id] = true; save(); }
  go('results', {
    kind:'practice', title:S.mod.title,
    score, total, answers:S.answers,
    passed: score/total >= 0.7, passMark: Math.ceil(total*0.7),
    retry:()=>startPractice(S.mod)
  });
}

/* ============================================================================
   EXAM (timed, 30 Q, 21 to pass)
   ========================================================================== */
let EXAM_TIMER = null;
function startExam(){
  const questions = drawExam(30);
  const durationSec = 30*60; // 30 minutes
  go('exam', { questions, i:0, answers:[], remaining:durationSec });
  tickExam();
}
function tickExam(){
  clearInterval(EXAM_TIMER);
  EXAM_TIMER = setInterval(()=>{
    if(SCREEN.name!=='exam'){ clearInterval(EXAM_TIMER); return; }
    SCREEN.remaining--;
    const t = document.getElementById('exam-timer');
    if(t){
      t.textContent = fmtTime(SCREEN.remaining);
      t.classList.toggle('warn', SCREEN.remaining <= 120);
    }
    if(SCREEN.remaining<=0){ clearInterval(EXAM_TIMER); finishExam(true); }
  },1000);
}
function fmtTime(s){ const m=Math.floor(s/60), ss=s%60; return `${m}:${String(ss).padStart(2,'0')}`; }

function renderExam(){
  const S = SCREEN;
  const q = S.questions[S.i];

  const bar = el(`
    <div class="exam-bar safe-top">
      <div class="timer" id="exam-timer">${fmtTime(S.remaining)}</div>
      <div class="mini"><i style="width:${Math.round(S.i/S.questions.length*100)}%"></i></div>
      <div class="qn">${S.i+1}/${S.questions.length}</div>
    </div>
  `);
  root.appendChild(bar);

  const stage = el(`<div class="stage"></div>`);
  stage.appendChild(el(`<div class="q-count" style="margin-top:14px">Exam question ${S.i+1}</div>`));
  stage.appendChild(el(`<div class="q-text"><span class="ptq">${esc(q.q)}</span></div>`));

  const optWrap = el(`<div></div>`);
  const letters=['A','B','C','D','E'];
  q.options.forEach((opt,idx)=>{
    const b = el(`<button class="opt"><span class="key">${letters[idx]}</span><span>${esc(opt)}</span></button>`);
    b.onclick = ()=>answerExam(idx);
    optWrap.appendChild(b);
  });
  stage.appendChild(optWrap);
  root.appendChild(stage);
}

function answerExam(choice){
  const S = SCREEN;
  const q = S.questions[S.i];
  S.answers.push({ q, choice, correct: choice===q.answer });
  if(S.i === S.questions.length - 1){ finishExam(false); }
  else { S.i++; render(); window.scrollTo(0,0); }
}

function finishExam(timedOut){
  clearInterval(EXAM_TIMER);
  const S = SCREEN;
  const score = S.answers.filter(a=>a.correct).length;
  const total = 30;
  const passed = score >= 21;
  if(score > (STATE.bestExam||0)){ STATE.bestExam = score; save(); }
  go('results', {
    kind:'exam', title:'Simulated Exam',
    score, total, answers:S.answers, passed, passMark:21, timedOut:!!timedOut,
    retry:startExam
  });
}

/* ============================================================================
   RESULTS
   ========================================================================== */
function renderResults(){
  const R = SCREEN;
  const pct = Math.round(R.score/R.total*100);

  const wrap = el(`<div class="result-wrap safe-top"></div>`);

  wrap.appendChild(el(`
    <div class="result-seal ${R.passed?'pass':'fail'}">
      <div class="score">${R.score}</div>
      <div class="of">of ${R.total}</div>
    </div>
  `));

  let headline, sub;
  if(R.kind==='exam'){
    if(R.timedOut){ headline='Time up'; sub=`You reached ${R.score} of 30 before the clock ran out. You need 21 to pass, so keep drilling the weak sections.`; }
    else if(R.passed){ headline='Aprovado!'; sub=`${R.score}/30, above the 21 you need. You are exam ready. Do a few more to be sure the score holds.`; }
    else { headline='Not yet'; sub=`${R.score}/30. You need 21 to pass. Review the misses below, then hit the sections you are shakiest on.`; }
  } else {
    if(R.passed){ headline='Section cleared'; sub=`${R.score}/${R.total} on ${esc(R.title)}. Nicely done, this section is marked complete.`; }
    else { headline='Keep going'; sub=`${R.score}/${R.total} on ${esc(R.title)}. Review below and try the practice again.`; }
  }

  wrap.appendChild(el(`<div class="result-title">${headline}</div>`));
  wrap.appendChild(el(`<div class="result-sub">${sub}</div>`));

  const wrongCount = R.answers.filter(a=>!a.correct).length;
  wrap.appendChild(el(`
    <div class="stat-row">
      <div class="stat"><b>${pct}%</b><span>SCORE</span></div>
      <div class="stat"><b style="color:var(--green)">${R.score}</b><span>CORRECT</span></div>
      <div class="stat"><b style="color:var(--red)">${wrongCount}</b><span>MISSED</span></div>
    </div>
  `));

  // review section (collapsed)
  if(wrongCount>0){
    const toggle = el(`<button class="review-toggle">Review the ${wrongCount} you missed ▾</button>`);
    const list = el(`<div style="width:100%;display:none"></div>`);
    R.answers.filter(a=>!a.correct).forEach(a=>{
      const letters=['A','B','C','D','E'];
      list.appendChild(el(`
        <div class="rev">
          <div class="rq">${esc(a.q.q)}</div>
          <div class="ra you"><span class="lbl">YOU</span><span>${esc(a.q.options[a.choice])}</span></div>
          <div class="ra cor"><span class="lbl">CORRECT</span><span>${esc(a.q.options[a.q.answer])}</span></div>
          ${a.q.why?`<div style="font-size:13px;color:var(--ink2);margin-top:10px;line-height:1.5">${esc(a.q.why)}</div>`:''}
          ${a.q.hint?`<div class="hintword" style="margin-top:10px">Signal word: <b>${esc(a.q.hint)}</b></div>`:''}
        </div>
      `));
    });
    let open=false;
    toggle.onclick = ()=>{ open=!open; list.style.display=open?'block':'none'; toggle.textContent=`Review the ${wrongCount} you missed ${open?'▴':'▾'}`; };
    wrap.appendChild(toggle);
    wrap.appendChild(list);
  }

  // actions
  const acts = el(`<div style="width:100%;margin-top:10px"></div>`);
  const again = el(`<button class="btn ${R.kind==='exam'?'red':'blue'}" style="margin-bottom:12px">${R.kind==='exam'?'New exam (fresh questions)':'Try again'}</button>`);
  again.onclick = R.retry;
  const home = el(`<button class="btn ghost">Back to sections</button>`);
  home.onclick = ()=>go('home');
  acts.appendChild(again); acts.appendChild(home);
  wrap.appendChild(acts);

  wrap.appendChild(el(`<div class="safe-bot"></div>`));
  root.appendChild(wrap);
}

/* ============================================================================
   quit confirmation
   ========================================================================== */
function confirmQuit(){
  const sheet = el(`
    <div style="position:fixed;inset:0;z-index:70;display:flex;align-items:center;justify-content:center;padding:24px">
      <div style="position:absolute;inset:0;background:rgba(28,26,23,.5)" class="qbg"></div>
      <div style="position:relative;background:var(--paper);border-radius:20px;padding:24px;max-width:340px;width:100%;box-shadow:var(--shadow);text-align:center">
        <div class="h-lg" style="margin-bottom:8px">Leave now?</div>
        <p style="color:var(--ink2);font-size:14px;line-height:1.5;margin:0 0 20px">Your progress in this session will not be saved.</p>
        <button class="btn red" id="q-yes" style="margin-bottom:10px">Leave</button>
        <button class="btn ghost" id="q-no">Stay</button>
      </div>
    </div>
  `);
  const close=()=>sheet.remove();
  sheet.querySelector('.qbg').onclick=close;
  sheet.querySelector('#q-no').onclick=close;
  sheet.querySelector('#q-yes').onclick=()=>{ clearInterval(EXAM_TIMER); close(); go('home'); };
  document.body.appendChild(sheet);
}

/* ---------- boot ---------- */
render();

/* register a service worker for offline use when hosted (ignored on file://) */
if('serviceWorker' in navigator && location.protocol.startsWith('http')){
  navigator.serviceWorker.register('sw.js').catch(()=>{});
}
