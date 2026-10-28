import { t, getLang } from './i18n.js';
import { scenarios, audienceOptions, getReactionEvents, reactionCopy, roomSubtitle } from './data.js';
import { getConfig, saveSession, saveRecording } from './store.js';
import { bootPage, esc, icon, fmtTime, refreshIcons } from './ui.js';
import { avatarSVG } from './avatar.js';

const config = getConfig();
const $ = (id) => document.getElementById(id);

const audience = audienceOptions.find((a) => a.id === config.audience);
const avatarCount = audience ? Math.min(audience.count, 6) : 5;
const events = getReactionEvents(config.scenario);
const timeLimit = Number(config.timeLimit) || 180;

const state = {
  stream: null,
  recorder: null,
  chunks: [],
  cameraEnabled: false,
  cameraError: false,
  recording: false,
  paused: false,
  ending: false,
  elapsed: 0,
  camOn: true,
  micOn: true,
  eventIndex: 0,
  avatars: Array.from({ length: avatarCount }, () => ({ reaction: 'neutral', label: null })),
  log: [], // { time, key | text }
  cue: null, // { kind, title:{en,zh}, text:{en,zh} }
  question: null, // { en, zh }
};
let tickTimer = null;
let cueTimer = null;

const L = (pair) => (getLang() === 'en' ? pair.en : pair.zh);

/* ---------- rendering ---------- */
function renderChips() {
  const lang = getLang();
  const scenario = scenarios.find((s) => s.id === config.scenario) || scenarios[0];
  const chips = [
    ['video', t('room_scenario'), lang === 'en' ? scenario.room[0] : scenario.room[1]],
    ['users', t('room_audience'), audience ? (lang === 'en' ? audience.en : audience.zh) : '—'],
    ['globe', t('room_language'), config.practiceLanguage === 'en' ? 'English' : '中文'],
    ['target', t('room_goal'), t(`goal_${config.goal}`)],
  ];
  $('info-chips').innerHTML = chips
    .map(
      ([ic, label, value]) => `
      <li class="flex items-center gap-2.5 rounded-corner border-detail border-outline bg-panel px-3.5 py-2">
        ${icon(ic, 'h-4 w-4 text-accent')}
        <span class="leading-tight"><span class="block text-[12px] font-semibold uppercase tracking-[0.08em] text-ink/70">${esc(label)}</span><span class="block text-label font-bold">${esc(value)}</span></span>
      </li>`,
    )
    .join('');
  $('room-title').textContent = lang === 'en' ? scenario.room[0] : scenario.room[1];
  $('room-subtitle').textContent = roomSubtitle(config.scenario, audience ? (lang === 'en' ? audience.en : audience.zh) : '', lang);
  const message = config.keyMessages?.split('\n').find((l) => l.trim()) || config.materials?.[0];
  $('screen-message').textContent = message || t('room_keyMessagePh');
  $('time-limit').textContent = fmtTime(timeLimit);
}

function renderAudience() {
  $('audience').innerHTML = state.avatars
    .map((a, i) => {
      const reaction = L(reactionCopy[a.reaction]);
      return `
      <li class="flex flex-col items-center ${i % 2 ? 'sm:translate-y-3' : ''}">
        <div class="mb-2 flex min-h-[2.6rem] items-end">
          ${a.label ? `<p class="speech max-w-[140px] !px-2.5 !py-1.5 text-center text-[12px] font-semibold leading-snug">${esc(L(a.label))}</p>` : ''}
        </div>
        <div class="h-[72px] w-[72px] overflow-hidden rounded-[18px] border-line border-outline shadow-hard-sm md:h-[84px] md:w-[84px]">${avatarSVG(i, a.reaction)}</div>
        <div class="mt-2 h-6 w-[88px] rounded-t-[12px] border-detail border-b-0 border-outline bg-panel md:w-[100px]" aria-hidden="true"></div>
        <p class="mt-1.5 text-center text-meta font-semibold text-ink/80">
          <span class="sr-only">${esc(t('room_member'))} ${i + 1}: </span>${esc(reaction)}
        </p>
      </li>`;
    })
    .join('');
}

