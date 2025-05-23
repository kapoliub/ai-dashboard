// src/utils/parseFile.ts
import pdfParse from 'pdf-parse';            // ✅ імпорт без зірочки
import mammoth from 'mammoth';

export const parseTxt = async (buffer: Buffer) => buffer.toString('utf-8');

export const parsePdf = async (buffer: Buffer) => {
  const data = await pdfParse(buffer);       // ✅ тільки ця функція
  return data.text;
};

export const parseDocx = async (buffer: Buffer) => {
  const result = await mammoth.extractRawText({ buffer });
  return result.value;
};
