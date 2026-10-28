import { t, getLang } from './i18n.js';
import { prepNote as note } from './data.js';
import { getConfig } from './store.js';
import { bootPage, esc, icon, refreshIcons } from './ui.js';

const $ = (id) => document.getElementById(id);
const flags = { copied: false, saved: false };

const list = (field) => (getLang() === 'en' ? note[`${field}En`] : note[field]);

function buildNoteText() {
  const lines = [t('prep_title'), t('prep_subtitle'), '', t('prep_remember')];
  list('remember').forEach((r, i) => lines.push(`${i + 1}. ${r}`));
  lines.push('', t('prep_avoid'));
  list('avoid').forEach((a) => lines.push(`- ${a}`));
  lines.push('', t('prep_questions'));
  list('questionsToPrepare').forEach((q) => lines.push(`- ${q}`));
  lines.push('', t('prep_keyMessage'), getLang() === 'en' ? note.keyMessageEn : note.keyMessage);
  return lines.join('\n');
}

function renderBody() {
  const shapes = ['shape-circle bg-mint', 'shape-square bg-amber', 'shape-arch bg-pink'];
  $('note-body').innerHTML = `
    <section class="mt-10" aria-labelledby="remember-title">
      <h2 id="remember-title" class="subheading flex items-center gap-2">${icon('check', 'h-5 w-5 text-accent')}${esc(t('prep_remember'))}</h2>
      <ol class="mt-4 space-y-3">
        ${list('remember')
          .map(
            (r, i) => `
          <li class="flex items-center gap-4">
            <span class="step-badge !h-11 !w-11 !text-lg ${shapes[i % 3]}" aria-hidden="true">${i + 1}</span>
            <span class="text-lg font-semibold">${esc(r)}</span>
          </li>`,
          )
          .join('')}
      </ol>
    </section>

    <section class="mt-10 border-t-2 border-dashed border-rule pt-8" aria-labelledby="avoid-title">
      <h2 id="avoid-title" class="subheading flex items-center gap-2">${icon('x', 'h-5 w-5 text-accent')}${esc(t('prep_avoid'))}</h2>
      <ul class="mt-4 grid gap-3 sm:grid-cols-2">
        ${list('avoid')
          .map(
            (a) => `
          <li class="flex items-start gap-3 rounded-corner border-detail border-outline bg-panel p-4">
            <span class="tile-icon h-8 w-8 bg-pink">${icon('x', 'h-4 w-4')}</span>
            <span class="pt-1 font-semibold">${esc(a)}</span>
          </li>`,
          )
          .join('')}
      </ul>
    </section>

    <section class="mt-10 border-t-2 border-dashed border-rule pt-8" aria-labelledby="questions-title">
      <h2 id="questions-title" class="subheading flex items-center gap-2">${icon('circle-help', 'h-5 w-5 text-accent')}${esc(t('prep_questions'))}</h2>
      <ul class="mt-4 grid gap-5 sm:grid-cols-3">
        ${list('questionsToPrepare').map((q) => `<li class="speech bg-selection font-display text-lg font-bold">${esc(q)}</li>`).join('')}
      </ul>
    </section>

    <section class="mt-12 rounded-corner border-line border-outline bg-mint p-5 shadow-hard md:p-6" aria-labelledby="key-title">
      <h2 id="key-title" class="flex items-center gap-2 text-label font-bold uppercase tracking-[0.08em]">${icon('key-round', 'h-4 w-4')}${esc(t('prep_keyMessage'))}</h2>
      <p class="mt-2 font-display text-2xl font-extrabold leading-snug">${esc(getLang() === 'en' ? note.keyMessageEn : note.keyMessage)}</p>
    </section>`;
}

function renderActions() {
  $('copy-label').textContent = flags.copied ? t('prep_copied') : t('prep_copy');
  $('save-label').textContent = flags.saved ? t('prep_saved') : t('prep_save');
  $('copy-icon').innerHTML = icon(flags.copied ? 'circle-check' : 'copy', 'h-5 w-5');
  $('save-icon').innerHTML = icon(flags.saved ? 'circle-check' : 'save', 'h-5 w-5');
}

function flash(name, key) {
  flags[name] = true;
  $('action-status').textContent = t(key);
  renderActions();
  refreshIcons();
  setTimeout(() => {
    flags[name] = false;
    renderActions();
    refreshIcons();
  }, 2000);
}

$('btn-copy').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(buildNoteText());
    flash('copied', 'prep_copied');
  } catch {
    /* clipboard can be blocked outside secure contexts */
  }
});

$('btn-save').addEventListener('click', () => {
  try {
    localStorage.setItem('prep:lastPrepNote', buildNoteText());
    localStorage.setItem('prep:lastPracticeConfig', JSON.stringify(getConfig()));
  } catch {
    /* prototype continues without storage */
  }
  flash('saved', 'prep_saved');
});

bootPage(() => {
  renderBody();
  renderActions();
});
