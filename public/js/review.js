import { t, pick, getLang } from './i18n.js';
import { analysisSteps, categoryScores, feedbackMarkers, audienceUnderstanding } from './data.js';
import { getSession, loadRecording } from './store.js';
import { bootPage, esc, icon, fmtTime, refreshIcons } from './ui.js';

const $ = (id) => document.getElementById(id);
const session = getSession();
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

let analysisStep = 0;
let analysisDone = false;
let selectedId = null;
let videoUrl = null;

const TONES = {
  positive: { icon: 'thumbs-up', fill: 'bg-mint', key: 'review_tone_positive' },
  warning: { icon: 'triangle-alert', fill: 'bg-amber', key: 'review_tone_warning' },
  critical: { icon: 'circle-alert', fill: 'bg-pink', key: 'review_tone_critical' },
};
const METER_FILLS = ['bg-accent', 'bg-pink', 'bg-amber', 'bg-mint', 'bg-accent'];

/* ---------- analysis (loading state) ---------- */
function renderAnalysis() {
  $('analysis-steps').innerHTML = analysisSteps
    .map((s, i) => {
      const done = i < analysisStep;
      return `
      <li class="flex items-center gap-3 rounded-corner border-detail border-outline ${done ? 'bg-field' : 'bg-panel'} px-4 py-2.5">
        <span class="tile-icon h-9 w-9 ${done ? 'bg-mint' : 'bg-ground'}">${icon(done ? 'check' : s.icon, 'h-4 w-4')}</span>
        <span class="flex-1 text-label font-semibold ${done ? '' : 'text-ink/70'}">${esc(t(s.key))}</span>
      </li>`;
    })
    .join('');
}

function runAnalysis() {
  if (analysisStep < analysisSteps.length) {
    analysisStep += 1;
    renderAnalysis();
    refreshIcons();
    setTimeout(runAnalysis, reduceMotion ? 120 : 350);
    return;
  }
  setTimeout(() => {
    analysisDone = true;
    $('analyzing').hidden = true;
    $('report').hidden = false;
    renderReport();
    refreshIcons();
    $('report-title').focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }, 500);
}

/* ---------- report ---------- */
function renderScores() {
  const lang = getLang();
  $('scores').innerHTML = categoryScores
    .map(
      (s, i) => `
      <li class="panel-flat p-4 md:p-5">
        <p class="font-display text-4xl font-extrabold tabular-nums">${s.score}</p>
        <p class="mt-1 min-h-[2.6em] text-label font-semibold">${esc(pick(s, 'category', lang))}</p>
        <div class="meter mt-3" role="meter" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${s.score}" aria-label="${esc(pick(s, 'category', lang))}">
          <span class="${METER_FILLS[i]}" style="width:${s.score}%"></span>
        </div>
      </li>`,
    )
    .join('');
}

function renderMarkers() {
  const lang = getLang();
  $('markers').innerHTML = feedbackMarkers
    .map((m) => {
      const tone = TONES[m.tone];
      const active = m.id === selectedId;
      return `
      <li>
        <button type="button" data-marker="${m.id}" aria-pressed="${active}"
          class="option w-full !items-start text-left ${active ? '!bg-selection' : ''}" style="${active ? 'box-shadow:4px 4px 0 0 var(--dp-color-accent)' : ''}">
          <span class="tile-icon h-10 w-10 ${tone.fill}">${icon(tone.icon, 'h-5 w-5')}</span>
          <span class="min-w-0">
            <span class="flex flex-wrap items-center gap-2 text-meta">
              <span class="font-display font-extrabold tabular-nums text-accent">${fmtTime(m.timestamp)}</span>
              <span class="font-semibold text-ink/75">${esc(t(tone.key))}</span>
            </span>
            <span class="mt-0.5 block font-display text-base font-bold">${esc(pick(m, 'title', lang))}</span>
          </span>
        </button>
      </li>`;
    })
    .join('');
}

function renderDetail() {
  const lang = getLang();
  const m = feedbackMarkers.find((x) => x.id === selectedId);
  const el = $('marker-detail');
  if (!m) {
    el.innerHTML = `
      <div class="flex h-full min-h-[220px] flex-col items-center justify-center gap-3 text-center text-ink/75">
        ${icon('mouse-pointer-click', 'h-8 w-8')}
        <p class="max-w-xs text-label">${esc(t('review_pickMarker'))}</p>
      </div>`;
    return;
  }
  const tone = TONES[m.tone];
  const block = (label, text, fill) => `
    <div class="rounded-corner border-detail border-outline ${fill} p-4">
      <p class="text-meta font-bold uppercase tracking-[0.08em]">${esc(label)}</p>
      <p class="mt-1 leading-relaxed">${esc(text)}</p>
    </div>`;
  el.innerHTML = `
    <p class="flex flex-wrap items-center gap-2 text-meta font-semibold text-ink/75">
      <span class="chip ${tone.fill}">${icon(tone.icon, 'h-3.5 w-3.5')}${esc(t(tone.key))}</span>
      <span>${esc(pick(m, 'category', lang))}</span>
      <span class="font-display font-extrabold tabular-nums text-accent">${fmtTime(m.timestamp)}</span>
    </p>
    <h3 class="subheading mt-3 !text-xl">${esc(pick(m, 'title', lang))}</h3>
    <div class="mt-5 grid gap-3">
      ${block(t('review_whatHappened'), pick(m, 'whatHappened', lang), 'bg-panel')}
      ${block(t('review_whyItMatters'), pick(m, 'whyItMatters', lang), 'bg-panel')}
      ${block(t('review_tryNext'), pick(m, 'tryNextTime', lang), 'bg-field')}
    </div>`;
}

