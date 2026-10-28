import { t, pick, getLang } from './i18n.js';
import { scenarios, drills, dailyDrill } from './data.js';
import { bootPage, esc, icon, minutesLabel } from './ui.js';
import { setIntent } from './store.js';

function renderScenarios() {
  const lang = getLang();
  document.getElementById('scenario-list').innerHTML = scenarios
    .map(
      (s) => `
      <li>
        <a href="setup.html?scenario=${s.id}" class="option h-full gap-4 p-5">
          <span class="tile-icon ${s.tint}">${icon(s.icon, 'h-6 w-6')}</span>
          <span class="min-w-0 flex-1">
            <span class="block font-display text-lg font-bold">${esc(t(s.key))}</span>
            <span class="mt-0.5 block text-meta font-medium text-ink/70">${esc(lang === 'en' ? s.room[0] : s.room[1])}</span>
          </span>
          ${icon('arrow-right', 'h-5 w-5 shrink-0')}
        </a>
      </li>`,
    )
    .join('');
}

function ticket({ href, title, iconName, tint, rows, cta, highlight = false, headingTag = 'h3', eyebrow = '', wide = false }) {
  return `
    <div class="ticket ${highlight ? 'bg-amber' : ''}">
      <div class="flex items-center gap-4 p-5">
        <span class="tile-icon ${highlight ? 'bg-panel' : tint}">${icon(iconName, 'h-6 w-6')}</span>
        <div class="min-w-0">
          ${eyebrow ? `<p class="eyebrow text-ink/80">${esc(eyebrow)}</p>` : ''}
          <${headingTag} class="font-display text-lg font-bold leading-snug">${esc(title)}</${headingTag}>
        </div>
      </div>
      <dl class="${wide ? 'grid grid-cols-2 gap-3 md:grid-cols-3' : 'grid grid-cols-3 gap-3 md:grid-cols-1 md:gap-1'} p-5 text-meta">
        ${rows
          .map(
            ([k, v]) => `<div class="min-w-0 ${wide ? '' : 'md:flex md:items-baseline md:justify-between md:gap-3'}"><dt class="text-ink/70">${esc(k)}</dt><dd class="font-bold text-ink ${wide ? '' : 'md:text-right'}">${esc(v)}</dd></div>`,
          )
          .join('')}
      </dl>
      <div class="flex items-center justify-center p-5">
        <a href="${href}" class="btn ${highlight ? 'btn-secondary' : 'btn-primary'} btn-sm w-full md:w-auto">${esc(cta)}${icon('arrow-right', 'h-4 w-4')}</a>
      </div>
    </div>`;
}

function renderDrills() {
  const lang = getLang();
  document.getElementById('daily-drill').innerHTML = ticket({
    href: `/setup?drill=${dailyDrill.id}`,
    eyebrow: t('home_challenge'),
    title: t('home_challengeDesc'),
    iconName: 'calendar',
    highlight: true,
    wide: true,
    headingTag: 'h3',
    rows: [
      [t('drill_duration'), minutesLabel(dailyDrill.seconds, lang)],
      [t('drill_skill'), pick(dailyDrill, 'skill', lang)],
    ],
    cta: t('home_challengeStart'),
  });

  document.getElementById('drill-list').innerHTML = drills
    .map(
      (d) => `<li>${ticket({
        href: `/setup?drill=${d.id}`,
        title: pick(d, 'title', lang),
        iconName: d.icon,
        tint: d.tint,
        rows: [
          [t('drill_duration'), minutesLabel(d.seconds, lang)],
          [t('drill_skill'), pick(d, 'skill', lang)],
          [t('drill_difficulty'), t(`difficulty_${d.difficulty}`)],
        ],
        cta: t('drill_start'),
      })}</li>`,
    )
    .join('');
}

// Remember which card was chosen, in case the host strips the query string.
document.addEventListener('click', (e) => {
  const a = e.target.closest('a[href^="setup.html"]');
  if (!a) return;
  const params = new URL(a.href, location.href).searchParams;
  setIntent({ scenario: params.get('scenario'), drill: params.get('drill') });
});

bootPage(() => {
  renderScenarios();
  renderDrills();
});
