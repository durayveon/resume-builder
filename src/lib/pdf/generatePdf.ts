import { jsPDF } from 'jspdf';
import { ResumeData } from '@/types/resume';

export async function generatePdf(resumeData: ResumeData): Promise<Blob> {
  // Create a new PDF document
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Set margins
  const margin = 20;
  let y = margin;
  const pageWidth = doc.internal.pageSize.getWidth();
  const contentWidth = pageWidth - 2 * margin;

  // Add title
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text(resumeData.personalInfo.fullName || 'Resume', margin, y);
  y += 10;

  // Add contact information
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const contactInfo = [
    resumeData.personalInfo.email,
    resumeData.personalInfo.phone,
    resumeData.personalInfo.linkedIn ? 'LinkedIn' : '',
    resumeData.personalInfo.portfolio ? 'Portfolio' : '',
  ].filter(Boolean).join(' | ');
  
  doc.text(contactInfo, margin, y);
  y += 10;

  // Add summary
  if (resumeData.summary) {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('SUMMARY', margin, y);
    y += 8;
    
    doc.setFont('helvetica', 'normal');
    const splitSummary = doc.splitTextToSize(resumeData.summary, contentWidth);
    doc.text(splitSummary, margin, y);
    y += splitSummary.length * 6 + 10;
  }

  // Add experience
  if (resumeData.experiences?.length > 0) {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('EXPERIENCE', margin, y);
    y += 8;

    doc.setFont('helvetica', 'normal');
    for (const exp of resumeData.experiences) {
      // Check if we need a new page
      if (y > 250) {
        doc.addPage();
        y = margin;
      }

      // Position and company
      doc.setFont('helvetica', 'bold');
      doc.text(exp.position || '', margin, y);
      
      const companyLineY = y;
      doc.setFont('helvetica', 'normal');
      doc.text(exp.company || '', margin + 100, companyLineY);
      
      // Dates
      const dates = `${exp.startDate} - ${exp.isCurrent ? 'Present' : exp.endDate || 'Present'}`;
      const datesWidth = doc.getTextWidth(dates);
      doc.text(dates, pageWidth - margin - datesWidth, companyLineY);
      y += 5;

      // Responsibilities
      if (exp.responsibilities?.length > 0) {
        doc.setFontSize(10);
        const bullet = '• ';
        const bulletWidth = doc.getTextWidth(bullet);
        
        for (const resp of exp.responsibilities.filter(r => r.trim())) {
          // Check if we need a new page for this responsibility
          if (y > 270) {
            doc.addPage();
            y = margin;
          }
          
          const lines = doc.splitTextToSize(resp, contentWidth - bulletWidth - 2);
          doc.text(bullet, margin, y);
          doc.text(lines, margin + bulletWidth, y);
          y += lines.length * 5 + 2;
        }
        doc.setFontSize(12);
      }
      y += 5;
    }
    y += 5;
  }

  // Add education
  if (resumeData.education?.length > 0) {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('EDUCATION', margin, y);
    y += 8;

    doc.setFont('helvetica', 'normal');
    for (const edu of resumeData.education) {
      if (y > 270) {
        doc.addPage();
        y = margin;
      }

      // Degree and field of study
      doc.setFont('helvetica', 'bold');
      doc.text(edu.degree || '', margin, y);
      
      // Institution and years
      const institutionLine = [
        edu.institution,
        edu.fieldOfStudy ? `, ${edu.fieldOfStudy}` : '',
      ].filter(Boolean).join('');
      
      doc.setFont('helvetica', 'normal');
      doc.text(institutionLine, margin, y + 5);
      
      // Years
      const years = `${edu.startYear} - ${edu.endYear || 'Present'}`;
      const yearsWidth = doc.getTextWidth(years);
      doc.text(years, pageWidth - margin - yearsWidth, y);
      
      y += 12;
    }
    y += 5;
  }

  // Add skills
  if (resumeData.skills?.length > 0) {
    if (y > 250) {
      doc.addPage();
      y = margin;
    }
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('SKILLS', margin, y);
    y += 8;
    
    doc.setFont('helvetica', 'normal');
    const skillsText = resumeData.skills.filter(s => s.trim()).join(' • ');
    const skillLines = doc.splitTextToSize(skillsText, contentWidth);
    doc.text(skillLines, margin, y);
    y += skillLines.length * 6 + 10;
  }

  // Add certifications
  if (resumeData.certifications?.length > 0) {
    if (y > 250) {
      doc.addPage();
      y = margin;
    }
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('CERTIFICATIONS', margin, y);
    y += 8;
    
    doc.setFont('helvetica', 'normal');
    for (const cert of resumeData.certifications.filter(c => c.trim())) {
      if (y > 270) {
        doc.addPage();
        y = margin;
      }
      doc.text('• ' + cert, margin, y);
      y += 7;
    }
  }

  // Generate the PDF blob
  const pdfBlob = doc.output('blob');
  return pdfBlob;
}