function renderLog() {
  const el = $('reaction-log');
  if (state.log.length === 0) {
    el.innerHTML = `<li class="rounded-corner border-detail border-dashed border-rule p-4 text-center text-meta text-ink/70">${esc(state.recording ? t('room_listening') : t('room_beforeStart'))}</li>`;
    return;
  }
  el.innerHTML = state.log
    .map(
      (entry) => `
      <li class="flex items-start gap-2.5 rounded-corner border-detail border-outline bg-panel p-3 text-meta">
        <span class="font-display font-extrabold tabular-nums text-accent">${fmtTime(entry.time)}</span>
        <span class="font-medium">${esc(entry.key ? t(entry.key) : L(entry.text))}</span>
      </li>`,
    )
    .join('');
}

function renderCue() {
  const el = $('live-cue');
  if (!state.recording || !state.cue) {
    el.innerHTML = '';
    return;
  }
  const { kind } = state.cue;
  const tone = kind === 'time' ? ['bg-amber', 'clock'] : kind === 'audience' ? ['bg-pink', 'users'] : ['bg-mint', 'lightbulb'];
  el.innerHTML = `
    <div class="panel flex items-start gap-3 p-4">
      <span class="tile-icon h-10 w-10 ${tone[0]}">${icon(tone[1], 'h-5 w-5')}</span>
      <div>
        <p class="text-label font-bold">${esc(L(state.cue.title))}</p>
        <p class="mt-0.5 text-meta leading-relaxed text-ink/80">${esc(L(state.cue.text))}</p>
      </div>
    </div>`;
}

function renderQuestion() {
  const el = $('question');
  if (!state.question) {
    el.innerHTML = '';
    return;
  }
  el.innerHTML = `
    <div class="mx-auto flex max-w-xl items-start gap-4">
      <span class="tile-icon mt-1 h-11 w-11 bg-amber">${icon('hand', 'h-5 w-5')}</span>
      <div class="speech flex-1 !bg-selection !px-5 !py-4">
        <p class="text-label font-bold">${esc(t('room_question'))}</p>
        <p class="mt-1 font-display text-lg font-bold">“${esc(L(state.question))}”</p>
        <div class="mt-4 flex flex-wrap gap-3">
          <button type="button" id="btn-take" class="btn btn-primary btn-sm">${esc(t('room_takeQuestion'))}</button>
          <button type="button" id="btn-later" class="btn btn-secondary btn-sm">${esc(t('room_later'))}</button>
        </div>
      </div>
    </div>`;
}

function renderControls() {
  const lang = getLang();
  $('pre-controls').hidden = state.recording;
  $('live-controls').hidden = !state.recording;
  $('btn-start-label').textContent = state.cameraEnabled ? t('room_start') : t('room_enableFirst');
  $('btn-demo').hidden = !state.cameraError;
  $('pause-label').textContent = state.paused ? t('room_resume') : t('room_pause');
  $('pause-icon').innerHTML = icon(state.paused ? 'play' : 'pause', 'h-5 w-5');
  $('btn-cam').setAttribute('aria-pressed', String(state.camOn));
  $('btn-mic').setAttribute('aria-pressed', String(state.micOn));
  $('btn-cam').classList.toggle('!bg-rule', !state.camOn);
  $('btn-mic').classList.toggle('!bg-rule', !state.micOn);

  // Self view
  const showVideo = state.cameraEnabled && state.camOn;
  $('self-video').classList.toggle('hidden', !showVideo);
  $('cam-off').classList.toggle('hidden', !(state.cameraEnabled && !state.camOn));
  $('cam-off').classList.toggle('flex', state.cameraEnabled && !state.camOn);
  $('cam-prompt').classList.toggle('hidden', state.cameraEnabled);
  $('cam-prompt').classList.toggle('flex', !state.cameraEnabled);
  $('cam-prompt-text').textContent = state.cameraError ? t('room_noCamera') : t('room_cameraHint');
  $('cam-prompt-icon').innerHTML = icon(state.cameraError ? 'circle-alert' : 'camera', 'h-7 w-7');
  $('btn-enable-cam').hidden = state.cameraEnabled;

  const rec = $('rec-indicator');
  rec.classList.toggle('hidden', !state.recording);
  rec.classList.toggle('inline-flex', state.recording);
  $('rec-label').textContent = state.paused ? t('room_paused') : t('room_recording');
  void lang;
}

