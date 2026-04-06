import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

if (pdfMake && pdfFonts && pdfFonts.pdfMake) {
  pdfMake.vfs = pdfFonts.pdfMake.vfs;
} else if (pdfMake && pdfFonts) {
  pdfMake.vfs = pdfFonts.vfs;
}

export const generateBookPDF = (topic, submissions) => {
  const docDefinition = {
    info: {
      title: `${topic.title} - Compiled Book`,
      author: 'EchoWeave Community',
    },
    content: [
      { text: topic.title, fontSize: 26, bold: true, margin: [0, 0, 0, 10] },
      { text: topic.description, fontSize: 14, margin: [0, 0, 0, 20], color: '#666666' },
      { text: `Compiled On: ${new Date().toLocaleDateString()}`, margin: [0, 0, 0, 5] },
      { text: `Total Submissions: ${submissions.length}`, margin: [0, 0, 0, 5] },
      { text: `Total Words: ${topic.currentWordCount}`, margin: [0, 0, 0, 30] },
    ],
    defaultStyle: {
      fontSize: 12,
      lineHeight: 1.5,
    }
  };

  if (submissions.length === 0) {
    docDefinition.content.push({ text: 'No submissions found for this topic.', italics: true });
  }

  submissions.forEach((sub, index) => {
    const authorName = sub.user && sub.user.name ? sub.user.name : 'Anonymous';
    
    docDefinition.content.push({ 
      text: `Chapter ${index + 1}`, 
      fontSize: 18, 
      bold: true,
      pageBreak: index === 0 ? undefined : 'before',
      margin: [0, 20, 0, 5] 
    });
    
    docDefinition.content.push({ 
      text: `By: ${authorName}`, 
      italics: true, 
      color: '#666666',
      margin: [0, 0, 0, 15] 
    });
    
    docDefinition.content.push({ 
      text: sub.content, 
      alignment: 'justify',
      margin: [0, 0, 0, 20] 
    });
  });

  const fileName = `${topic.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_book.pdf`;
  pdfMake.createPdf(docDefinition).download(fileName);
};
