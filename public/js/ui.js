// Shared UI helpers: header, language toggle, icons, formatting.
import { getLang, setLang, t } from './i18n.js';

export const esc = (s) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

export const icon = (name, cls = 'h-5 w-5') => `<i data-lucide="${name}" class="${cls}" aria-hidden="true"></i>`;

export function refreshIcons() {
  if (window.lucide) window.lucide.createIcons({ attrs: { 'stroke-width': 2.25, 'aria-hidden': 'true' } });
}

export function fmtTime(s) {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}

export function minutesLabel(seconds, lang = getLang()) {
  const m = seconds / 60;
  return lang === 'en' ? `${m} ${t('common_min', lang)}` : `${m} ${t('common_min', lang)}`;
}

/** Fill every [data-i18n] / [data-i18n-attr] element on the page. */
export function applyStaticCopy(root = document) {
  const lang = getLang();
  root.querySelectorAll('[data-i18n]').forEach((el) => {
    el.textContent = t(el.dataset.i18n, lang);
  });
  root.querySelectorAll('[data-i18n-attr]').forEach((el) => {
    // format: "placeholder:key;aria-label:key"
    el.dataset.i18nAttr.split(';').forEach((pair) => {
      const [attr, key] = pair.split(':');
      if (attr && key) el.setAttribute(attr.trim(), t(key.trim(), lang));
    });
  });
}

function renderHeader() {
  const el = document.getElementById('site-header');
  if (!el) return;
  const lang = getLang();
  const container = el.hasAttribute('data-wide') ? 'mx-auto w-full max-w-[1480px] px-4 md:px-6 lg:px-8' : 'page';
  el.innerHTML = `
    <a href="#main" class="sr-only-focusable fixed left-4 top-3 z-[60] rounded-full border-detail border-outline bg-amber px-4 py-2 text-label font-bold">${esc(t('skip'))}</a>
    <div class="${container} flex h-20 items-center justify-between gap-4">
      <a href="index.html" class="group flex items-center gap-3 rounded-corner" aria-label="Prep! ${esc(t('nav_home'))}">
        <span class="flex h-11 w-11 items-center justify-center rounded-[13px] border-line border-outline bg-accent font-display text-xl font-extrabold text-white shadow-hard-sm" aria-hidden="true">P</span>
        <span class="flex flex-col leading-none">
          <span class="font-display text-xl font-extrabold tracking-tight">Prep!</span>
          <span class="mt-1 hidden text-meta text-ink/70 xs:block">${esc(t('tagline'))}</span>
        </span>
      </a>
      <button type="button" id="lang-toggle" class="btn btn-secondary btn-sm" aria-label="${esc(t('nav_lang'))}">
        ${icon('languages', 'h-4 w-4')}
        <span>${lang === 'en' ? '中文' : 'EN'}</span>
      </button>
    </div>`;
  el.querySelector('#lang-toggle').addEventListener('click', () => {
    setLang(getLang() === 'en' ? 'zh' : 'en');
  });
}

/**
 * Boot a page: header, static copy, icons, and a re-render hook on language change.
 * @param {() => void} render page-specific render for dynamic parts
 */
export function bootPage(render = () => {}) {
  document.documentElement.lang = getLang() === 'zh' ? 'zh-Hant' : 'en';
  const paint = () => {
    renderHeader();
    applyStaticCopy();
    render();
    refreshIcons();
  };
  window.addEventListener('prep:langchange', () => {
    const toggleHadFocus = document.activeElement?.id === 'lang-toggle';
    paint();
    if (toggleHadFocus) document.getElementById('lang-toggle')?.focus();
  });
  paint();
}
