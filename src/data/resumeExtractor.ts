/**
 * Resume Extractor: Real file parser for PDF, DOCX, and TXT files.
 * Uses pdfjs-dist for PDF text extraction and mammoth for DOCX extraction.
 */

import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

// Configure pdfjs worker using standard ESM worker URL
if (typeof window !== 'undefined' && 'Worker' in window) {
  try {
    pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
      'pdfjs-dist/build/pdf.worker.min.mjs',
      import.meta.url
    ).toString();
  } catch {
    // Fallback CDN if bundler URL resolution fails
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
  }
}

export interface ExtractionResult {
  success: boolean;
  text: string;
  fileName: string;
  fileSizeFormatted: string;
  fileType: 'pdf' | 'docx' | 'txt' | 'unknown';
  wordCount: number;
  charCount: number;
  error?: string;
  isImageBased?: boolean;
}

/**
 * Format bytes into human-readable string.
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

/**
 * Extract text from a PDF file using pdfjs-dist.
 */
async function extractTextFromPdf(arrayBuffer: ArrayBuffer): Promise<string> {
  const loadingTask = pdfjsLib.getDocument({
    data: new Uint8Array(arrayBuffer),
    useSystemFonts: true,
  });

  const pdf = await loadingTask.promise;
  const totalPages = pdf.numPages;
  const pageTexts: string[] = [];

  for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();
    
    // Combine text items with spacing preservation
    let lastY: number | null = null;
    let pageString = '';

    for (const item of textContent.items) {
      if ('str' in item) {
        const textItem = item as { str: string; transform: number[] };
        const currentY = textItem.transform ? textItem.transform[5] : null;

        if (lastY !== null && currentY !== null && Math.abs(currentY - lastY) > 5) {
          pageString += '\n';
        } else if (pageString.length > 0 && !pageString.endsWith(' ') && !pageString.endsWith('\n')) {
          pageString += ' ';
        }
        pageString += textItem.str;
        lastY = currentY;
      }
    }

    if (pageString.trim()) {
      pageTexts.push(pageString.trim());
    }
  }

  return pageTexts.join('\n\n');
}

/**
 * Fallback PDF string scanner if canvas/pdfjs worker encounters an issue with a standard PDF stream
 */
function scanPdfBinaryStreams(arrayBuffer: ArrayBuffer): string {
  try {
    const bytes = new Uint8Array(arrayBuffer);
    let binary = '';
    const len = Math.min(bytes.length, 500000);
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    // Extract text in parentheses (PDF literal strings: (Hello World) Tj)
    const matches = binary.match(/\(([^()]{2,150})\)\s*(?:Tj|'|")/g);
    if (matches && matches.length > 10) {
      return matches
        .map((m) => m.replace(/^\(|\)\s*(?:Tj|'|")$/g, ''))
        .filter((t) => t.trim().length > 1)
        .join(' ');
    }
  } catch {
    // Ignore fallback scan error
  }
  return '';
}

/**
 * Extract text from a DOCX file using mammoth.
 */
async function extractTextFromDocx(arrayBuffer: ArrayBuffer): Promise<string> {
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value || '';
}

/**
 * Main file extraction coordinator for uploaded resumes.
 */
export async function extractResumeText(file: File): Promise<ExtractionResult> {
  const fileName = file.name;
  const fileSizeFormatted = formatFileSize(file.size);
  const ext = fileName.split('.').pop()?.toLowerCase() || '';

  // 1. Validation checks
  if (file.size === 0) {
    return {
      success: false,
      text: '',
      fileName,
      fileSizeFormatted,
      fileType: 'unknown',
      wordCount: 0,
      charCount: 0,
      error: 'The uploaded file is empty (0 bytes). Please upload a valid resume.',
    };
  }

  if (file.size > 12 * 1024 * 1024) {
    return {
      success: false,
      text: '',
      fileName,
      fileSizeFormatted,
      fileType: 'unknown',
      wordCount: 0,
      charCount: 0,
      error: 'File size exceeds 12 MB limit. Please upload a standard resume file.',
    };
  }

  let fileType: 'pdf' | 'docx' | 'txt' | 'unknown' = 'unknown';
  if (ext === 'pdf') fileType = 'pdf';
  else if (ext === 'docx' || ext === 'doc') fileType = 'docx';
  else if (ext === 'txt' || ext === 'rtf' || ext === 'md') fileType = 'txt';

  if (fileType === 'unknown') {
    return {
      success: false,
      text: '',
      fileName,
      fileSizeFormatted,
      fileType: 'unknown',
      wordCount: 0,
      charCount: 0,
      error: 'Unsupported file format. Please upload a PDF (.pdf) or Word document (.docx).',
    };
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    let extractedText = '';

    if (fileType === 'pdf') {
      try {
        extractedText = await extractTextFromPdf(arrayBuffer);
      } catch (pdfErr) {
        console.warn('pdfjs extraction warning, trying binary scan fallback:', pdfErr);
        extractedText = scanPdfBinaryStreams(arrayBuffer);
        if (!extractedText.trim()) {
          throw pdfErr;
        }
      }
    } else if (fileType === 'docx') {
      extractedText = await extractTextFromDocx(arrayBuffer);
    } else if (fileType === 'txt') {
      extractedText = await file.text();
    }

    const cleanText = extractedText.replace(/\r\n/g, '\n').trim();
    const wordCount = cleanText.split(/\s+/).filter(Boolean).length;
    const charCount = cleanText.length;

    // 2. Scanned / Image-based PDF detection
    if (charCount < 40 || wordCount < 10) {
      if (fileType === 'pdf') {
        return {
          success: false,
          text: '',
          fileName,
          fileSizeFormatted,
          fileType,
          wordCount,
          charCount,
          isImageBased: true,
          error:
            'This resume appears to be image-based or scanned without a selectable text layer. Please upload a searchable text-based PDF or DOCX file.',
        };
      }
      return {
        success: false,
        text: '',
        fileName,
        fileSizeFormatted,
        fileType,
        wordCount,
        charCount,
        error:
          'Could not extract sufficient text from this document. Please ensure the file contains searchable text.',
      };
    }

    return {
      success: true,
      text: cleanText,
      fileName,
      fileSizeFormatted,
      fileType,
      wordCount,
      charCount,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown parsing error';
    return {
      success: false,
      text: '',
      fileName,
      fileSizeFormatted,
      fileType,
      wordCount: 0,
      charCount: 0,
      error: `Unable to read this file (${errorMsg}). Please upload a valid PDF or DOCX.`,
    };
  }
}
