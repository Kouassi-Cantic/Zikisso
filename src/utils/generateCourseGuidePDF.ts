import jsPDF from 'jspdf';
import { DEFAULT_WEEKS } from '../data/defaultWeeks';

export const generateCourseGuidePDF = (): jsPDF => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 18;
  const contentWidth = pageWidth - 2 * margin;

  const colorMarine: [number, number, number] = [31, 78, 121]; // #1F4E79
  const colorVert: [number, number, number] = [26, 107, 60];   // #1A6B3C
  const colorOrange: [number, number, number] = [197, 90, 17];  // #C55A11
  const colorDark: [number, number, number] = [30, 41, 59];    // #1E293B

  let y = 0;
  let pageNum = 1;

  const printFooter = () => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `Fascicule Pédagogique Intégral • MOOC Zikisso — Mairie de Zikisso & Klo-Liké • Page ${pageNum}`,
      pageWidth / 2,
      pageHeight - 9,
      { align: 'center' }
    );
  };

  // --- PAGE DE COUVERTURE ---
  doc.setFillColor(...colorMarine);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Décoration bandeau
  doc.setFillColor(...colorVert);
  doc.rect(0, 0, pageWidth, 12, 'F');

  doc.setFillColor(...colorOrange);
  doc.rect(margin, 50, 4, 35, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(255, 255, 255);
  doc.text("MOOC ZIKISSO", margin + 10, 62);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(13);
  doc.setTextColor(220, 235, 250);
  doc.text("Collectivités Locales & Transformation Digitale", margin + 10, 72);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text("Fascicule Pédagogique Intégral", margin + 10, 95);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(203, 213, 225);
  const introCouv = [
    "Programme complet de formation des acteurs communaux et des citoyens :",
    "• Semaine 1 : Cadre Institutionnel, Acteurs et Décentralisation",
    "• Semaine 2 : Planification Locale et Budgétisation Territoriale",
    "• Semaine 3 : Fiscalité Locale et Mobilisation des Ressources Propres",
    "• Semaine 4 : Modernisation des Services Publics & Administration Numérique",
    "• Module Bonus : Redevabilité, Participation Citoyenne & Cybersécurité"
  ];
  let couvY = 110;
  introCouv.forEach((line) => {
    doc.text(line, margin + 10, couvY);
    couvY += 7;
  });

  // Cartouche officiel bas de page
  doc.setFillColor(15, 44, 71);
  doc.roundedRect(margin, pageHeight - 55, contentWidth, 35, 3, 3, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(255, 255, 255);
  doc.text("Mairie de Zikisso (Région du Lôh-Djiboua) & Plateforme Klo-Liké", margin + 8, pageHeight - 44);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text("Support de révision et d'étude conçu pour la consultation hors-ligne.", margin + 8, pageHeight - 36);
  doc.text("Édition officielle certifiée — Conforme à la loi ivoirienne n° 2012-1128.", margin + 8, pageHeight - 30);

  // --- PAGES INTÉRIEURES : LES 4 SEMAINES + BONUS ---
  const weekKeys = ['semaine-1', 'semaine-2', 'semaine-3', 'semaine-4', 'module-bonus'];

  weekKeys.forEach((key) => {
    const week = DEFAULT_WEEKS[key];
    if (!week) return;

    doc.addPage();
    pageNum++;
    y = 20;

    // Titre de la semaine
    doc.setFillColor(...colorMarine);
    doc.roundedRect(margin, y, contentWidth, 22, 2, 2, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(...colorOrange);
    doc.text(`SEMAINE ${week.ordre} : MODULE DE FORMATION`, margin + 6, y + 7);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255);
    const splitTitle = doc.splitTextToSize(week.titre, contentWidth - 12);
    doc.text(splitTitle, margin + 6, y + 14);

    y += 28;

    // Objectifs
    if (week.objectifs) {
      doc.setFillColor(240, 245, 250);
      doc.roundedRect(margin, y, contentWidth, 24, 2, 2, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(...colorMarine);
      doc.text("Objectifs d'apprentissage clés :", margin + 6, y + 6);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(...colorDark);

      let objY = y + 11;
      const objs = Array.isArray(week.objectifs) ? week.objectifs.slice(0, 3) : [week.objectifs];
      objs.forEach((obj) => {
        doc.text(`• ${obj}`, margin + 6, objY);
        objY += 4.5;
      });

      y += 28;
    }

    // Capsules de la semaine
    week.capsules.forEach((capsule, cIdx) => {
      // Vérification saut de page
      if (y > pageHeight - 55) {
        printFooter();
        doc.addPage();
        pageNum++;
        y = 20;
      }

      // En-tête de capsule
      doc.setFillColor(...colorVert);
      doc.rect(margin, y, 3, 10, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(...colorMarine);
      doc.text(`Capsule ${capsule.id} : ${capsule.title}`, margin + 6, y + 6);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(100, 116, 139);
      doc.text(`⏱ ${capsule.dureeMinutes} min de lecture estimée`, margin + 6, y + 10);

      y += 14;

      // Contenu de la capsule
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(51, 65, 85);
      const splitContent = doc.splitTextToSize(capsule.content, contentWidth - 4);
      doc.text(splitContent, margin + 4, y);

      y += splitContent.length * 4.2 + 8;
    });

    printFooter();
  });

  return doc;
};