function renderTime() {
  $('timer').textContent = fmtTime(state.elapsed);
  $('progress').style.width = `${Math.min((state.elapsed / timeLimit) * 100, 100)}%`;
}

function renderAll() {
  renderChips();
  renderAudience();
  renderLog();
  renderCue();
  renderQuestion();
  renderControls();
  renderTime();
}

const paintDynamic = () => {
  renderCue();
  renderQuestion();
  renderControls();
  refreshIcons();
};

/* ---------- behaviour ---------- */
function pushCue(cue) {
  state.cue = cue;
  renderCue();
  refreshIcons();
  clearTimeout(cueTimer);
  cueTimer = setTimeout(() => {
    if (state.cue === cue) {
      state.cue = null;
      renderCue();
    }
  }, 4500);
}

function addLog(entry) {
  state.log = [entry, ...state.log].slice(0, 5);
  renderLog();
}

function processEvents() {
  let changed = false;
  while (state.eventIndex < events.length && events[state.eventIndex].time <= state.elapsed) {
    const ev = events[state.eventIndex];
    state.eventIndex += 1;
    if (ev.avatarIndex < avatarCount) {
      state.avatars[ev.avatarIndex] = {
        reaction: ev.reaction,
        label: ev.message ? { en: ev.message, zh: ev.messageZh || ev.message } : null,
      };
      changed = true;
    }
    if (ev.message) addLog({ time: ev.time, text: reactionCopy[ev.reaction] });
    if (ev.reaction === 'confused') {
      pushCue({
        kind: 'coach',
        title: { en: 'Audience looks unsure', zh: '觀眾似乎有點困惑' },
        text: { en: 'Try stating your main point in one sentence.', zh: '試著用一句話重新講清楚你的重點。' },
      });
    }
    if (ev.reaction === 'checking_phone' || ev.reaction === 'distracted') {
      pushCue({
        kind: 'audience',
        title: { en: 'Attention is drifting', zh: '觀眾注意力正在下降' },
        text: { en: 'Try a question, pause, or a stronger example.', zh: '可以試著停頓、提問，或換成更有力的例子。' },
      });
    }
    if (ev.question) {
      state.question = { en: ev.question, zh: ev.questionZh || ev.question };
      renderQuestion();
      refreshIcons();
    }
  }
  if (changed) renderAudience();
}

function tick() {
  state.elapsed += 1;
  renderTime();
  processEvents();
  if (timeLimit - state.elapsed === 60) {
    pushCue({
      kind: 'time',
      title: { en: '1 minute remaining', zh: '剩下 1 分鐘' },
      text: { en: 'Start moving toward your key takeaway.', zh: '可以開始收斂到你的核心重點。' },
    });
  }
}

function startTicking() {
  clearInterval(tickTimer);
  tickTimer = setInterval(tick, 1000);
}

async function enableCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: true });
    state.stream = stream;
    state.cameraEnabled = true;
    state.cameraError = false;
    state.camOn = true;
    state.micOn = true;
    const video = $('self-video');
    video.srcObject = stream;
    video.play().catch(() => {});
  } catch {
    state.cameraError = true;
    state.cameraEnabled = false;
  }
  paintDynamic();
  if (state.cameraEnabled) $('btn-start').focus();
}

