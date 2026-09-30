import { jsPDF } from 'jspdf';

// 1. Génération du PDF Boîte à Outils (Annexe A)
export const generateToolboxPDF = (): jsPDF => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 16;
  const contentWidth = pageWidth - 2 * margin;

  // Couleurs de la charte
  const colorMarine: [number, number, number] = [31, 78, 121]; // #1F4E79
  const colorVert: [number, number, number] = [26, 107, 60];    // #1A6B3C
  const colorOrange: [number, number, number] = [197, 90, 17];  // #C55A11
  const colorDark: [number, number, number] = [30, 41, 59];

  // En-tête institutionnel
  doc.setFillColor(...colorMarine);
  doc.rect(0, 0, pageWidth, 28, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.text("MOOC ZIKISSO • RESSOURCES MÉTHODOLOGIQUES", pageWidth / 2, 12, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(220, 235, 250);
  doc.text("Annexe A — Boîte à Outils Pratiques du Gestionnaire Communal", pageWidth / 2, 19, { align: 'center' });

  let y = 38;

  // Outil A.1
  doc.setFillColor(240, 245, 250);
  doc.rect(margin, y, contentWidth, 8, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...colorMarine);
  doc.text("OUTIL A.1 : Trame Type de Délibération Municipale", margin + 3, y + 5.5);
  y += 12;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...colorDark);
  const introA1 = "Modèle standardisé pour la prise d'actes par le Conseil Municipal de Zikisso avant transmission en Préfecture :";
  doc.text(introA1, margin, y);
  y += 6;

  const fieldsA1 = [
    "1. Intitulé officiel de la délibération et date de séance",
    "2. Visas juridiques des lois et décrets applicables (Loi 2012-1128, etc.)",
    "3. Exposé des motifs (justification de la mesure et impact local)",
    "4. Article 1er (Objet précis de la délibération)",
    "5. Article 2 (Modalités pratiques d'exécution et calendrier)",
    "6. Article 3 (Imputation budgétaire : fonctionnement ou investissement)",
    "7. Transmission obligatoire à la tutelle (Préfet du Département de Lakota)",
    "8. Clôture, signature du Maire, émargement des conseillers municipaux présents"
  ];
  fieldsA1.forEach((f) => {
    doc.text(`• ${f}`, margin + 4, y);
    y += 5.5;
  });

  y += 4;

  // Outil A.2
  doc.setFillColor(240, 245, 250);
  doc.rect(margin, y, contentWidth, 8, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...colorVert);
  doc.text("OUTIL A.2 : Grille de Suivi Budgétaire Simplifiée", margin + 3, y + 5.5);
  y += 12;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...colorDark);
  doc.text("Tableau synthétique de pilotage de l'exécution des recettes et dépenses communales :", margin, y);
  y += 6;

  // Tableau simple
  doc.setFillColor(...colorMarine);
  doc.rect(margin, y, contentWidth, 7, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text("Ligne Budgétaire", margin + 4, y + 4.5);
  doc.text("Prévu (FCFA)", margin + 60, y + 4.5);
  doc.text("Engagé (FCFA)", margin + 95, y + 4.5);
  doc.text("Disponible (FCFA)", margin + 130, y + 4.5);
  doc.text("Observations", margin + 155, y + 4.5);
  y += 7;

  const sampleRows = [
    ["Voirie & Entretien pistes", "15 000 000", "8 500 000", "6 500 000", "Travaux saison sèche en cours"],
    ["Salubrité & Gestion déchets", "10 000 000", "6 200 000", "3 800 000", "Curage caniveaux marché"],
    ["Modernisation État Civil", "8 000 000", "5 100 000", "2 900 000", "Équipements informatiques ONECI"],
    ["Écoles primaires communales", "12 000 000", "11 000 000", "1 000 000", "Fournitures et bancs livrés"]
  ];

  sampleRows.forEach((row, i) => {
    const gray = i % 2 === 0 ? 255 : 248;
    doc.setFillColor(gray, gray, gray);
    doc.rect(margin, y, contentWidth, 6.5, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.rect(margin, y, contentWidth, 6.5, 'S');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...colorDark);
    doc.text(row[0], margin + 4, y + 4.5);
    doc.text(row[1], margin + 60, y + 4.5);
    doc.text(row[2], margin + 95, y + 4.5);
    doc.text(row[3], margin + 130, y + 4.5);
    doc.text(row[4], margin + 155, y + 4.5);
    y += 6.5;
  });

  y += 8;

  // Outil A.3
  doc.setFillColor(240, 245, 250);
  doc.rect(margin, y, contentWidth, 8, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...colorOrange);
  doc.text("OUTIL A.3 : Cahier des Charges d'un Projet Numérique Communal", margin + 3, y + 5.5);
  y += 12;

  const fieldsA3 = [
    "1. Contexte communal et diagnostic des besoins des usagers de Zikisso",
    "2. Objectifs quantitatifs et qualitatifs mesurables (délais, taux d'adoption)",
    "3. Public cible et prise en compte des contraintes de couverture réseau (offline-first)",
    "4. Architecture multi-canal inclusive (Guichet physique, Portail Web, USSD, SMS)",
    "5. Conduite du changement et formation continue des agents municipaux",
    "6. Budget prévisionnel d'investissement et phasage sur le Plan Triennal",
    "7. Indicateurs de pilotage, sécurité des données et pérennité opérationnelle"
  ];
  fieldsA3.forEach((f) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(...colorDark);
    doc.text(`• ${f}`, margin + 4, y);
    y += 5.5;
  });

  // Pied de page
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text("Document pédagogique officiel • MOOC Zikisso • Mairie de Zikisso & Partenaire Éducatif Klo-Liké", pageWidth / 2, pageHeight - 10, { align: 'center' });

  return doc;
};

// 2. Génération du PDF Glossaire (Annexe C)
export const generateGlossaryPDF = (glossaryItems: Array<[string, string]>): jsPDF => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 16;
  const contentWidth = pageWidth - 2 * margin;

  const colorMarine: [number, number, number] = [31, 78, 121]; // #1F4E79
  const colorVert: [number, number, number] = [26, 107, 60];    // #1A6B3C

  // En-tête
  doc.setFillColor(...colorMarine);
  doc.rect(0, 0, pageWidth, 28, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.text("MOOC ZIKISSO • GLOSSAIRE INSTITUTIONNEL", pageWidth / 2, 12, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(220, 235, 250);
  doc.text("Annexe C — 22 Définitions Clés : Gouvernance Locale, Finances & Numérique", pageWidth / 2, 19, { align: 'center' });

  let y = 36;
  let pageNum = 1;

  const printFooter = () => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184);
    doc.text(`Page ${pageNum} • MOOC Zikisso — Décentralisation & Transformation Digitale`, pageWidth / 2, pageHeight - 10, { align: 'center' });
  };

  glossaryItems.forEach(([terme, definition], idx) => {
    // Vérification de saut de page
    if (y > pageHeight - 25) {
      printFooter();
      doc.addPage();
      pageNum++;
      y = 20;
    }

    doc.setFillColor(245, 248, 252);
    doc.roundedRect(margin, y, contentWidth, 10, 1.5, 1.5, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(...colorMarine);
    doc.text(`${idx + 1}. ${terme}`, margin + 3, y + 4.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(51, 65, 85);
    const splitDef = doc.splitTextToSize(definition, contentWidth - 6);
    doc.text(splitDef, margin + 3, y + 8.5);

    y += 10 + (splitDef.length - 1) * 3.5 + 3.5;
  });

  printFooter();

  return doc;
};
