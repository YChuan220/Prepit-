// Mock data ported from the original prototype (src/mockData.ts). Everything here is simulated.

export const scenarios = [
  { id: 'presentation', key: 'scenario_presentation', icon: 'presentation', tint: 'bg-mint', room: ['Presentation Room', '簡報演練室'] },
  { id: 'interview', key: 'scenario_interview', icon: 'user-check', tint: 'bg-pink', room: ['Interview Room', '面試室'] },
  { id: 'meeting', key: 'scenario_meeting', icon: 'users', tint: 'bg-amber', room: ['Team Meeting Room', '團隊會議室'] },
  { id: 'pitch', key: 'scenario_pitch', icon: 'rocket', tint: 'bg-selection', room: ['Investor Pitch Room', '投資人 Pitch 會議室'] },
  { id: 'thesis', key: 'scenario_thesis', icon: 'graduation-cap', tint: 'bg-mint', room: ['Thesis Defense', '論文口試現場'] },
  { id: 'sales', key: 'scenario_sales', icon: 'trending-up', tint: 'bg-pink', room: ['Business Review', '業務成長報告'] },
];

export const audienceOptions = [
  { id: '5interviewers', en: '5 interviewers', zh: '5 位面試官', count: 5 },
  { id: '10team', en: '10 team members', zh: '10 位團隊成員', count: 10 },
  { id: '30students', en: '30 university students', zh: '30 位大學生', count: 30 },
  { id: '50clients', en: '50 clients', zh: '50 位客戶', count: 50 },
  { id: '100auditorium', en: '100-person auditorium', zh: '100 人演講廳', count: 100 },
  { id: '5investors', en: '5 startup investors', zh: '5 位創投投資人', count: 5 },
];

// 2 min added so drill presets (120 s) map to a visible choice.
export const timeOptions = [60, 120, 180, 300, 600];

export const goalOptions = ['explain', 'persuade', 'approval', 'questions', 'research', 'sell'];

export const modes = [
  { id: 'full', key: 'setup_mode_full', descKey: 'setup_mode_fullDesc', icon: 'video' },
  { id: 'skill', key: 'setup_mode_skill', descKey: 'setup_mode_skillDesc', icon: 'target' },
  { id: 'qa', key: 'setup_mode_qa', descKey: 'setup_mode_qaDesc', icon: 'message-square' },
];

export const defaultConfig = {
  scenario: 'pitch',
  audience: '5investors',
  audienceDescription: '',
  practiceLanguage: 'en',
  timeLimit: 180,
  goal: 'persuade',
  mode: 'full',
  materials: [],
  script: '',
  speakerNotes: '',
  keyMessages: '',
  expectedQuestions: '',
  challengeId: null,
};

export const drills = [
  { id: 'eye', title: '眼神接觸挑戰', titleEn: 'Eye Contact Challenge', seconds: 120, skill: '眼神接觸', skillEn: 'Eye Contact', difficulty: 'Beginner', icon: 'eye', tint: 'bg-mint' },
  { id: 'body', title: '肢體語言挑戰', titleEn: 'Body Language Challenge', seconds: 180, skill: '肢體語言', skillEn: 'Body Language', difficulty: 'Intermediate', icon: 'person-standing', tint: 'bg-amber' },
  { id: 'pitch60', title: '60 秒提案', titleEn: '60-Second Pitch', seconds: 60, skill: '簡潔表達', skillEn: 'Conciseness', difficulty: 'Advanced', icon: 'timer', tint: 'bg-pink' },
  { id: 'nofiller', title: '無贅詞挑戰', titleEn: 'No Filler Challenge', seconds: 120, skill: '語速控制', skillEn: 'Pacing', difficulty: 'Intermediate', icon: 'audio-lines', tint: 'bg-selection' },
  { id: 'simple', title: '簡單解釋', titleEn: 'Explain It Simply', seconds: 120, skill: '訊息清晰度', skillEn: 'Clarity', difficulty: 'Beginner', icon: 'lightbulb', tint: 'bg-amber' },
  { id: 'question', title: '應對提問', titleEn: 'Handle the Question', seconds: 60, skill: '問答應對', skillEn: 'Q&A', difficulty: 'Advanced', icon: 'message-circle-question', tint: 'bg-mint' },
];

export const dailyDrill = { id: 'daily60', title: '今日挑戰', titleEn: "Today's Challenge", seconds: 60, skill: '清楚說明', skillEn: 'Explain clearly' };

/** Same presets the original App.tsx applied for each drill entry point. */
export function drillPreset(id) {
  if (id === 'daily60') return { mode: 'skill', challengeId: 'daily60', timeLimit: 60, goal: 'explain' };
  const d = drills.find((x) => x.id === id);
  if (!d) return null;
  return {
    mode: id === 'question' ? 'qa' : 'skill',
    challengeId: id,
    timeLimit: d.seconds,
    goal: id === 'question' ? 'questions' : id === 'convince' ? 'persuade' : 'explain',
  };
}

