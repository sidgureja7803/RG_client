import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export const generatePDF = async (content, format) => {
  try {
    // Get the resume preview element
    const element = document.querySelector('.resume-preview');
    if (!element) {
      throw new Error('Resume preview element not found');
    }

    // Create canvas from the element
    const canvas = await html2canvas(element, {
      scale: 2, // Higher scale for better quality
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    });

    // Calculate dimensions
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    // Create PDF
    const pdf = new jsPDF('p', 'mm', 'a4');
    let currentPage = 1;

    // Add pages if content overflows
    while (heightLeft >= 0) {
      if (currentPage > 1) {
        pdf.addPage();
      }

      pdf.addImage(
        canvas,
        'PNG',
        0,
        position,
        imgWidth,
        imgHeight,
        '',
        'FAST'
      );

      heightLeft -= pageHeight;
      position -= pageHeight;
      currentPage++;
    }

    // Add metadata
    pdf.setProperties({
      title: 'Resume',
      subject: 'Resume generated with ResumeForge',
      creator: 'ResumeForge',
      author: 'ResumeForge User'
    });

    return pdf.output('blob');
  } catch (error) {
    console.error('PDF generation error:', error);
    throw new Error('Failed to generate PDF');
  }
}; 