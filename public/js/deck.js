// PDF slides: read with PDF.js (vendored), render pages onto a canvas.
import * as pdfjsLib from '../vendor/pdf.min.mjs';

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL('../vendor/pdf.worker.min.mjs', import.meta.url).href;

export const MAX_DECK_BYTES = 50 * 1024 * 1024;

export function isPdf(file) {
  return file && (file.type === 'application/pdf' || /\.pdf$/i.test(file.name || ''));
}

/** Open a PDF from a Blob/File. Resolves to a PDFDocumentProxy. */
export async function openPdf(blob) {
  const data = new Uint8Array(await blob.arrayBuffer());
  return pdfjsLib.getDocument({ data, isEvalSupported: false }).promise;
}

/**
 * Render one page so it fits inside maxWidth x maxHeight CSS pixels.
 * Returns the rendered CSS size. Cancels a previous render on the same canvas.
 */
export async function renderPage(doc, pageNumber, canvas, maxWidth, maxHeight = Infinity) {
  const page = await doc.getPage(pageNumber);
  const base = page.getViewport({ scale: 1 });
  const scale = Math.min(maxWidth / base.width, maxHeight / base.height);
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const viewport = page.getViewport({ scale: scale * dpr });

  if (canvas._renderTask) {
    try {
      canvas._renderTask.cancel();
    } catch {
      /* already finished */
    }
  }
  canvas.width = Math.floor(viewport.width);
  canvas.height = Math.floor(viewport.height);
  canvas.style.width = `${Math.floor(viewport.width / dpr)}px`;
  canvas.style.height = `${Math.floor(viewport.height / dpr)}px`;

  const task = page.render({ canvasContext: canvas.getContext('2d'), viewport });
  canvas._renderTask = task;
  try {
    await task.promise;
  } catch (err) {
    if (err?.name !== 'RenderingCancelledException') throw err;
  }
  return { width: viewport.width / dpr, height: viewport.height / dpr };
}

export function formatBytes(bytes) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