export function scenarioPreset(id) {
  const s = scenarios.find((x) => x.id === id);
  if (!s) return null;
  const preset = { scenario: id, mode: 'full', challengeId: null };
  if (id === 'pitch') preset.audience = '5investors';
  if (id === 'interview') preset.audience = '5interviewers';
  return preset;
}

export const reactionCopy = {
  neutral: { en: 'Neutral', zh: '中立' },
  nodding: { en: 'Nodding', zh: '點頭' },
  smiling: { en: 'Smiling', zh: '微笑' },
  confused: { en: 'Confused', zh: '困惑' },
  checking_phone: { en: 'Checking phone', zh: '看手機' },
  taking_notes: { en: 'Taking notes', zh: '做筆記' },
  looking_away: { en: 'Looking away', zh: '看向別處' },
  raising_hand: { en: 'Raising hand', zh: '舉手' },
  distracted: { en: 'Distracted', zh: '分心' },
  interested: { en: 'Interested', zh: '感興趣' },
};

export function getReactionEvents(scenarioId) {
  if (scenarioId === 'pitch') {
    return [
      { time: 8, avatarIndex: 0, reaction: 'taking_notes' },
      { time: 15, avatarIndex: 1, reaction: 'nodding' },
      { time: 22, avatarIndex: 2, reaction: 'confused', message: 'An investor looked skeptical', messageZh: '一位投資人看起來有些懷疑' },
      { time: 30, avatarIndex: 0, reaction: 'nodding' },
      { time: 38, avatarIndex: 1, reaction: 'taking_notes' },
      { time: 45, avatarIndex: 2, reaction: 'raising_hand', question: 'How is this different from existing presentation coaching tools?', questionZh: '這跟現有的簡報教練工具有什麼不同？' },
      { time: 55, avatarIndex: 0, reaction: 'interested' },
      { time: 65, avatarIndex: 1, reaction: 'smiling' },
      { time: 75, avatarIndex: 2, reaction: 'nodding' },
      { time: 85, avatarIndex: 0, reaction: 'taking_notes' },
      { time: 95, avatarIndex: 1, reaction: 'raising_hand', question: "What's your revenue model?", questionZh: '你的營收模式是什麼？' },
    ];
  }
  return [
    { time: 5, avatarIndex: 0, reaction: 'nodding' },
    { time: 12, avatarIndex: 1, reaction: 'smiling' },
    { time: 20, avatarIndex: 2, reaction: 'checking_phone', message: 'Someone checked their phone', messageZh: '有人在看手機' },
    { time: 28, avatarIndex: 0, reaction: 'taking_notes' },
    { time: 35, avatarIndex: 1, reaction: 'nodding' },
    { time: 35, avatarIndex: 3, reaction: 'nodding' },
    { time: 42, avatarIndex: 2, reaction: 'confused' },
    { time: 50, avatarIndex: 0, reaction: 'raising_hand', question: 'How is this different from existing presentation coaching tools?', questionZh: '這跟現有的簡報教練工具有什麼不同？' },
    { time: 58, avatarIndex: 1, reaction: 'interested' },
    { time: 68, avatarIndex: 3, reaction: 'distracted' },
    { time: 75, avatarIndex: 2, reaction: 'looking_away' },
    { time: 85, avatarIndex: 0, reaction: 'smiling' },
    { time: 90, avatarIndex: 1, reaction: 'taking_notes' },
    { time: 100, avatarIndex: 3, reaction: 'interested' },
  ];
}

export const analysisSteps = [
  { key: 'complete_speech', icon: 'audio-lines' },
  { key: 'complete_eye', icon: 'eye' },
  { key: 'complete_body', icon: 'person-standing' },
  { key: 'complete_clarity', icon: 'lightbulb' },
  { key: 'complete_understanding', icon: 'users' },
  { key: 'complete_questions', icon: 'message-circle-question' },
];

export const categoryScores = [
  { category: '表達', categoryEn: 'Delivery', score: 74 },
  { category: '眼神接觸', categoryEn: 'Eye Contact', score: 68 },
  { category: '肢體語言', categoryEn: 'Body Language', score: 81 },
  { category: '訊息清晰度', categoryEn: 'Message Clarity', score: 76 },
  { category: '觀眾理解度', categoryEn: 'Audience Understanding', score: 72 },
];

