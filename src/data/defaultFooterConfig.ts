export interface FooterLinkItem {
  id: string;
  label: string;
  url: string;
  isExternal?: boolean;
}

export interface FooterConfig {
  // Colonne 1 : Marque & Manifeste
  brandTitle: string;
  brandSubtitle: string;
  brandDescription: string;
  facebookUrl: string;
  twitterUrl: string;
  linkedinUrl: string;
  whatsappUrl: string;
  whatsappNumber: string;

  // Colonne 2 : Parcours & Cursus
  column2Title: string;
  column2Icon: string;
  column2Links: FooterLinkItem[];

  // Colonne 3 : Engagement & Ressources
  column3Title: string;
  column3Icon: string;
  column3Links: FooterLinkItem[];

  // Colonne 4 : Coordination & Pilotage
  column4Title: string;
  coordinationEntityName: string;
  coordinationWebsiteUrl: string;
  coordinationAddress: string;
  coordinationPhone: string;
  coordinationEmail: string;
  coordinationLeadName: string;
  coordinationLeadWhatsapp: string;
  coordinationComplementText?: string;

  // Colonne 5 : Veille Stratégique & Newsletter
  column5Title: string;
  column5Description: string;
  newsletterPlaceholder: string;

  // Barre inférieure
  copyrightText: string;
  consoleButtonText: string;
}

export const DEFAULT_FOOTER_CONFIG: FooterConfig = {
  // Colonne 1
  brandTitle: "MOOC e-COMMUNES",
  brandSubtitle: "GOUVERNANCE ET TRANSFORMATION DIGITALE",
  brandDescription: "Penser l'utile. Former l'élu. Outiller l'agent. Éclairer le citoyen. Première initiative certifiante de gouvernance territoriale et de transition numérique en Côte d'Ivoire. Laboratoire pilote : Commune de Zikisso (Lôh-Djiboua).",
  facebookUrl: "https://facebook.com",
  twitterUrl: "https://twitter.com",
  linkedinUrl: "https://linkedin.com",
  whatsappUrl: "https://wa.me/2250103438456",
  whatsappNumber: "+225 0103438456",

  // Colonne 2 : Parcours & Cursus
  column2Title: "PARCOURS ET CURSUS",
  column2Icon: "💼",
  column2Links: [
    { id: 'c2-1', label: 'Semaine 1 : Décentralisation 🏛️', url: '/cours', isExternal: false },
    { id: 'c2-2', label: 'Semaine 2 : Finances Locales 📊', url: '/cours', isExternal: false },
    { id: 'c2-3', label: 'Semaine 3 : Services Municipaux 🏗️', url: '/cours', isExternal: false },
    { id: 'c2-4', label: 'Semaine 4 : E-Administration 💻', url: '/cours', isExternal: false },
    { id: 'c2-5', label: 'Examen Final et Certification 🎓', url: '/cours', isExternal: false }
  ],

  // Colonne 3 : Engagement & Ressources
  column3Title: "ENGAGEMENT ET RESSOURCES",
  column3Icon: "🌍",
  column3Links: [
    { id: 'c3-1', label: "Charte d'Engagement Civique 📜", url: '/ressources', isExternal: false },
    { id: 'c3-2', label: 'Fascicule Complet (PDF) 📥', url: '/ressources', isExternal: false },
    { id: 'c3-3', label: 'Glossaire des Collectivités 📖', url: '/ressources', isExternal: false },
    { id: 'c3-4', label: "Observatoire Territorial des 31 Régions 🗺️", url: '/observatoire', isExternal: false },
    { id: 'c3-5', label: "Vérificateur d'Attestation 🛡️", url: '/verifier-certificat', isExternal: false }
  ],

  // Colonne 4 : Coordination & Pilotage
  column4Title: "COORDINATION ET PILOTAGE",
  coordinationEntityName: "Cantic Think IA",
  coordinationWebsiteUrl: "https://canticthinkia.work",
  coordinationAddress: "544, Deux Plateaux Agban — Rue 70, Carrefour Kratos, Cocody, Abidjan, Côte d'Ivoire",
  coordinationPhone: "+225 25 22 00 12 39",
  coordinationEmail: "commercial@canticthinkia.work",
  coordinationLeadName: "Kouassi Ouréga Goble",
  coordinationLeadWhatsapp: "+225 0103438456",
  coordinationComplementText: "Laboratoire d'expérimentation territoriale : Commune de Zikisso (Hôtel de Ville)",

  // Colonne 5 : Veille Stratégique & Newsletter
  column5Title: "VEILLE STRATÉGIQUE",
  column5Description: "Recevez nos notes de prospective municipale, analyses des réformes territoriales et alertes de sessions directement dans votre boîte de réception.",
  newsletterPlaceholder: "contact@collectivite.ci",

  // Barre inférieure
  copyrightText: "© 2026 MOOC e-COMMUNES CI. Tous droits réservés. Penser l'utile, Agir pour le bien commun.",
  consoleButtonText: "CONSOLE DE GOUVERNANCE"
};