function renderUnderstanding() {
  const lang = getLang();
  const u = audienceUnderstanding;
  const item = (iconName, fill, label, text) => `
    <li class="flex items-start gap-3">
      <span class="tile-icon h-9 w-9 ${fill}">${icon(iconName, 'h-4 w-4')}</span>
      <span><span class="block text-meta font-bold uppercase tracking-[0.08em] text-ink/75">${esc(label)}</span><span class="mt-0.5 block">${esc(text)}</span></span>
    </li>`;
  $('understanding').innerHTML = `
    <div class="grid gap-8 md:grid-cols-[220px_minmax(0,1fr)] md:items-start">
      <div class="text-center">
        <div class="mx-auto flex h-40 w-40 items-center justify-center rounded-full border-line border-outline bg-panel shadow-hard-accent">
          <span class="font-display text-5xl font-extrabold tabular-nums">${u.understandingScore}%</span>
        </div>
        <p class="mt-5 text-label font-bold">${esc(t('review_estimated'))}</p>
        <p class="text-meta text-ink/75">${esc(t('review_aiEstimated'))}</p>
      </div>
      <div>
        <ul class="grid gap-4 sm:grid-cols-2">
          ${item('lightbulb', 'bg-selection', t('review_mainIdea'), pick(u, 'mainIdea', lang))}
          ${item('thumbs-up', 'bg-mint', t('review_remembered'), pick(u, 'whatTheyRemembered', lang))}
          ${item('circle-alert', 'bg-amber', t('review_missed'), pick(u, 'whatTheyMissed', lang))}
          ${item('triangle-alert', 'bg-pink', t('review_confused'), pick(u, 'whatConfusedThem', lang))}
        </ul>
        <h3 class="mt-8 text-label font-bold">${esc(t('review_questionsTitle'))}</h3>
        <ol class="mt-3 grid gap-5 sm:grid-cols-3">
          ${(lang === 'en' ? u.questionsEn : u.questions)
            .map((q, i) => `<li class="speech text-label font-semibold"><span class="sr-only">Q${i + 1}. </span>“${esc(q)}”</li>`)
            .join('')}
        </ol>
      </div>
    </div>`;
}

function renderPlayState() {
  const v = $('replay');
  const playing = !v.paused && !v.ended;
  $('play-icon').innerHTML = icon(playing ? 'pause' : 'play', 'h-7 w-7');
  $('play-label').textContent = playing ? t('review_pauseVideo') : t('review_play');
  $('btn-play').closest('#play-wrap').classList.toggle('opacity-0', playing);
  refreshIcons();
}

function renderReport() {
  $('duration-text').textContent = fmtTime(session.durationSec || 0);
  renderScores();
  renderMarkers();
  renderDetail();
  renderUnderstanding();
  if (videoUrl) renderPlayState();
}

/* ---------- video ---------- */
async function setupVideo() {
  if (!session.hasRecording) return;
  const blob = await loadRecording();
  if (!blob) return;
  videoUrl = URL.createObjectURL(blob);
  const v = $('replay');
  v.src = videoUrl;
  v.classList.remove('hidden');
  $('no-recording').hidden = true;
  $('play-wrap').hidden = false;
  $('video-time').classList.remove('hidden');
  v.addEventListener('timeupdate', () => ($('video-time').textContent = fmtTime(v.currentTime)));
  ['play', 'pause', 'ended'].forEach((ev) => v.addEventListener(ev, renderPlayState));
  v.addEventListener('click', () => (v.paused ? v.play() : v.pause()));
  $('btn-play').addEventListener('click', () => (v.paused ? v.play() : v.pause()));
  renderPlayState();
}

function seekTo(seconds) {
  const v = $('replay');
  if (!videoUrl) return;
  v.currentTime = Math.max(0, seconds - 3);
  v.play().catch(() => {});
}

$('markers').addEventListener('click', (e) => {
  const b = e.target.closest('[data-marker]');
  if (!b) return;
  selectedId = b.dataset.marker;
  renderMarkers();
  renderDetail();
  refreshIcons();
  document.querySelector(`[data-marker="${selectedId}"]`)?.focus();
  const m = feedbackMarkers.find((x) => x.id === selectedId);
  if (m) seekTo(m.timestamp);
});

window.addEventListener('pagehide', () => videoUrl && URL.revokeObjectURL(videoUrl));

bootPage(() => {
  if (analysisDone) renderReport();
  else renderAnalysis();
});
setupVideo();
runAnalysis();