export const feedbackMarkers = [
  {
    id: 'm1', timestamp: 34, tone: 'warning',
    category: '眼神接觸', categoryEn: 'Eye Contact',
    title: '眼神接觸下降', titleEn: 'Eye Contact Dropped',
    whatHappened: '你在投影片上停留了約 12 秒，沒有看觀眾。',
    whatHappenedEn: 'You stayed on your slides for about 12 seconds without looking at the audience.',
    whyItMatters: '觀眾注意力開始分散，一人開始看手機。',
    whyItMattersEn: 'Audience attention started to drift — one person checked their phone.',
    tryNextTime: '每講完一個重點，抬頭看觀眾至少 3 秒。',
    tryNextTimeEn: 'After each key point, look up at the audience for at least 3 seconds.',
  },
  {
    id: 'm2', timestamp: 72, tone: 'positive',
    category: '表達', categoryEn: 'Delivery',
    title: '解釋清楚', titleEn: 'Strong Explanation',
    whatHappened: '你用簡單的比喻解釋了核心概念，兩位投資人點頭。',
    whatHappenedEn: 'You used a simple analogy to explain the core concept — two investors nodded.',
    whyItMatters: '這是觀眾理解度最高的段落。',
    whyItMattersEn: 'This was the segment with the highest audience understanding.',
    tryNextTime: '在開場也用同樣的比喻建立共同理解。',
    tryNextTimeEn: 'Use the same analogy in your opening to build shared understanding early.',
  },
  {
    id: 'm3', timestamp: 134, tone: 'critical',
    category: '訊息清晰度', categoryEn: 'Message Clarity',
    title: '關鍵訊息流失', titleEn: 'Key Message Lost',
    whatHappened: '你的解釋在觀眾理解主結論之前變得太過詳細。',
    whatHappenedEn: 'Your explanation became too detailed before the audience understood the main conclusion.',
    whyItMatters: '關鍵重點變得難以辨識。',
    whyItMattersEn: 'The key takeaway became harder to identify.',
    tryNextTime: '先說結論，再解釋支持細節。',
    tryNextTimeEn: 'State the conclusion first, then explain the supporting details.',
  },
  {
    id: 'm4', timestamp: 185, tone: 'positive',
    category: '觀眾互動', categoryEn: 'Audience Engagement',
    title: '良好的觀眾互動', titleEn: 'Good Audience Engagement',
    whatHappened: '你回答問題時直接看著提問者，並延伸到其他觀眾。',
    whatHappenedEn: 'When answering a question, you looked directly at the asker and extended to the rest of the audience.',
    whyItMatters: '觀眾重新投入，兩人開始做筆記。',
    whyItMattersEn: 'The audience re-engaged — two people started taking notes.',
    tryNextTime: '在每個段落結束時主動問「到目前為止有問題嗎？」',
    tryNextTimeEn: 'Proactively ask “Any questions so far?” at the end of each section.',
  },
];

export const audienceUnderstanding = {
  understandingScore: 72,
  mainIdea: 'Prep! 幫助使用者排練重要的溝通情境。',
  mainIdeaEn: 'Prep! helps users rehearse important communication situations.',
  whatTheyRemembered: '模擬的小型會議。',
  whatTheyRememberedEn: 'The simulated Mini Meeting.',
  whatTheyMissed: '真實聽眾回饋如何運作。',
  whatTheyMissedEn: 'How real listener feedback works.',
  whatConfusedThem: '觀眾理解度如何被衡量。',
  whatConfusedThemEn: 'How audience understanding is measured.',
  questions: ['誰是你的第一批目標使用者？', 'Prep! 有什麼不同？', '真實聽眾如何加入？'],
  questionsEn: ['Who is your first target user?', 'What makes Prep! different?', 'How do real listeners join?'],
};

export const prepNote = {
  remember: ['先說結論。', '在商業模式段落放慢速度。', '在最後的 CTA 做直接眼神接觸。'],
  rememberEn: ['Lead with your conclusion.', 'Slow down during the business model section.', 'Make direct eye contact during the final CTA.'],
  avoid: ['直接照著投影片念。', '趕著講結論。'],
  avoidEn: ['Reading directly from slides.', 'Rushing the conclusion.'],
  questionsToPrepare: ['為什麼是現在？', '誰付費？', '你的方案有什麼不同？'],
  questionsToPrepareEn: ['Why now?', 'Who pays?', 'What makes your solution different?'],
  keyMessage: 'Prep! 將演講練習變成真實的溝通排練。',
  keyMessageEn: 'Prep! turns speaking practice into realistic communication rehearsal.',
};

export function roomSubtitle(scenario, audienceLabel, lang) {
  if (lang === 'zh') {
    if (scenario === 'pitch') return `面對 ${audienceLabel || '投資人'}，練習說服與即時問答。`;
    if (scenario === 'interview') return `面對 ${audienceLabel || '面試官'}，練習臨場回答與表達。`;
    if (scenario === 'thesis') return '模擬研究發表、追問與口試壓力。';
    return `模擬 ${audienceLabel || '真實觀眾'} 的注意力、反應與提問。`;
  }
  if (scenario === 'pitch') return `Pitch to ${audienceLabel || 'investors'} with realistic attention and Q&A.`;
  if (scenario === 'interview') return `Respond to ${audienceLabel || 'interviewers'} under realistic pressure.`;
  if (scenario === 'thesis') return 'Rehearse research explanation, follow-ups, and defense pressure.';
  return `Practice with ${audienceLabel || 'a realistic audience'} that reacts while you speak.`;
}