function startRecording() {
  state.chunks = [];
  const stream = state.stream;
  if (!stream || stream.getVideoTracks().length === 0 || typeof MediaRecorder === 'undefined') return;
  try {
    const recorder = new MediaRecorder(stream);
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) state.chunks.push(e.data);
    };
    recorder.start(1000);
    state.recorder = recorder;
  } catch {
    state.recorder = null;
  }
}

function begin() {
  state.ending = false;
  state.eventIndex = 0;
  state.recording = true;
  state.paused = false;
  state.elapsed = 0;
  state.log = [];
  state.question = null;
  state.avatars = state.avatars.map(() => ({ reaction: 'neutral', label: null }));
  renderAudience();
  renderLog();
  renderTime();
  pushCue({
    kind: 'coach',
    title: { en: 'You are live', zh: '模擬開始' },
    text: { en: 'Focus on the room, not the score.', zh: '先專注在觀眾與表達，不需要看分數。' },
  });
  startTicking();
  startRecording();
  paintDynamic();
  $('btn-pause').focus();
}

async function handleStart() {
  if (!state.cameraEnabled) {
    await enableCamera();
    return;
  }
  begin();
}

function handlePause() {
  if (state.paused) {
    state.paused = false;
    startTicking();
    if (state.recorder?.state === 'paused') state.recorder.resume();
  } else {
    state.paused = true;
    clearInterval(tickTimer);
    if (state.recorder?.state === 'recording') state.recorder.pause();
  }
  paintDynamic();
}

async function finish(blob) {
  state.stream?.getTracks().forEach((track) => track.stop());
  const stored = await saveRecording(blob);
  saveSession({ durationSec: state.elapsed, hasRecording: Boolean(blob) && stored });
  location.href = 'review.html';
}

function handleEnd() {
  if (state.ending) return;
  state.ending = true;
  clearInterval(tickTimer);
  const recorder = state.recorder;
  const collect = () => (state.chunks.length ? new Blob(state.chunks, { type: recorder?.mimeType || 'video/webm' }) : null);
  if (recorder && recorder.state !== 'inactive') {
    recorder.onstop = () => finish(collect());
    try {
      recorder.stop();
    } catch {
      finish(collect());
    }
    return;
  }
  finish(collect());
}

function toggleTrack(kind) {
  const track = kind === 'video' ? state.stream?.getVideoTracks()[0] : state.stream?.getAudioTracks()[0];
  if (!track) return;
  track.enabled = !track.enabled;
  if (kind === 'video') state.camOn = track.enabled;
  else state.micOn = track.enabled;
  paintDynamic();
}

/* ---------- wiring ---------- */
$('btn-enable-cam').addEventListener('click', enableCamera);
$('btn-start').addEventListener('click', handleStart);
$('btn-demo').addEventListener('click', begin);
$('btn-pause').addEventListener('click', handlePause);
$('btn-cam').addEventListener('click', () => toggleTrack('video'));
$('btn-mic').addEventListener('click', () => toggleTrack('audio'));
$('btn-end').addEventListener('click', handleEnd);
$('question').addEventListener('click', (e) => {
  if (e.target.closest('#btn-take')) {
    state.question = null;
    addLog({ time: state.elapsed, key: 'room_tookQuestion' });
    pushCue({
      kind: 'coach',
      title: { en: 'Answer, then bridge back', zh: '回答後記得接回主線' },
      text: { en: 'Give a concise answer, then return to your key message.', zh: '先簡短回答，再把話題帶回你的核心訊息。' },
    });
    renderQuestion();
    $('btn-pause').focus();
  }
  if (e.target.closest('#btn-later')) {
    state.question = null;
    addLog({ time: state.elapsed, key: 'room_savedQuestion' });
    renderQuestion();
    $('btn-pause').focus();
  }
});
window.addEventListener('pagehide', () => state.stream?.getTracks().forEach((track) => track.stop()));

bootPage(renderAll);
