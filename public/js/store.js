// Shared state between pages.
// Config + session meta live in sessionStorage; the recording Blob lives in IndexedDB
// so it survives the page change from the room to the review.
import { defaultConfig } from './data.js';

const CONFIG_KEY = 'prep:config';
const SESSION_KEY = 'prep:session';

function readJSON(storage, key, fallback) {
  try {
    const raw = storage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJSON(storage, key, value) {
  try {
    storage.setItem(key, JSON.stringify(value));
  } catch {
    /* prototype keeps working without storage */
  }
}

export function getConfig() {
  return { ...defaultConfig, ...readJSON(sessionStorage, CONFIG_KEY, {}) };
}

export function saveConfig(config) {
  writeJSON(sessionStorage, CONFIG_KEY, config);
}

export function getSession() {
  return readJSON(sessionStorage, SESSION_KEY, { durationSec: 0, hasRecording: false });
}

export function saveSession(session) {
  writeJSON(sessionStorage, SESSION_KEY, session);
}

/* Entry intent from Home (?scenario= / ?drill=). Also kept in sessionStorage
   because some hosts drop query strings when the page navigates. */
const INTENT_KEY = 'prep:intent';
export function setIntent(intent) {
  writeJSON(sessionStorage, INTENT_KEY, intent);
}
export function takeIntent() {
  const intent = readJSON(sessionStorage, INTENT_KEY, null);
  try {
    sessionStorage.removeItem(INTENT_KEY);
  } catch {
    /* ignore */
  }
  return intent;
}

/* ---------- IndexedDB for the recording ---------- */
const DB_NAME = 'prep';
const STORE = 'recordings';

function openDB() {
  return new Promise((resolve, reject) => {
    if (!('indexedDB' in window)) return reject(new Error('IndexedDB unavailable'));
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function tx(mode, fn) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const t = db.transaction(STORE, mode);
    const result = fn(t.objectStore(STORE));
    t.oncomplete = () => {
      db.close();
      resolve(result && 'result' in result ? result.result : undefined);
    };
    t.onerror = () => {
      db.close();
      reject(t.error);
    };
  });
}

export async function saveRecording(blob) {
  try {
    if (blob) await tx('readwrite', (s) => s.put(blob, 'last'));
    else await tx('readwrite', (s) => s.delete('last'));
    return true;
  } catch {
    return false;
  }
}

export async function loadRecording() {
  try {
    return (await tx('readonly', (s) => s.get('last'))) || null;
  } catch {
    return null;
  }
}

/* Uploaded slide deck (PDF Blob). Stays in this browser only. */
export async function saveDeck(blob) {
  try {
    if (blob) await tx('readwrite', (s) => s.put(blob, 'deck'));
    else await tx('readwrite', (s) => s.delete('deck'));
    return true;
  } catch {
    return false;
  }
}

export async function loadDeck() {
  try {
    return (await tx('readonly', (s) => s.get('deck'))) || null;
  } catch {
    return null;
  }
}

/* Room -> Setup: reopen setup on a given step without resetting the config. */
const RETURN_KEY = 'prep:returnStep';
export function setReturnStep(step) {
  try {
    sessionStorage.setItem(RETURN_KEY, String(step));
  } catch {
    /* ignore */
  }
}
export function takeReturnStep() {
  try {
    const v = sessionStorage.getItem(RETURN_KEY);
    sessionStorage.removeItem(RETURN_KEY);
    return v ? Number(v) : null;
  } catch {
    return null;
  }
}
