// services/aiService.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import mammoth from 'mammoth';
import * as pdfjsLib from 'pdfjs-dist';

// Set worker source (penting untuk browser)
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

/**
 * Ekstrak teks dari PDF menggunakan pdfjs-dist
 */
async function extractPDFText(arrayBuffer: ArrayBuffer): Promise<string> {
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let fullText = '';
  
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map((item: any) => item.str).join(' ');
    fullText += pageText + '\n';
  }
  
  return fullText.trim();
}

// ============================================
// 1. INISIALISASI GEMINI
// ============================================

const genAI = new GoogleGenerativeAI(
  import.meta.env.VITE_GEMINI_API_KEY
);

const model = genAI.getGenerativeModel({ 
  model: "gemini-2.5-flash",
  generationConfig: {
    temperature: 0.3,
    maxOutputTokens: 10000,
  },
});

// ============================================
// 2. EKSTRAK TEKS DARI FILE (PDF, DOCX, TXT)
// ============================================

export async function extractTextFromFile(file: File): Promise<string> {
  const fileType = file.type;
  const arrayBuffer = await file.arrayBuffer();

  if (fileType === 'application/pdf') {
    return await extractPDFText(arrayBuffer); // ✅ PAKE INI
  } else if (
    fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  } else if (fileType === 'text/plain') {
    return new TextDecoder().decode(arrayBuffer);
  } else {
    throw new Error('Format file tidak didukung. Gunakan PDF, Word, atau TXT.');
  }
}

// ============================================
// 3. GENERATE COVER LETTER
// ============================================

export async function generateCoverLetter(params: {
  company: string;
  role: string;
  skills?: string;
}): Promise<string> {
  const prompt = `
Buatkan surat lamaran kerja (cover letter) dalam bahasa Indonesia yang profesional untuk:

- Posisi: ${params.role}
- Perusahaan: ${params.company}
${params.skills ? `- Keahlian utama: ${params.skills}` : ''}

Surat harus:
1. Format surat formal (ada pembuka, isi, penutup)
2. Menunjukkan antusiasme dan kesesuaian kandidat
3. Menonjolkan keahlian yang relevan
4. Panjang sekitar 200-300 kata
5. Ditutup dengan harapan untuk wawancara
`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  
  return text || "Gagal generate surat.";
}

// ============================================
// 4. SCAN CV / RESUME - VERSION SUPER ROBUST
// ============================================

export async function scanResume(fileContent: string): Promise<{
  score: number;
  feedback: string[];
}> {
  const prompt = `
Analisis CV berikut untuk ATS (Applicant Tracking System).

Berikan output dalam format JSON SAJA, tanpa teks lain di luar JSON.

Format JSON yang diminta:
{
  "score": number (0-100),
  "feedback": [
    "saran perbaikan 1",
    "saran perbaikan 2",
    "saran perbaikan 3",
    "saran perbaikan 4",
    "saran perbaikan 5"
  ]
}

CV Content:
${fileContent}
`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  let text = response.text();

  console.log('Raw AI Response (length:', text.length, '):', text);

  // ==========================================
  // STRATEGI 1: COBA PARSE JSON LENGKAP
  // ==========================================
  try {
    let cleanText = text.trim();
    // 1. Hapus markdown code fences
    cleanText = cleanText.replace(/```json\s*/g, '').replace(/```\s*/g, '');
    
    // 2. Hapus trailing comma sebelum } atau ]
    cleanText = cleanText.replace(/,\s*}/g, '}');
    cleanText = cleanText.replace(/,\s*\]/g, ']');

    // 3. Escape double quotes di dalam string (yang belum di-escape)
    // Cari semua string yang diapit " ... " dan escape semua " di dalamnya
    cleanText = cleanText.replace(/(?<=: )"(?:(?!")(?:\\.|[^"\\]))*"/g, (match) => {
      // Biarkan saja, seharusnya sudah aman
      return match;
    });

    const parsed = JSON.parse(cleanText);
    if (typeof parsed.score === 'number' && Array.isArray(parsed.feedback)) {
      return {
        score: parsed.score,
        feedback: parsed.feedback.slice(0, 5),
      };
    } else {
      throw new Error('Invalid JSON structure');
    }
  } catch (jsonError) {
    console.warn('JSON parsing failed, using regex fallback:', jsonError);
  }

  // ==========================================
  // STRATEGI 2: FALLBACK - EKSTRAK DENGAN REGEX (PASTI BISA)
  // ==========================================
  
  // Ambil skor
  const scoreMatch = text.match(/score[:\s]*(\d+)/i);
  const score = scoreMatch ? parseInt(scoreMatch[1]) : 70;

  // Ambil feedback dari JSON array secara manual
  let feedback: string[] = [];
  
  // Cari array feedback dalam teks
  const feedbackArrayMatch = text.match(/"feedback"\s*:\s*\[([\s\S]*?)\](?=\s*\})/);
  if (feedbackArrayMatch) {
    const feedbackRaw = feedbackArrayMatch[1];
    // Ekstrak setiap string yang diapit kutip ganda
    const stringMatches = feedbackRaw.match(/"([^"\\]*(?:\\.[^"\\]*)*)"/g);
    if (stringMatches) {
      feedback = stringMatches.map(s => {
        // Hapus kutip di awal & akhir, dan unescape karakter
        let cleaned = s.slice(1, -1);
        cleaned = cleaned.replace(/\\"/g, '"').replace(/\\n/g, '\n');
        return cleaned.trim();
      });
    }
  }

  // Kalo masih kosong, coba ekstrak dari bullet points
  if (feedback.length === 0) {
    const bulletMatches = text.match(/[•\-*]\s*([^\n]+)/g);
    if (bulletMatches) {
      feedback = bulletMatches.map(s => s.replace(/^[•\-*]\s*/, '').trim()).slice(0, 5);
    }
  }

  // Kalo tetep kosong, kasih default
  if (feedback.length === 0) {
    feedback = [
      'Tidak ada saran yang dapat diekstrak. Pastikan CV memiliki format yang jelas.',
      'Coba periksa kembali struktur CV Anda.',
      'Gunakan kata kunci yang relevan dengan posisi yang dilamar.'
    ];
  }

  // Potong maksimal 5
  if (feedback.length > 5) {
    feedback = feedback.slice(0, 5);
  }

  return { score, feedback };
}