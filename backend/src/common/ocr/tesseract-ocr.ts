import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createWorker, OEM, type ImageLike } from 'tesseract.js';

export type TesseractModel = 'default' | '4.0.0_best';

export async function createTesseractWorker(
  model: TesseractModel = 'default',
  languages: string[] = ['spa', 'eng'],
) {
  if (!['default', '4.0.0_best'].includes(model)) {
    throw new Error(`Unsupported Tesseract model: ${model}`);
  }
  const modelDir =
    process.env.OCR_MODEL_DIR ??
    fileURLToPath(new URL('../../../ocr-models/', import.meta.url));

  return createWorker(languages, OEM.LSTM_ONLY, {
    langPath: resolve(modelDir, model),
    gzip: false,
    cacheMethod: 'none',
  });
}

export async function recognizeWithTesseract(
  image: ImageLike,
  model: TesseractModel = 'default',
  languages: string[] = ['spa', 'eng'],
) {
  const worker = await createTesseractWorker(model, languages);
  try {
    const { data } = await worker.recognize(image);
    return { text: data.text, confidence: data.confidence, model };
  } finally {
    await worker.terminate();
  }
}
