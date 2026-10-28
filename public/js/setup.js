import { t, pick, getLang } from './i18n.js';
import { scenarios, audienceOptions, timeOptions, goalOptions, modes, drills, dailyDrill, drillPreset, scenarioPreset } from './data.js';
import { getConfig, saveConfig, takeIntent } from './store.js';
import { bootPage, esc, icon, minutesLabel, refreshIcons } from './ui.js';

let config = getConfig();
let step = 1;

// Entry points from Home: ?scenario=pitch or ?drill=eye
(function applyEntryParams() {
  const params = new URLSearchParams(location.search);
  const intent = takeIntent() || {};
  const scenario = params.get('scenario') || intent.scenario;
  const drill = params.get('drill') || intent.drill;
  if (scenario && scenarioPreset(scenario)) config = { ...config, ...scenarioPreset(scenario) };
  else if (drill && drillPreset(drill)) config = { ...config, ...drillPreset(drill) };
  else config = { ...config, mode: 'full', challengeId: null };
  saveConfig(config);
  if (location.search) history.replaceState(null, '', location.pathname);
})();

const update = (patch) => {
  config = { ...config, ...patch };
  saveConfig(config);
};

const STEPS = [
  { n: 1, key: 'setup_step1', shape: 'shape-circle', fill: 'bg-mint' },
  { n: 2, key: 'setup_step2', shape: 'shape-square', fill: 'bg-amber', optional: true },
  { n: 3, key: 'setup_step3', shape: 'shape-arch', fill: 'bg-pink' },
];

/* ---------- pieces ---------- */
function radio(name, value, label, { checked, iconName, tint, desc } = {}) {
  return `
    <label class="option ${desc ? 'items-start' : ''}">
      <input type="radio" class="sr-only" name="${name}" value="${esc(value)}" ${checked ? 'checked' : ''} />
      ${iconName ? `<span class="tile-icon h-10 w-10 ${tint || 'bg-selection'}">${icon(iconName, 'h-5 w-5')}</span>` : ''}
      <span class="min-w-0">
        <span class="block">${esc(label)}</span>
        ${desc ? `<span class="mt-1 block text-meta font-medium text-ink/70">${esc(desc)}</span>` : ''}
      </span>
      <span class="check-mark" aria-hidden="true">${icon('check', 'h-3.5 w-3.5')}</span>
    </label>`;
}

function group(legend, inner, cols = 'sm:grid-cols-2 lg:grid-cols-3', extra = '') {
  return `
    <fieldset class="mt-9 first:mt-0 ${extra}">
      <legend class="subheading mb-4">${esc(legend)}</legend>
      <div class="grid gap-3 ${cols}">${inner}</div>
    </fieldset>`;
}

function textarea(id, label, value, iconName, placeholder = '') {
  return `
    <div>
      <label for="${id}" class="mb-2 flex items-center gap-2 text-label font-bold">${icon(iconName, 'h-4 w-4')}${esc(label)}</label>
      <textarea id="${id}" name="${id}" rows="4" class="field resize-y" ${placeholder ? `placeholder="${esc(placeholder)}"` : ''}>${esc(value)}</textarea>
    </div>`;
}

/* ---------- steps ---------- */
function stepOne(lang) {
  return `
    ${group(t('setup_scenario'), scenarios.map((s) => radio('scenario', s.id, t(s.key), { checked: config.scenario === s.id, iconName: s.icon, tint: s.tint })).join(''))}
    ${group(t('setup_audience'), audienceOptions.map((a) => radio('audience', a.id, lang === 'en' ? a.en : a.zh, { checked: config.audience === a.id })).join(''), 'sm:grid-cols-2')}
    <div class="mt-9">
      <label for="audienceDescription" class="subheading mb-4 block">${esc(t('setup_audienceDesc'))}</label>
      <textarea id="audienceDescription" name="audienceDescription" rows="2" class="field resize-y" placeholder="${esc(t('setup_audienceDescPh'))}">${esc(config.audienceDescription)}</textarea>
    </div>
    ${group(t('setup_practiceLang'), radio('practiceLanguage', 'en', 'English', { checked: config.practiceLanguage === 'en' }) + radio('practiceLanguage', 'zh', '中文', { checked: config.practiceLanguage === 'zh' }), 'grid-cols-2 sm:max-w-md')}
  `;
}

