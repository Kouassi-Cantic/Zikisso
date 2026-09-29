import { jsPDF } from 'jspdf';

export interface CertificateData {
  apprenantNom: string;
  noteGlobale: number;
  type: 'reussite' | 'participation';
  dateGeneration: string;
  certificatId: string;
  apprenantProfil?: string;
}

export const generateCertificatePDF = (data: CertificateData): jsPDF => {
  const { apprenantNom, noteGlobale, type, dateGeneration, certificatId, apprenantProfil } = data;

  // Création du document PDF A4 Paysage (297 mm x 210 mm)
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 297;
  const pageHeight = 210;

  // Palette officielle du projet
  const colorMarine: [number, number, number] = [31, 78, 121]; // #1F4E79
  const colorVert: [number, number, number] = [26, 107, 60];    // #1A6B3C
  const colorOrange: [number, number, number] = [197, 90, 17];  // #C55A11
  const colorGold: [number, number, number] = [212, 160, 23];   // Or ornemental
  const colorDark: [number, number, number] = [30, 41, 59];     // Slate 800

  // 1. Fond très léger
  doc.setFillColor(253, 254, 253);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // 2. Bordures extérieures ornementales institutionnelles
  // Bordure marine épaisse
  doc.setDrawColor(...colorMarine);
  doc.setLineWidth(1.8);
  doc.rect(10, 10, pageWidth - 20, pageHeight - 20);

  // Bordure fine verte intérieure
  doc.setDrawColor(...colorVert);
  doc.setLineWidth(0.6);
  doc.rect(13, 13, pageWidth - 26, pageHeight - 26);

  // Bordure orange très fine
  doc.setDrawColor(...colorOrange);
  doc.setLineWidth(0.3);
  doc.rect(14.5, 14.5, pageWidth - 29, pageHeight - 29);

  // Coins décoratifs aux quatre angles
  const drawCorner = (x: number, y: number, dx: number, dy: number) => {
    doc.setFillColor(...colorOrange);
    doc.circle(x, y, 1.8, 'F');
    doc.setDrawColor(...colorGold);
    doc.setLineWidth(0.5);
    doc.line(x, y, x + dx * 8, y);
    doc.line(x, y, x, y + dy * 8);
  };
  drawCorner(15, 15, 1, 1);
  drawCorner(pageWidth - 15, 15, -1, 1);
  drawCorner(15, pageHeight - 15, 1, -1);
  drawCorner(pageWidth - 15, pageHeight - 15, -1, -1);

  // 3. En-tête républicain & communal
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...colorMarine);
  doc.text("RÉPUBLIQUE DE CÔTE D'IVOIRE", pageWidth / 2, 22, { align: 'center' });

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text("Union — Discipline — Travail", pageWidth / 2, 26, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...colorVert);
  doc.text("RÉGION DU LÔH-DJIBOUA • COMMUNE DE ZIKISSO", pageWidth / 2, 30.5, { align: 'center' });

  // Séparateur fin bicolore
  doc.setDrawColor(...colorOrange);
  doc.setLineWidth(0.5);
  doc.line(pageWidth / 2 - 35, 33, pageWidth / 2 + 35, 33);

  // 4. Titre officiel du certificat
  const isReussite = type === 'reussite';
  const titreCertificat = isReussite
    ? 'ATTESTATION DE RÉUSSITE'
    : 'ATTESTATION DE PARTICIPATION';

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(...colorMarine);
  doc.text(titreCertificat, pageWidth / 2, 45, { align: 'center' });

  // Ruban d'intitulé du MOOC
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...colorVert);
  doc.text("MOOC ZIKISSO — GESTION DES COLLECTIVITÉS LOCALES & TRANSFORMATION DIGITALE", pageWidth / 2, 53, { align: 'center' });

  // 5. Texte introductif
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(...colorDark);
  doc.text("La Direction Pédagogique du MOOC et la Mairie de Zikisso certifient par la présente que :", pageWidth / 2, 63, { align: 'center' });

  // 6. Nom de l'apprenant mis en valeur
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(19);
  doc.setTextColor(...colorMarine);
  doc.text(apprenantNom.toUpperCase(), pageWidth / 2, 75, { align: 'center' });

  // Soulignement élégant sous le nom
  const nameWidth = doc.getTextWidth(apprenantNom.toUpperCase());
  doc.setDrawColor(...colorOrange);
  doc.setLineWidth(0.8);
  doc.line(pageWidth / 2 - Math.max(30, nameWidth / 2), 78, pageWidth / 2 + Math.max(30, nameWidth / 2), 78);

  if (apprenantProfil) {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text(`Profil : ${apprenantProfil}`, pageWidth / 2, 83, { align: 'center' });
  }

  // 7. Corps du certificat
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(...colorDark);

  const corpsL1 = isReussite
    ? "a accompli avec succès l'ensemble du parcours certifiant de 30 jours, validé les évaluations hebdomadaires,"
    : "a activement participé aux travaux, webinaires et études de cas du parcours de formation continue,";
  const corpsL2 = isReussite
    ? "soutenu l'étude de cas pratique du Guichet Unique et satisfait à l'Examen Final Général du programme communal."
    : "acquis les compétences socles relatives à la gouvernance locale et à la modernisation numérique de Zikisso.";

  doc.text(corpsL1, pageWidth / 2, 93, { align: 'center' });
  doc.text(corpsL2, pageWidth / 2, 98, { align: 'center' });

  // 8. Cartouche officiel de la Note Globale
  const noteY = 112;
  const boxWidth = 84;
  const boxHeight = 22;
  const boxX = (pageWidth - boxWidth) / 2;

  // Fond du cartouche
  doc.setFillColor(240, 245, 250);
  doc.setDrawColor(...(isReussite ? colorVert : colorMarine));
  doc.setLineWidth(0.8);
  doc.roundedRect(boxX, noteY, boxWidth, boxHeight, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...colorMarine);
  doc.text("NOTE GLOBALE PONDÉRÉE OBTENUE", pageWidth / 2, noteY + 6.5, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(...(isReussite ? colorVert : colorMarine));
  doc.text(`${noteGlobale.toFixed(1)} / 20`, pageWidth / 2, noteY + 14.5, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  const mentionText = isReussite
    ? (noteGlobale >= 16 ? "Mention Très Bien" : noteGlobale >= 14 ? "Mention Bien" : "Mention Assez Bien")
    : "Attestation de suivi régulier";
  doc.text(mentionText, pageWidth / 2, noteY + 19, { align: 'center' });

  // 9. Sceau officiel circulaire au centre inférieur
  const sealX = pageWidth / 2;
  const sealY = 160;

  // Cercles concentriques du sceau
  doc.setDrawColor(...colorOrange);
  doc.setLineWidth(0.6);
  doc.circle(sealX, sealY, 13, 'S');

  doc.setDrawColor(...colorMarine);
  doc.setLineWidth(0.3);
  doc.circle(sealX, sealY, 11.5, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(5.5);
  doc.setTextColor(...colorMarine);
  doc.text("COMMUNE DE ZIKISSO", sealX, sealY - 6.5, { align: 'center' });
  doc.text("★ SCEAU OFFICIEL ★", sealX, sealY - 3, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(...colorVert);
  doc.text("CERTIFIÉ", sealX, sealY + 1.5, { align: 'center' });
  doc.text("CONFORME", sealX, sealY + 4.5, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(5);
  doc.setTextColor(100, 116, 139);
  doc.text("GOUVERNANCE LOCALE", sealX, sealY + 8, { align: 'center' });

  // 10. Signatures institutionnelles
  // Signature Gauche : Direction Pédagogique
  const sigLeftX = 45;
  const sigY = 146;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...colorMarine);
  doc.text("Pour le Conseil Pédagogique", sigLeftX, sigY);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text("Le Responsable des Programmes", sigLeftX, sigY + 4.5);

  // Ligne de signature gauche
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.4);
  doc.line(sigLeftX, sigY + 18, sigLeftX + 48, sigY + 18);
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(6.5);
  doc.text("Signature & Approbation académique", sigLeftX, sigY + 22);

  // Signature Droite : Mairie de Zikisso
  const sigRightX = pageWidth - 93;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...colorMarine);
  doc.text("Pour la Commune de Zikisso", sigRightX, sigY);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text("Le Maire / Secrétaire Général", sigRightX, sigY + 4.5);

  // Ligne de signature droite
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.4);
  doc.line(sigRightX, sigY + 18, sigRightX + 48, sigY + 18);
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(6.5);
  doc.text("Cachet et signature de l'autorité communale", sigRightX, sigY + 22);

  // 11. Pied de page sécurisé
  const formattedDate = new Date(dateGeneration).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text(`Fait à Zikisso, le ${formattedDate}`, 18, pageHeight - 17);

  doc.setFont('courier', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(...colorMarine);
  doc.text(`N° Réf : ${certificatId}`, pageWidth - 18, pageHeight - 17, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(148, 163, 184);
  doc.text("Authenticité vérifiable auprès du registre communal des formations continues de Zikisso (Lôh-Djiboua, Côte d'Ivoire).", pageWidth / 2, pageHeight - 14, { align: 'center' });

  return doc;
};
