// Copy ported from the original React prototype (src/i18n.ts), plus keys for the simplified sitemap.
const dict = {
  appName: { en: 'Prep!', zh: 'Prep!' },
  tagline: { en: 'Practice Before It Matters.', zh: '練習，在關鍵時刻之前。' },
  nav_home: { en: 'Home', zh: '首頁' },
  nav_start: { en: 'Start Practicing', zh: '開始練習' },
  nav_lang: { en: 'Switch language to Chinese', zh: '切換為英文' },
  skip: { en: 'Skip to content', zh: '跳到主要內容' },

  // Home
  home_headline: { en: 'From preparation to presentation.', zh: 'From preparation to presentation.' },
  home_subheadline: {
    en: 'Practice the interaction, not just the speech. Rehearse with a simulated audience that reacts in real time.',
    zh: '練習互動，而不只是演講。與模擬觀眾一起排練，即時反應。',
  },
  home_browseDrills: { en: 'Browse quick drills', zh: '看看快速練習' },
  home_scenarios: { en: 'Choose your scenario', zh: '選擇你的情境' },
  home_scenariosTab: { en: 'Scenarios', zh: '情境' },
  home_scenariosLead: {
    en: 'Pick the room you are preparing for. Setup opens with it already selected.',
    zh: '選擇你要準備的場合，進入設定時會自動帶入。',
  },
  home_challenge: { en: "Today's Challenge", zh: '今日挑戰' },
  home_challengeDesc: { en: 'Explain your day in 60 seconds.', zh: '用 60 秒解釋你的一天。' },
  home_challengeStart: { en: 'Try it', zh: '試試看' },
  home_drills: { en: 'Quick drills', zh: '快速練習' },
  home_drillsLead: { en: 'Quick, focused exercises to sharpen specific skills.', zh: '快速、專注的練習，提升特定技能。' },
  home_how: { en: 'How a session works', zh: '一次練習的流程' },
  home_step1: { en: 'Set the room', zh: '設定場景' },
  home_step1Desc: { en: 'Scenario, audience, materials and focus, in three short steps.', zh: '情境、觀眾、素材與練習重點，三個步驟完成。' },
  home_step2: { en: 'Rehearse live', zh: '即時排練' },
  home_step2Desc: { en: 'Speak to a simulated room while your camera records you.', zh: '對著模擬觀眾說話，同時錄下你的表現。' },
  home_step3: { en: 'Review and prep', zh: '回顧與準備' },
  home_step3Desc: { en: 'Replay the moments that mattered and leave with a prep note.', zh: '回看關鍵時刻，帶走一張上場前小卡。' },
  home_fact1: { en: 'scenarios', zh: '種情境' },
  home_fact2: { en: 'quick drills', zh: '個快速練習' },
  home_fact3: { en: 'languages', zh: '種練習語言' },
  home_fact4: { en: 'Replay', zh: '錄影回放' },
  home_fact4Desc: { en: 'of your own recording', zh: '回看自己的錄影' },
  home_closing: { en: 'Practice before it matters.', zh: '在關鍵時刻之前，先練一次。' },
  footer_pages: { en: 'Pages', zh: '頁面' },
  footer_prototype: { en: 'Prototype', zh: 'Prototype' },
  footer_prototypeDesc: {
    en: 'AI scoring, audience reactions and prep notes are simulated. Your recording stays in this browser.',
    zh: 'AI 評分、觀眾反應與備忘卡目前為模擬資料；錄影只存在這個瀏覽器裡。',
  },

  // Scenarios
  scenario_presentation: { en: 'Presentation', zh: '簡報' },
  scenario_meeting: { en: 'Meeting', zh: '會議' },
  scenario_pitch: { en: 'Pitch', zh: '提案' },
  scenario_interview: { en: 'Interview', zh: '面試' },
  scenario_thesis: { en: 'Thesis Defense', zh: '論文答辯' },
  scenario_sales: { en: 'Sales Report', zh: '銷售報告' },

  // Setup
  setup_title: { en: 'Build Your Practice Room', zh: '打造你的練習空間' },
  setup_step: { en: 'Step', zh: '步驟' },
  setup_of: { en: 'of', zh: '/' },
  setup_step1: { en: 'Who and where', zh: '場合與觀眾' },
  setup_step2: { en: 'Materials', zh: '素材' },
  setup_step3: { en: 'Focus and time', zh: '重點與時間' },
  setup_optional: { en: 'Optional', zh: '可略過' },
  setup_scenario: { en: 'Scenario', zh: '情境' },
  setup_audience: { en: 'Audience', zh: '觀眾' },
  setup_audienceDesc: { en: 'Audience Description', zh: '觀眾描述' },
  setup_audienceDescPh: { en: 'e.g. 30 university students who know little about AI', zh: '例如：30 位對 AI 了解不多的大學生' },
  setup_practiceLang: { en: 'Practice Language', zh: '練習語言' },
  setup_timeLimit: { en: 'Time Limit', zh: '時間限制' },
  setup_goal: { en: 'Practice Goal', zh: '練習目標' },
  setup_materials: { en: 'Materials', zh: '素材' },
  setup_materialsLead: {
    en: 'Add what you will present with. You can skip this and practice from memory.',
    zh: '加入你上台會用到的素材；也可以略過，直接練習。',
  },
  setup_mode: { en: 'Practice Mode', zh: '練習模式' },
  setup_enter: { en: 'Enter Practice Room', zh: '進入練習空間' },
  setup_mode_full: { en: 'Full Rehearsal', zh: '完整排練' },
  setup_mode_fullDesc: { en: 'Practice your full session from start to finish', zh: '從頭到尾完整練習' },
  setup_mode_skill: { en: 'Skill Challenge', zh: '技能挑戰' },
  setup_mode_skillDesc: { en: 'Focus on one specific skill', zh: '專注於單一技能' },
  setup_mode_qa: { en: 'Q&A Practice', zh: '問答練習' },
  setup_mode_qaDesc: { en: 'Practice handling audience questions', zh: '練習應對觀眾提問' },
  setup_uploadHint: { en: 'PPT, PPTX, PDF, DOC, or images', zh: 'PPT、PPTX、PDF、DOC 或圖片' },
  setup_uploadNote: { en: 'Prototype note: file upload is simulated for now.', zh: 'Prototype 提醒：目前檔案上傳為模擬功能。' },
  setup_pasteScript: { en: 'Paste script', zh: '貼上講稿' },
  setup_speakerNotes: { en: 'Speaker notes', zh: '演講備註' },
  setup_keyMessages: { en: 'Key messages', zh: '關鍵訊息' },
  setup_expectedQuestions: { en: 'Expected questions', zh: '預期問題' },
  setup_dropHere: { en: 'Add a file', zh: '加入檔案' },
  setup_removeFile: { en: 'Remove', zh: '移除' },
  setup_skip: { en: 'Skip this step', zh: '略過這一步' },
  setup_drill: { en: 'Quick drill', zh: '快速練習' },
  setup_clearDrill: { en: 'Switch to full rehearsal', zh: '改成完整排練' },

  // Goals
  goal_explain: { en: 'Explain clearly', zh: '清楚說明' },
  goal_persuade: { en: 'Persuade', zh: '說服' },
  goal_approval: { en: 'Get approval', zh: '獲得認可' },
  goal_questions: { en: 'Answer questions', zh: '回答問題' },
  goal_research: { en: 'Present research', zh: '發表研究' },
  goal_sell: { en: 'Sell an idea', zh: '推銷想法' },

  // Practice Room
  room_start: { en: 'Start', zh: '開始' },
  room_enableFirst: { en: 'Enable camera first', zh: '先開啟相機' },
  room_pause: { en: 'Pause', zh: '暫停' },
  room_resume: { en: 'Resume', zh: '繼續' },
  room_end: { en: 'End Session', zh: '結束練習' },
  room_camera: { en: 'Camera', zh: '攝影機' },
  room_mic: { en: 'Microphone', zh: '麥克風' },
  room_audience: { en: 'Audience', zh: '觀眾' },
  room_scenario: { en: 'Scenario', zh: '情境' },
  room_goal: { en: 'Goal', zh: '目標' },
  room_language: { en: 'Language', zh: '語言' },
  room_recording: { en: 'Recording', zh: '錄影中' },
  room_paused: { en: 'Paused', zh: '已暫停' },
  room_question: { en: 'An audience member has a question.', zh: '一位觀眾有問題。' },
  room_takeQuestion: { en: 'Take Question', zh: '回答問題' },
  room_later: { en: 'Later', zh: '稍後' },
  room_enableCamera: { en: 'Enable Camera', zh: '啟用攝影機' },
  room_cameraHint: { en: 'Click to request camera & microphone access', zh: '點擊以請求攝影機與麥克風權限' },
  room_noCamera: { en: 'No camera — demo mode active', zh: '無攝影機 — 示範模式進行中' },
  room_demoStart: { en: 'Start without camera', zh: '不開相機直接開始' },
  room_simulated: { en: 'Simulated room', zh: '模擬情境' },
  room_yourPresentation: { en: 'Your presentation', zh: '你的簡報' },
  room_keyMessagePh: { en: 'Your key message goes here', zh: '你的核心訊息會顯示在這裡' },
  room_reactsHint: { en: 'Audience reacts automatically while you speak.', zh: '你說話時，觀眾會依情境自動產生反應。' },
  room_selfView: { en: 'You · recording view', zh: '你 · 錄影畫面' },
  room_liveRoom: { en: 'Live room', zh: '即時互動' },
  room_signals: { en: 'Audience signals', zh: '觀眾訊號' },
  room_signalsHint: {
    en: 'Reactions are generated by the scenario. You set the room; Prep! decides how the room reacts.',
    zh: '反應會依情境自動生成。你設定場景，Prep! 決定現場如何反應。',
  },
  room_liveReactions: { en: 'Live reactions', zh: '即時反應' },
  room_listening: { en: 'The room is listening…', zh: '觀眾正在聽…' },
  room_beforeStart: { en: 'Start rehearsal to see audience reactions.', zh: '開始練習後，這裡會出現觀眾反應。' },
  room_ruleTitle: { en: 'Live assistance rule', zh: '即時提示原則' },
  room_rule: {
    en: 'Only urgent, actionable cues appear during practice. Detailed scoring waits until the review.',
    zh: '練習中只顯示需要立刻處理的提示；完整分數與分析留到練習結束後。',
  },
  room_tookQuestion: { en: 'You took an audience question.', zh: '你選擇回答觀眾問題。' },
  room_savedQuestion: { en: 'Question saved for later.', zh: '問題已保留到稍後。' },
  room_member: { en: 'Audience member', zh: '觀眾' },
  room_elapsed: { en: 'Elapsed time', zh: '已經過時間' },

  // Analysis (now the loading state of Review)
  complete_title: { en: 'Great job — let’s review what happened.', zh: '做得好 — 來回顧一下。' },
  complete_analyzing: { en: 'Analyzing your session…', zh: '正在分析你的練習…' },
  complete_speech: { en: 'Speech', zh: '語速' },
  complete_eye: { en: 'Eye Contact', zh: '眼神接觸' },
  complete_body: { en: 'Body Language', zh: '肢體語言' },
  complete_clarity: { en: 'Message Clarity', zh: '訊息清晰度' },
  complete_understanding: { en: 'Audience Understanding', zh: '觀眾理解度' },
  complete_questions: { en: 'Questions', zh: '問答' },

  // Review
  review_title: { en: 'Session Review', zh: '練習回顧' },
  review_prototype: {
    en: 'Prototype: AI scores and audience understanding are simulated; your recorded video is real when camera access is enabled.',
    zh: 'Prototype：AI 分數與觀眾理解度目前為模擬資料；若已開啟攝影機，錄影影片則為真實內容。',
  },
  review_replay: { en: 'Replay', zh: '錄影回放' },
  review_noRecording: { en: 'No recording available — demo mode', zh: '無錄影 — 示範模式' },
  review_duration: { en: 'Session duration', zh: '練習時長' },
  review_play: { en: 'Play recording', zh: '播放錄影' },
  review_pauseVideo: { en: 'Pause recording', zh: '暫停錄影' },
  review_summary: { en: 'Session Summary', zh: '練習摘要' },
  review_timeline: { en: 'Timestamped Feedback', zh: '時間軸回饋' },
  review_whatHappened: { en: 'What happened', zh: '發生了什麼' },
  review_whyItMatters: { en: 'Why it matters', zh: '為什麼重要' },
  review_tryNext: { en: 'Try next time', zh: '下次試試' },
  review_pickMarker: { en: 'Choose a feedback marker to see details and replay that moment.', zh: '選擇一個回饋標記，查看細節並回放那個時刻。' },
  review_audienceUnderstanding: { en: 'What did your audience actually get?', zh: '你的觀眾到底理解了什麼？' },
  review_estimated: { en: 'Estimated Message Understanding', zh: '預估訊息理解度' },
  review_aiEstimated: { en: 'AI-estimated understanding', zh: 'AI 預估理解度' },
  review_mainIdea: { en: 'Main idea understood', zh: '理解的主要想法' },
  review_remembered: { en: 'What they remembered', zh: '他們記住的' },
  review_missed: { en: 'What they missed', zh: '他們遺漏的' },
  review_confused: { en: 'What confused them', zh: '讓他們困惑的' },
  review_questionsTitle: { en: 'Questions they would ask', zh: '他們會問的問題' },
  review_disclaimer: {
    en: 'These scores are coaching indicators, not objective measures of communication quality.',
    zh: '這些分數是輔導指標，並非溝通品質的客觀衡量。',
  },
  review_tone_positive: { en: 'Strength', zh: '做得好' },
  review_tone_warning: { en: 'Watch', zh: '留意' },
  review_tone_critical: { en: 'Fix next', zh: '優先修正' },
  review_prepNote: { en: 'View Prep Note', zh: '查看備忘卡' },
  review_retry: { en: 'Retry', zh: '再練一次' },
  review_backHome: { en: 'Back to Home', zh: '返回首頁' },

  // Prep Note
  prep_title: { en: 'Your Prep Note', zh: '你的備忘卡' },
  prep_subtitle: { en: 'Read this right before the real moment.', zh: '在真正上場前閱讀。' },
  prep_prototype: { en: 'Prototype: this cue card is generated from mock coaching data.', zh: 'Prototype：目前此小抄由模擬教練資料生成。' },
  prep_remember: { en: '3 Things to Remember', zh: '3 件要記住的事' },
  prep_avoid: { en: '2 Things to Avoid', zh: '2 件要避免的事' },
  prep_questions: { en: 'Questions to Prepare For', zh: '要準備的問題' },
  prep_keyMessage: { en: 'Key Message', zh: '關鍵訊息' },
  prep_copy: { en: 'Copy Note', zh: '複製備忘卡' },
  prep_save: { en: 'Save', zh: '儲存' },
  prep_copied: { en: 'Copied to clipboard!', zh: '已複製到剪貼簿！' },
  prep_saved: { en: 'Saved!', zh: '已儲存！' },
  prep_done: { en: 'Done', zh: '完成' },
  prep_backReview: { en: 'Back to review', zh: '回到練習回顧' },

  // Drills
  drill_duration: { en: 'Duration', zh: '時長' },
  drill_skill: { en: 'Skill', zh: '技能' },
  drill_difficulty: { en: 'Difficulty', zh: '難度' },
  drill_start: { en: 'Start', zh: '開始' },
  difficulty_Beginner: { en: 'Beginner', zh: '入門' },
  difficulty_Intermediate: { en: 'Intermediate', zh: '中級' },
  difficulty_Advanced: { en: 'Advanced', zh: '進階' },

  common_back: { en: 'Back', zh: '返回' },
  common_next: { en: 'Next', zh: '下一步' },
  common_min: { en: 'min', zh: '分鐘' },
};

const LANG_KEY = 'prep:lang';

export function getLang() {
  try {
    return localStorage.getItem(LANG_KEY) === 'zh' ? 'zh' : 'en';
  } catch {
    return 'en';
  }
}

export function setLang(lang) {
  try {
    localStorage.setItem(LANG_KEY, lang);
  } catch {
    /* storage may be unavailable; the toggle still works for this page view */
  }
  document.documentElement.lang = lang === 'zh' ? 'zh-Hant' : 'en';
  window.dispatchEvent(new CustomEvent('prep:langchange', { detail: { lang } }));
}

export function t(key, lang = getLang()) {
  const entry = dict[key];
  return entry ? entry[lang] : key;
}

/** Pick the language variant from a bilingual record: pick(obj, 'title') -> obj.titleEn or obj.title. */
export function pick(obj, field, lang = getLang()) {
  return lang === 'en' ? obj[`${field}En`] : obj[field];
}