function stepTwo() {
  const files = config.materials || [];
  return `
    <p class="max-w-2xl text-ink/80">${esc(t('setup_materialsLead'))}</p>
    <div class="mt-6 rounded-corner border-detail border-dashed border-outline bg-field p-6 text-center">
      <button type="button" id="btn-upload" class="btn btn-secondary">
        ${icon('upload', 'h-5 w-5')}<span>${esc(t('setup_dropHere'))}</span>
      </button>
      <p class="mt-3 text-meta text-ink/75">${esc(t('setup_uploadHint'))}</p>
      <p class="mt-1 text-meta text-ink/75">${esc(t('setup_uploadNote'))}</p>
    </div>
    <ul id="file-list" class="mt-4 space-y-2" aria-live="polite">
      ${files
        .map(
          (f, i) => `
        <li class="flex items-center gap-3 rounded-corner border-detail border-outline bg-panel px-4 py-2.5 text-label">
          ${icon('file-text', 'h-5 w-5 text-accent')}
          <span class="min-w-0 flex-1 truncate font-semibold">${esc(f)}</span>
          <button type="button" class="link-back !text-meta" data-remove="${i}">${esc(t('setup_removeFile'))}<span class="sr-only"> ${esc(f)}</span></button>
        </li>`,
        )
        .join('')}
    </ul>
    <div class="mt-8 grid gap-5 md:grid-cols-2">
      ${textarea('script', t('setup_pasteScript'), config.script, 'pen-line')}
      ${textarea('speakerNotes', t('setup_speakerNotes'), config.speakerNotes, 'sticky-note')}
      ${textarea('keyMessages', t('setup_keyMessages'), config.keyMessages, 'key-round')}
      ${textarea('expectedQuestions', t('setup_expectedQuestions'), config.expectedQuestions, 'circle-help')}
    </div>`;
}

function stepThree(lang) {
  return `
    ${group(t('setup_mode'), modes.map((m) => radio('mode', m.id, t(m.key), { checked: config.mode === m.id, iconName: m.icon, desc: t(m.descKey) })).join(''), 'md:grid-cols-3')}
    ${group(t('setup_timeLimit'), timeOptions.map((s) => radio('timeLimit', s, minutesLabel(s, lang), { checked: Number(config.timeLimit) === s })).join(''), 'grid-cols-3 sm:grid-cols-5')}
    ${group(t('setup_goal'), goalOptions.map((g) => radio('goal', g, t(`goal_${g}`), { checked: config.goal === g })).join(''), 'grid-cols-2 lg:grid-cols-3')}
  `;
}

/* ---------- render ---------- */
function renderStepper() {
  document.getElementById('stepper').innerHTML = STEPS.map(
    (s) => `
    <li class="relative">
      <button type="button" data-goto="${s.n}" class="group flex w-full flex-col items-center gap-3 rounded-corner text-center" ${s.n === step ? 'aria-current="step"' : ''}>
        <span class="step-badge ${s.shape} ${s.fill}" aria-hidden="true">${s.n}</span>
        <span class="text-label font-bold leading-tight group-hover:underline group-hover:underline-offset-4">
          <span class="sr-only">${esc(t('setup_step'))} ${s.n}: </span>${esc(t(s.key))}
          ${s.optional ? `<span class="mt-0.5 block text-meta font-medium text-ink/70">${esc(t('setup_optional'))}</span>` : ''}
        </span>
      </button>
    </li>`,
  ).join('');
}

