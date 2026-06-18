import { Document, Packer, Paragraph, TextRun, AlignmentType, convertInchesToTwip } from 'docx';

export async function generateCoverLetterDocx(content: string, company: string, role: string): Promise<Blob> {
  // Pisahkan teks berdasarkan newline menjadi paragraf
  const paragraphs = content.split('\n').filter(p => p.trim().length > 0);

  const doc = new Document({
    sections: [{
      properties: {
        page: {
          margin: {
            top: convertInchesToTwip(1),
            bottom: convertInchesToTwip(1),
            left: convertInchesToTwip(1),
            right: convertInchesToTwip(1),
          },
        },
      },
      children: [
        // JUDUL SURAT
        new Paragraph({
          children: [
            new TextRun({
              text: 'SURAT LAMARAN KERJA',
              bold: true,
              size: 28, // 14pt
              font: 'Times New Roman',
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
        }),
        // TANGGAL
        new Paragraph({
          children: [
            new TextRun({
              text: `Jakarta, ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`,
              size: 22,
              font: 'Times New Roman',
            }),
          ],
          alignment: AlignmentType.RIGHT,
          spacing: { after: 200 },
        }),
        // PERIHAL
        new Paragraph({
          children: [
            new TextRun({
              text: `Perihal: Lamaran Pekerjaan - ${role}`,
              bold: true,
              size: 22,
              font: 'Times New Roman',
            }),
          ],
          spacing: { after: 200 },
        }),
        // ISI SURAT (dari AI)
        ...paragraphs.map(text => new Paragraph({
          children: [
            new TextRun({
              text: text,
              size: 22,
              font: 'Times New Roman',
            }),
          ],
          spacing: { after: 120 },
          alignment: AlignmentType.LEFT,
        })),
      ],
    }],
  });

   return await Packer.toBlob(doc);
}