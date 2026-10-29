// Human-readable labels for a config, including user-defined (custom) values.
import { t, getLang } from './i18n.js';
import { scenarios, audienceOptions, CUSTOM } from './data.js';

const L = (en, zh, lang) => (lang === 'en' ? en : zh);

export function roomTitle(config, lang = getLang()) {
  if (config.scenario === CUSTOM && config.customScenario.trim()) return config.customScenario.trim();
  const s = scenarios.find((x) => x.id === config.scenario) || scenarios[0];
  return L(s.room[0], s.room[1], lang);
}

export function audienceLabel(config, lang = getLang()) {
  if (config.audience === CUSTOM) {
    const who = config.customAudience.trim();
    const n = Number(config.customAudienceCount) || 0;
    if (who && n) return L(`${n} · ${who}`, `${n} 位 · ${who}`, lang);
    return who || L(`${n} people`, `${n} 位觀眾`, lang);
  }
  const a = audienceOptions.find((x) => x.id === config.audience);
  return a ? L(a.en, a.zh, lang) : '';
}

export function audienceCount(config) {
  if (config.audience === CUSTOM) return Math.max(1, Number(config.customAudienceCount) || 5);
  return audienceOptions.find((x) => x.id === config.audience)?.count || 5;
}

export function languageLabel(config) {
  if (config.practiceLanguage === CUSTOM) return config.customLanguage.trim() || '—';
  return config.practiceLanguage === 'zh' ? '中文' : 'English';
}

export function goalLabel(config, lang = getLang()) {
  if (config.goal === CUSTOM) return config.customGoal.trim() || '—';
  return t(`goal_${config.goal}`, lang);
}

/** Scenario id used for scripted audience reactions (custom rooms use the general set). */
export function reactionScenario(config) {
  return config.scenario === CUSTOM ? 'presentation' : config.scenario;
}