function renderDrillBanner() {
  const el = document.getElementById('drill-banner');
  const lang = getLang();
  const d = config.challengeId === 'daily60' ? dailyDrill : drills.find((x) => x.id === config.challengeId);
  if (!d) {
    el.hidden = true;
    el.innerHTML = '';
    return;
  }
  const title = config.challengeId === 'daily60' ? t('home_challengeDesc') : pick(d, 'title', lang);
  el.hidden = false;
  el.innerHTML = `
    <div class="panel flex flex-wrap items-center gap-4 bg-amber p-4 md:p-5">
      <span class="tile-icon bg-panel">${icon('timer', 'h-6 w-6')}</span>
      <div class="min-w-0 flex-1">
        <p class="eyebrow text-ink/80">${esc(t('setup_drill'))}</p>
        <p class="font-display text-lg font-bold">${esc(title)} · ${esc(minutesLabel(d.seconds, lang))}</p>
      </div>
      <button type="button" id="btn-clear-drill" class="btn btn-secondary btn-sm">${esc(t('setup_clearDrill'))}</button>
    </div>`;
}

function renderPanel() {
  const lang = getLang();
  const s = STEPS[step - 1];
  document.getElementById('step-tab').textContent = `${t('setup_step')} ${step} ${t('setup_of')} 3`;
  document.getElementById('step-panels').innerHTML = `
    <h2 id="step-title" class="heading mb-8" tabindex="-1">${esc(t(s.key))}${s.optional ? ` <span class="chip ml-2 align-middle !text-meta">${esc(t('setup_optional'))}</span>` : ''}</h2>
    ${step === 1 ? stepOne(lang) : step === 2 ? stepTwo() : stepThree(lang)}`;

  document.getElementById('btn-back').querySelector('span').textContent = step === 1 ? t('nav_home') : t('common_back');
  document.getElementById('btn-skip').hidden = step !== 2;
  document.getElementById('btn-next').hidden = step === 3;
  document.getElementById('btn-enter').hidden = step !== 3;
}

function render() {
  renderStepper();
  renderDrillBanner();
  renderPanel();
}

function goTo(n, { focus = true } = {}) {
  step = Math.min(3, Math.max(1, n));
  render();
  refreshIcons();
  if (focus) {
    const title = document.getElementById('step-title');
    title.focus({ preventScroll: true });
    document.getElementById('stepper').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
  }
}

/* ---------- events ---------- */
const form = document.getElementById('setup-form');

form.addEventListener('change', (e) => {
  const el = e.target;
  if (el.type === 'radio') {
    const value = el.name === 'timeLimit' ? Number(el.value) : el.value;
    const patch = { [el.name]: value };
    // Picking a different mode by hand leaves the drill preset behind.
    if (el.name === 'mode' && value === 'full') patch.challengeId = null;
    update(patch);
    if (el.name === 'mode') {
      renderDrillBanner();
      refreshIcons();
    }
  }
});

form.addEventListener('input', (e) => {
  if (e.target.tagName === 'TEXTAREA') update({ [e.target.name]: e.target.value });
});

form.addEventListener('click', (e) => {
  const upload = e.target.closest('#btn-upload');
  const remove = e.target.closest('[data-remove]');
  if (upload) {
    const fakeFiles = ['Pitch Deck.pdf', 'Market_Slides.pptx'];
    const files = [...(config.materials || [])];
    files.push(fakeFiles[files.length % 2]);
    update({ materials: files });
    renderPanel();
    refreshIcons();
    document.getElementById('btn-upload').focus();
  }
  if (remove) {
    const files = [...(config.materials || [])];
    files.splice(Number(remove.dataset.remove), 1);
    update({ materials: files });
    renderPanel();
    refreshIcons();
    document.getElementById('btn-upload').focus();
  }
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  saveConfig(config);
  location.href = 'room.html';
});

document.getElementById('stepper').addEventListener('click', (e) => {
  const b = e.target.closest('[data-goto]');
  if (b) goTo(Number(b.dataset.goto));
});

document.getElementById('drill-banner').addEventListener('click', (e) => {
  if (e.target.closest('#btn-clear-drill')) {
    update({ mode: 'full', challengeId: null });
    render();
    refreshIcons();
  }
});

document.getElementById('btn-back').addEventListener('click', () => {
  if (step === 1) location.href = 'index.html';
  else goTo(step - 1);
});
document.getElementById('btn-next').addEventListener('click', () => goTo(step + 1));
document.getElementById('btn-skip').addEventListener('click', () => goTo(3));

bootPage(render);
