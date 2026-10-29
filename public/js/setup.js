import { t, pick, getLang } from './i18n.js';
import { scenarios, audienceOptions, timeOptions, goalOptions, modes, drills, dailyDrill, drillPreset, scenarioPreset, CUSTOM } from './data.js';
import { getConfig, saveConfig, takeIntent, takeReturnStep, saveDeck, loadDeck } from './store.js';
import { bootPage, esc, icon, minutesLabel, refreshIcons } from './ui.js';

let config = getConfig();
let step = 1;
const deckState = { status: config.deck ? 'ready' : 'empty', error: null }; // empty | reading | ready | error

// Entry: back from the room (keep everything), or a fresh start / preset from elsewhere.
(function applyEntry() {
  const returnStep = takeReturnStep();
  if (returnStep) {
    step = returnStep;
    return;
  }
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

const customRadio = (name, checked) =>
  radio(name, CUSTOM, t('setup_custom'), { checked, iconName: 'pencil', tint: 'bg-panel' });

/** A text/number field revealed when the group's "Custom" option is picked. */
function customField({ id, label, value, placeholder = '', type = 'text', min, max, suffix = '' }) {
  return `
    <div class="min-w-0 flex-1">
      <label for="${id}" class="mb-1.5 block text-label font-bold">${esc(label)}</label>
      <div class="flex items-center gap-2">
        <input id="${id}" name="${id}" type="${type}" class="field" value="${esc(value)}"
          ${placeholder ? `placeholder="${esc(placeholder)}"` : ''} ${min != null ? `min="${min}"` : ''} ${max != null ? `max="${max}"` : ''}
          ${type === 'number' ? 'inputmode="numeric"' : ''} aria-describedby="${id}-err" autocomplete="off" />
        ${suffix ? `<span class="shrink-0 text-label font-semibold">${esc(suffix)}</span>` : ''}
      </div>
      <p id="${id}-err" class="mt-1.5 hidden text-meta font-semibold text-[#9b1240]"></p>
    </div>`;
}

function customPanel(group, open, fieldsHtml) {
  return `<div data-custom-for="${group}" class="mt-3 flex flex-wrap gap-4 rounded-corner border-detail border-dashed border-outline bg-selection p-4" ${open ? '' : 'hidden'}>${fieldsHtml}</div>`;
}

function group(legend, inner, cols = 'sm:grid-cols-2 lg:grid-cols-3', after = '', note = '') {
  return `
    <fieldset class="mt-9 first:mt-0">
      <legend class="subheading mb-4">${esc(legend)}</legend>
      ${note ? `<p class="-mt-2 mb-4 text-meta text-ink/75">${esc(note)}</p>` : ''}
      <div class="grid gap-3 ${cols}">${inner}</div>
      ${after}
    </fieldset>`;
}

function textarea(id, label, value, iconName) {
  return `
    <div>
      <label for="${id}" class="mb-2 flex items-center gap-2 text-label font-bold">${icon(iconName, 'h-4 w-4')}${esc(label)}</label>
      <textarea id="${id}" name="${id}" rows="4" class="field resize-y">${esc(value)}</textarea>
    </div>`;
}

/* ---------- steps ---------- */
function stepOne(lang) {
  const isC = (k) => config[k] === CUSTOM;
  return `
    ${group(
      t('setup_scenario'),
      scenarios.map((s) => radio('scenario', s.id, t(s.key), { checked: config.scenario === s.id, iconName: s.icon, tint: s.tint })).join('') +
        customRadio('scenario', isC('scenario')),
      'sm:grid-cols-2 lg:grid-cols-3',
      customPanel('scenario', isC('scenario'), customField({ id: 'customScenario', label: t('setup_customScenario'), value: config.customScenario, placeholder: t('setup_customScenarioPh') })),
    )}
    ${group(
      t('setup_audience'),
      audienceOptions.map((a) => radio('audience', a.id, lang === 'en' ? a.en : a.zh, { checked: config.audience === a.id })).join('') +
        customRadio('audience', isC('audience')),
      'sm:grid-cols-2',
      customPanel(
        'audience',
        isC('audience'),
        customField({ id: 'customAudience', label: t('setup_customAudience'), value: config.customAudience, placeholder: t('setup_customAudiencePh') }) +
          `<div class="w-full sm:w-48">${customField({ id: 'customAudienceCount', label: t('setup_customAudienceCount'), value: config.customAudienceCount, type: 'number', min: 1, max: 500 })}</div>`,
      ),
    )}
    <div class="mt-9">
      <label for="audienceDescription" class="subheading mb-4 block">${esc(t('setup_audienceDesc'))}</label>
      <textarea id="audienceDescription" name="audienceDescription" rows="2" class="field resize-y" placeholder="${esc(t('setup_audienceDescPh'))}">${esc(config.audienceDescription)}</textarea>
    </div>
    ${group(
      t('setup_practiceLang'),
      radio('practiceLanguage', 'en', 'English', { checked: config.practiceLanguage === 'en' }) +
        radio('practiceLanguage', 'zh', '中文', { checked: config.practiceLanguage === 'zh' }) +
        customRadio('practiceLanguage', isC('practiceLanguage')),
      'grid-cols-1 xs:grid-cols-3 sm:max-w-2xl',
      customPanel('practiceLanguage', isC('practiceLanguage'), `<div class="w-full sm:max-w-sm">${customField({ id: 'customLanguage', label: t('setup_customLanguage'), value: config.customLanguage, placeholder: t('setup_customLanguagePh') })}</div>`),
    )}
  `;
}

function deckBlock() {
  const meta = config.deck;
  let inner;
  if (deckState.status === 'reading') {
    inner = `<p class="flex items-center justify-center gap-2 py-6 text-label font-semibold">${icon('loader', 'h-5 w-5')}${esc(t('setup_deckReading'))}</p>`;
  } else if (deckState.status === 'ready' && meta) {
    inner = `
      <div class="flex flex-wrap items-center gap-5 text-left">
        <div class="flex h-[110px] w-[160px] shrink-0 items-center justify-center overflow-hidden rounded-[12px] border-detail border-outline bg-panel">
          <canvas id="deck-thumb" class="block max-h-full max-w-full" role="img" aria-label="${esc(t('setup_deckPreview'))} ${esc(meta.name)}"></canvas>
        </div>
        <div class="min-w-0 flex-1">
          <p class="flex items-center gap-2 font-display text-lg font-bold">${icon('file-text', 'h-5 w-5 shrink-0 text-accent')}<span class="truncate">${esc(meta.name)}</span></p>
          <p class="mt-1 text-meta text-ink/75">${meta.pages} ${esc(t('setup_deckPages'))} · ${esc(meta.sizeLabel || '')}</p>
          <div class="mt-3 flex flex-wrap gap-3">
            <button type="button" data-pick-deck class="btn btn-secondary btn-sm">${icon('refresh-cw', 'h-4 w-4')}${esc(t('setup_deckReplace'))}</button>
            <button type="button" id="btn-deck-remove" class="btn btn-secondary btn-sm">${icon('trash-2', 'h-4 w-4')}${esc(t('setup_deckRemove'))}</button>
          </div>
        </div>
      </div>`;
  } else {
    inner = `
      <button type="button" data-pick-deck class="btn btn-secondary">${icon('upload', 'h-5 w-5')}<span>${esc(t('setup_deckChoose'))}</span></button>
      <p class="mt-2 text-label font-semibold">${esc(t('setup_deckDrop'))}</p>`;
  }
  return `
    <section aria-labelledby="deck-title">
      <h3 id="deck-title" class="subheading mb-3">${esc(t('setup_deckTitle'))}</h3>
      <div id="deck-zone" class="rounded-corner border-detail border-dashed border-outline bg-field p-6 text-center">
        <input id="deck-input" type="file" accept="application/pdf,.pdf" class="sr-only" tabindex="-1" aria-hidden="true" />
        ${inner}
        <p class="mt-3 text-meta text-ink/75">${esc(t('setup_deckHint'))}</p>
      </div>
      <p id="deck-error" class="mt-2 text-label font-semibold text-[#9b1240]" role="alert">${deckState.error ? esc(t(deckState.error)) : ''}</p>
    </section>`;
}

function stepTwo() {
  return `
    <p class="mb-6 max-w-2xl text-ink/80">${esc(t('setup_materialsLead'))}</p>
    <div id="deck-block">${deckBlock()}</div>
    <div class="mt-8 grid gap-5 md:grid-cols-2">
      ${textarea('script', t('setup_pasteScript'), config.script, 'pen-line')}
      ${textarea('speakerNotes', t('setup_speakerNotes'), config.speakerNotes, 'sticky-note')}
      ${textarea('keyMessages', t('setup_keyMessages'), config.keyMessages, 'key-round')}
      ${textarea('expectedQuestions', t('setup_expectedQuestions'), config.expectedQuestions, 'circle-help')}
    </div>`;
}

function stepThree(lang) {
  const isC = (k) => config[k] === CUSTOM;
  const drillChoices = [dailyDrill, ...drills.filter((d) => d.id !== 'question')];
  const drillList =
    config.mode === 'skill'
      ? group(
          t('setup_pickDrill'),
          radio('challengeId', '', t('setup_noDrill'), { checked: !config.challengeId }) +
            drillChoices
              .map((d) =>
                radio('challengeId', d.id, d.id === 'daily60' ? t('home_challengeDesc') : pick(d, 'title', lang), {
                  checked: config.challengeId === d.id,
                  iconName: d.icon || 'calendar',
                  tint: d.tint || 'bg-amber',
                  desc: `${minutesLabel(d.seconds, lang)} · ${pick(d, 'skill', lang)}`,
                }),
              )
              .join(''),
          'sm:grid-cols-2 lg:grid-cols-3',
        )
      : '';
  return `
    ${group(t('setup_mode'), modes.map((m) => radio('mode', m.id, t(m.key), { checked: config.mode === m.id, iconName: m.icon, desc: t(m.descKey) })).join(''), 'md:grid-cols-3', '', t('setup_modeNote'))}
    ${drillList}
    ${group(
      t('setup_timeLimit'),
      timeOptions.map((s) => radio('timeLimit', s, minutesLabel(s, lang), { checked: !config.timeCustom && Number(config.timeLimit) === s })).join('') +
        customRadio('timeLimit', config.timeCustom),
      'grid-cols-2 xs:grid-cols-3 md:grid-cols-6',
      customPanel('timeLimit', config.timeCustom, `<div class="w-full sm:w-56">${customField({ id: 'customMinutes', label: t('setup_customMinutes'), value: config.customMinutes, type: 'number', min: 1, max: 60, suffix: t('common_min') })}</div>`),
    )}
    ${group(
      t('setup_goal'),
      goalOptions.map((g) => radio('goal', g, t(`goal_${g}`), { checked: config.goal === g })).join('') + customRadio('goal', isC('goal')),
      'grid-cols-1 xs:grid-cols-2 lg:grid-cols-3',
      customPanel('goal', isC('goal'), customField({ id: 'customGoal', label: t('setup_customGoal'), value: config.customGoal, placeholder: t('setup_customGoalPh') })),
    )}
  `;
}

/* ---------- validation ---------- */
const RULES = {
  1: [
    { when: () => config.scenario === CUSTOM, id: 'customScenario', ok: () => config.customScenario.trim(), msg: 'setup_err_required' },
    { when: () => config.audience === CUSTOM, id: 'customAudience', ok: () => config.customAudience.trim(), msg: 'setup_err_required' },
    { when: () => config.audience === CUSTOM, id: 'customAudienceCount', ok: () => inRange(config.customAudienceCount, 1, 500), msg: 'setup_err_count' },
    { when: () => config.practiceLanguage === CUSTOM, id: 'customLanguage', ok: () => config.customLanguage.trim(), msg: 'setup_err_required' },
  ],
  2: [],
  3: [
    { when: () => config.timeCustom, id: 'customMinutes', ok: () => inRange(config.customMinutes, 1, 60), msg: 'setup_err_minutes' },
    { when: () => config.goal === CUSTOM, id: 'customGoal', ok: () => config.customGoal.trim(), msg: 'setup_err_required' },
  ],
};

function inRange(v, min, max) {
  const n = Number(v);
  return Number.isInteger(n) && n >= min && n <= max;
}

function setError(id, key) {
  const input = document.getElementById(id);
  const err = document.getElementById(`${id}-err`);
  if (!input || !err) return;
  err.textContent = key ? t(key) : '';
  err.classList.toggle('hidden', !key);
  if (key) input.setAttribute('aria-invalid', 'true');
  else input.removeAttribute('aria-invalid');
}

/** Returns the first failing rule for a step without touching the DOM. */
const firstFailure = (n) => RULES[n].find((r) => r.when() && !r.ok());

/** Show errors for the visible step; focus the first problem. Returns true when valid. */
function validateVisible() {
  let first = null;
  RULES[step].forEach((r) => {
    const bad = r.when() && !r.ok();
    setError(r.id, bad ? r.msg : null);
    if (bad && !first) first = r.id;
  });
  if (first) document.getElementById(first)?.focus();
  return !first;
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
  if (step === 2) paintThumb();
}

function render() {
  renderStepper();
  renderDrillBanner();
  renderPanel();
}

function goTo(n, { focus = true } = {}) {
  const target = Math.min(3, Math.max(1, n));
  // Moving forward requires every earlier step to be valid.
  if (target > step) {
    if (!validateVisible()) return;
    for (let k = step + 1; k < target; k += 1) {
      if (firstFailure(k)) {
        goTo(k);
        validateVisible();
        return;
      }
    }
  }
  step = target;
  render();
  refreshIcons();
  if (focus) {
    document.getElementById('step-title').focus({ preventScroll: true });
    document.getElementById('stepper').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
  }
}

/* ---------- slides (PDF) ---------- */
let deckModule = null;
const getDeckModule = async () => (deckModule ||= await import('./deck.js'));

async function paintThumb() {
  const canvas = document.getElementById('deck-thumb');
  if (!canvas) return;
  try {
    const blob = await loadDeck();
    if (!blob) {
      update({ deck: null });
      deckState.status = 'empty';
      repaintDeck();
      return;
    }
    const { openPdf, renderPage } = await getDeckModule();
    const doc = await openPdf(blob);
    await renderPage(doc, 1, canvas, 156, 106);
    doc.destroy();
  } catch {
    /* thumbnail is a nicety; the file itself is still usable */
  }
}

function repaintDeck() {
  const holder = document.getElementById('deck-block');
  if (!holder) return;
  holder.innerHTML = deckBlock();
  refreshIcons();
  if (deckState.status === 'ready') paintThumb();
}

async function acceptFile(file) {
  if (!file) return;
  const { isPdf, MAX_DECK_BYTES, openPdf, formatBytes } = await getDeckModule();
  deckState.error = null;
  if (!isPdf(file)) {
    deckState.error = 'setup_deckErrType';
    repaintDeck();
    return;
  }
  if (file.size > MAX_DECK_BYTES) {
    deckState.error = 'setup_deckErrSize';
    repaintDeck();
    return;
  }
  deckState.status = 'reading';
  repaintDeck();
  try {
    const doc = await openPdf(file);
    const pages = doc.numPages;
    doc.destroy();
    const stored = await saveDeck(file);
    if (!stored) throw Object.assign(new Error('store'), { code: 'save' });
    update({ deck: { name: file.name, size: file.size, sizeLabel: formatBytes(file.size), pages } });
    deckState.status = 'ready';
  } catch (err) {
    deckState.status = config.deck ? 'ready' : 'empty';
    deckState.error = err?.code === 'save' ? 'setup_deckErrSave' : 'setup_deckErrRead';
  }
  repaintDeck();
  document.querySelector('#deck-zone [data-pick-deck]')?.focus();
}

/* ---------- events ---------- */
const form = document.getElementById('setup-form');

const CUSTOM_GROUPS = ['scenario', 'audience', 'practiceLanguage', 'timeLimit', 'goal'];
const FIRST_CUSTOM_INPUT = { scenario: 'customScenario', audience: 'customAudience', practiceLanguage: 'customLanguage', timeLimit: 'customMinutes', goal: 'customGoal' };

form.addEventListener('change', (e) => {
  const el = e.target;
  if (el.id === 'deck-input') {
    acceptFile(el.files?.[0]);
    el.value = '';
    return;
  }
  if (el.type !== 'radio') return;

  const name = el.name;
  if (name === 'timeLimit') {
    if (el.value === CUSTOM) update({ timeCustom: true, timeLimit: inRange(config.customMinutes, 1, 60) ? Number(config.customMinutes) * 60 : config.timeLimit });
    else update({ timeCustom: false, timeLimit: Number(el.value) });
  } else if (name === 'mode') {
    update({ mode: el.value, challengeId: el.value === 'skill' ? config.challengeId : null });
  } else if (name === 'challengeId') {
    const preset = el.value ? drillPreset(el.value) : null;
    update(preset ? { challengeId: el.value, timeLimit: preset.timeLimit, timeCustom: false, goal: preset.goal } : { challengeId: null });
  } else {
    update({ [name]: el.value });
  }

  if (CUSTOM_GROUPS.includes(name)) {
    const panel = form.querySelector(`[data-custom-for="${name}"]`);
    const open = el.value === CUSTOM;
    if (panel) panel.hidden = !open;
    if (open) document.getElementById(FIRST_CUSTOM_INPUT[name])?.focus();
  }

  // Mode and drill choices change other groups on step 3, so repaint it and keep focus.
  if (name === 'mode' || name === 'challengeId') {
    renderDrillBanner();
    renderPanel();
    refreshIcons();
    form.querySelector(`input[name="${name}"][value="${CSS.escape(el.value)}"]`)?.focus();
  }
});

form.addEventListener('input', (e) => {
  const el = e.target;
  if (el.tagName === 'TEXTAREA') return update({ [el.name]: el.value });
  if (el.tagName !== 'INPUT' || el.type === 'radio' || el.type === 'file') return;
  if (el.id === 'customMinutes') {
    update({ customMinutes: el.value, ...(inRange(el.value, 1, 60) ? { timeLimit: Number(el.value) * 60 } : {}) });
  } else {
    update({ [el.id]: el.value });
  }
  setError(el.id, null); // clear the error as soon as the field is edited
});

form.addEventListener('click', async (e) => {
  if (e.target.closest('[data-pick-deck]')) document.getElementById('deck-input').click();
  if (e.target.closest('#btn-deck-remove')) {
    await saveDeck(null);
    update({ deck: null });
    deckState.status = 'empty';
    deckState.error = null;
    repaintDeck();
    document.querySelector('#deck-zone [data-pick-deck]')?.focus();
  }
});

// Drag and drop onto the slide zone
form.addEventListener('dragover', (e) => {
  if (e.target.closest('#deck-zone')) {
    e.preventDefault();
    e.target.closest('#deck-zone').classList.add('!bg-mint');
  }
});
form.addEventListener('dragleave', (e) => e.target.closest('#deck-zone')?.classList.remove('!bg-mint'));
form.addEventListener('drop', (e) => {
  const zone = e.target.closest('#deck-zone');
  if (!zone) return;
  e.preventDefault();
  zone.classList.remove('!bg-mint');
  acceptFile(e.dataTransfer?.files?.[0]);
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  for (const n of [1, 2, 3]) {
    if (firstFailure(n)) {
      if (n !== step) {
        step = n;
        render();
        refreshIcons();
      }
      validateVisible();
      return;
    }
  }
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
