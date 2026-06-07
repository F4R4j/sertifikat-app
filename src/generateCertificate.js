import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

const TEMPLATE_URL = `${import.meta.env.BASE_URL}template/certificate-template.pdf`;
const GOLD = rgb(0.55, 0.47, 0.27);

// Coordinates measured against the blank line on the template (PDF points,
// origin at bottom-left). The page is 842.16 x 595.44.
const PAGE_CENTER_X = 842.16 / 2;
const NAME_BASELINE_Y = 300;
const FONT_SIZE = 24;

export async function generateCertificate(name) {
  const templateBytes = await fetch(TEMPLATE_URL).then((res) => {
    if (!res.ok) throw new Error('Gagal memuat template sertifikat');
    return res.arrayBuffer();
  });

  const pdfDoc = await PDFDocument.load(templateBytes);
  const page = pdfDoc.getPages()[0];
  const font = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

  const trimmedName = name.trim().toUpperCase();
  const textWidth = font.widthOfTextAtSize(trimmedName, FONT_SIZE);

  page.drawText(trimmedName, {
    x: PAGE_CENTER_X - textWidth / 2,
    y: NAME_BASELINE_Y,
    size: FONT_SIZE,
    font,
    color: GOLD,
  });

  return pdfDoc.save();
}

export function downloadPdf(bytes, filename) {
  const blob = new Blob([bytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
