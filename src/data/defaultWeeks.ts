import type { WeekData } from '../types';

export interface EnrichedCapsule {
  id: string;
  title: string;
  content: string;
  dureeMinutes: number;
}

export interface EnrichedWeekData extends Omit<WeekData, 'capsules'> {
  capsules: EnrichedCapsule[];
}

export const DEFAULT_WEEKS: Record<string, EnrichedWeekData> = {
  'semaine-1': {
    id: 'semaine-1',
    ordre: 1,
    titre: "Cadre Institutionnel, Acteurs et Décentralisation en Côte d'Ivoire",
    objectifs: [
      "Maîtriser l'organisation territoriale ivoirienne et la loi n° 2012-1128.",
      "Comprendre le principe constitutionnel de libre administration des collectivités.",
      "Identifier les rôles respectifs du Conseil Municipal, de la Municipalité et du Maire.",
      "Comprendre les attributions et le contrôle de légalité exercé par la tutelle administrative (Préfecture de Lakota)."
    ],
    capsules: [
      {
        id: '1.1',
        title: "La loi n° 2012-1128 et l'architecture de la décentralisation",
        content: `La décentralisation ivoirienne repose sur la loi n° 2012-1128 du 13 décembre 2012 portant orientation générale de l'organisation générale de l'administration territoriale. Ce texte structure le territoire national en trois échelons de collectivités territoriales : les Régions, les Communes, et les Districts Autonomes (Abidjan, Yamoussoukro).

Chaque collectivité territoriale est dotée de la personnalité morale, de compétences propres et de ressources budgétaires distinctes de celles de l'État. À Zikisso, la commune constitue le niveau de gouvernance de proximité immédiate pour les populations urbaines et rurales.`,
        dureeMinutes: 6
      },
      {
        id: '1.2',
        title: "Les organes de la Commune : Conseil, Municipalité et Maire",
        content: `La Commune fonctionne autour de trois organes complémentaires :
1. Le Conseil Municipal : Organe délibérant élu au suffrage universel direct. Il vote le budget primitif, approuve le Plan Triennal et délibère sur les affaires de la commune.
2. La Municipalité : Organe exécutif collégial composé du Maire et de ses adjoints. Elle prépare et exécute les décisions du Conseil.
3. Le Maire : Chef de l'exécutif communal et représentant de l'État dans la circonscription municipale pour l'état civil et les pouvoirs de police administrative.`,
        dureeMinutes: 7
      },
      {
        id: '1.3',
        title: "Le rôle de la tutelle administrative et le contrôle de légalité",
        content: `Le principe constitutionnel de libre administration s'exerce sous le contrôle de la tutelle administrative de l'État. Pour la commune de Zikisso, la tutelle rapprochée est exercée par le Préfet du Département de Lakota.

Ce contrôle de légalité s'exerce a posteriori sur les délibérations et actes municipaux. La Direction Générale de la Décentralisation et du Développement Local (DGDDL) coordonne quant à elle la politique nationale et veille à l'harmonisation des pratiques communales.`,
        dureeMinutes: 6
      },
      {
        id: '1.4',
        title: "Focus Digital : la plateforme DGDDL et le portail e-Gouv",
        content: `La transformation numérique de la gouvernance locale s'accélère en Côte d'Ivoire grâce au portail national e-Gouv et aux systèmes d'information déployés par la DGDDL.

Ces outils permettent la dématérialisation progressive de la transmission des actes administratifs vers la préfecture, accélérant les délais d'approbation et renforçant la transparence auprès des administrés de Zikisso.`,
        dureeMinutes: 5
      }
    ]
  },

  'semaine-2': {
    id: 'semaine-2',
    ordre: 2,
    titre: "Planification Locale et Budgétisation Territoriale",
    objectifs: [
      "Maîtriser les cycles budgétaires d'une commune ivoirienne de la préparation au vote.",
      "Comprendre la distinction fondamentale entre Section de Fonctionnement et Section d'Investissement.",
      "Articuler le Plan Triennal communal avec le Plan National de Développement (PND).",
      "Appliquer les règles prudentielles de plafonnement des dépenses de personnel (40% max)."
    ],
    capsules: [
      {
        id: '2.1',
        title: "Le Plan Triennal, outil stratégique du développement local",
        content: `Le Plan Triennal est un instrument de programmation glissante par lequel la commune planifie ses investissements sur une période de trois exercices successifs.

Élaboré en concertation avec les forces vives locales (notabilités, associations de femmes, jeunes, commerçants), il priorise les infrastructures durables : écoles primaires, dispensaires, voirie, adduction d'eau et marchés ruraux.`,
        dureeMinutes: 7
      },
      {
        id: '2.2',
        title: "La structure du Budget Communal : Fonctionnement vs Investissement",
        content: `Le budget communal se divise obligatoirement en deux sections distinctes qui doivent chacune être votées en équilibre réel :
• La Section de Fonctionnement : Couvre les dépenses courantes (salaires des agents, fournitures, entretien, charges courantes) financées par les recettes fiscales et de prestations.
• La Section d'Investissement : Finance les projets structurants pérennes (bâtiments, pistes rurales, électrification) financée par le prélèvement sur fonctionnement, les subventions d'équipement de l'État (FDL) et les concours extérieurs.`,
        dureeMinutes: 8
      },
      {
        id: '2.3',
        title: "Le calendrier et la procédure budgétaire communale",
        content: `Le cycle budgétaire suit une chronologie réglementaire stricte :
1. Débat d'orientation budgétaire (troisième trimestre de l'année N-1).
2. Vote du Budget Primitif par le Conseil Municipal avant le début de l'exercice N.
3. Transmission au Préfet de tutelle pour contrôle de légalité et approbation exécutoire.
4. Exécution sous la double responsabilité du Maire (ordonnateur) et du Receveur Municipal (comptable public).
5. Vote du Compte Administratif et du Compte de Gestion en N+1 pour clore l'exercice.`,
        dureeMinutes: 6
      },
      {
        id: '2.4',
        title: "Focus Digital : les progiciels de gestion budgétaire communale",
        content: `L'informatisation de la chaîne financière communale s'appuie sur des progiciels intégrés (e-Commune, modules SIGFIP adaptés).

Ces logiciels permettent d'éditer automatiquement les bons d'engagement, de bloquer les dépenses non mandatées, de suivre en temps réel la trésorerie et d'éviter les dépassements de crédits non autorisés.`,
        dureeMinutes: 5
      }
    ]
  },

  'semaine-3': {
    id: 'semaine-3',
    ordre: 3,
    titre: "Fiscalité Locale et Mobilisation des Ressources Propres",
    objectifs: [
      "Identifier la typologie des recettes communales : impôts rétrocédés et taxes directes.",
      "Comprendre le fonctionnement et les défis des taxes de marché et droits d'occupation.",
      "Respecter la règle de séparation stricte entre ordonnateur (Maire) et comptable (Receveur).",
      "Concevoir un dispositif de télépaiement Mobile Money adapté au contexte rural de Zikisso."
    ],
    capsules: [
      {
        id: '3.1',
        title: "Les ressources fiscales des communes ivoiriennes",
        content: `Pour financer ses compétences, la commune dispose de deux grandes catégories de ressources fiscales :
• Les impôts d'État partagés ou rétrocédés : Recouvrés par la Direction Générale des Impôts (DGI), dont une quote-part revient à la commune (patente commerciale, impôt foncier bâti et non bâti).
• Les taxes communales directes : Instituées par délibération du Conseil Municipal (taxes de voirie, de salubrité, droits de stationnement, occupation temporaire du domaine public).`,
        dureeMinutes: 7
      },
      {
        id: '3.2',
        title: "Taxes de marché, de stationnement et droits d'occupation du domaine public",
        content: `À Zikisso, les taxes journalières perçues sur le grand marché communal et les gares routières représentent le socle des recettes propres immédiates.

Cependant, le recouvrement manuel traditionnel par quittances papier souffre de déperditions, d'erreurs de caisse et de risques d'insécurité lors du transport physique des fonds. D'où la nécessité de moderniser et de sécuriser ce canal.`,
        dureeMinutes: 6
      },
      {
        id: '3.3',
        title: "Le rôle du Receveur Municipal et la séparation des fonctions",
        content: `Le principe de séparation de l'ordonnateur et du comptable est le garant de la probité financière locale :
• Le Maire (ordonnateur) prescrit les recettes et engage les dépenses. Il ne manie jamais directement les fonds publics.
• Le Receveur Municipal (comptable public nommé par le Trésor Public) est le seul habilité à encaisser les fonds, manier les deniers et payer les mandats réguliers.`,
        dureeMinutes: 7
      },
      {
        id: '3.4',
        title: "Focus Digital : le télépaiement Mobile Money des recettes locales",
        content: `Le déploiement de terminaux mobiles de paiement (POS) et du paiement par Mobile Money (Orange Money, MTN MoMo, Wave) révolutionne la collecte municipale :
1. Le commerçant paie via QR code ou numéro marchand.
2. Un reçu horodaté avec identifiant unique est émis.
3. Les fonds sont automatiquement consolidés sur le compte du Trésor de la commune sans manipulation d'espèces.`,
        dureeMinutes: 6
      }
    ]
  },

  'semaine-4': {
    id: 'semaine-4',
    ordre: 4,
    titre: "Modernisation des Services Publics et Administration Numérique",
    objectifs: [
      "Optimiser la délivrance des actes d'état civil dans les villages et campements de Zikisso.",
      "Comprendre le rôle de l'ONECI et le cadre légal des déclarations de naissance.",
      "Accompagner la conduite du changement auprès des agents communaux.",
      "Déployer un guichet unique communal virtuel et des canaux inclusifs (USSD / SMS)."
    ],
    capsules: [
      {
        id: '4.1',
        title: "Les services publics municipaux de proximité",
        content: `Les services publics communaux constituent le premier visage de l'État pour les citoyens : état civil, gestion des déchets, salubrité publique, entretien des cimetières et régulation des activités économiques.

À Zikisso, l'éloignement de certains villages par rapport à l'hôtel de ville impose de repenser la proximité à travers des services mobiles et des solutions numériques déconcentrées.`,
        dureeMinutes: 6
      },
      {
        id: '4.2',
        title: "Le cadre légal de la modernisation de l'état civil",
        content: `L'Office National de l'État Civil et de l'Identification (ONECI) pilote l'informatisation globale du registre d'état civil ivoirien.

La loi fixe un délai impératif pour la déclaration des naissances (3 mois). Passé ce délai légal, l'obtention d'un acte nécessite obligatoirement un jugement supplétif rendu par le tribunal de première instance ou la section de tribunal compétente. La sensibilisation précoce des familles est donc une urgence civique.`,
        dureeMinutes: 7
      },
      {
        id: '4.3',
        title: "La conduite du changement auprès des agents municipaux",
        content: `La digitalisation d'une administration communale ne se décrète pas par simple arrêté ; elle s'accompagne méthodiquement :
• Implication en amont des agents de guichet et des secrétaires d'état civil.
• Formations pratiques répétées et tutorat interne.
• Valorisation des nouveaux rôles des agents en tant que facilitateurs numériques et conseillers des citoyens.`,
        dureeMinutes: 6
      },
      {
        id: '4.4',
        title: "Focus Digital : le guichet unique virtuel e-Commune",
        content: `Le guichet unique virtuel permet aux usagers de pré-remplir en ligne leurs demandes d'extraits d'acte de naissance, de certificat de résidence ou de légalisation.

En combinant un portail web simplifié, des bornes d'assistance en mairie et un canal USSD (*xxx#) utilisable même sur un téléphone basique sans connexion Internet, la commune garantit l'inclusion numérique de tous les habitants du canton de Zikisso.`,
        dureeMinutes: 6
      }
    ]
  },

  'module-bonus': {
    id: 'module-bonus',
    ordre: 5,
    titre: "Redevabilité, Cybersécurité & Participation Citoyenne",
    objectifs: [
      "Maîtriser les principes et modalités pratiques du budget participatif communal.",
      "Mettre en place des comités de veille citoyenne constructifs.",
      "Garantir le droit d'accès aux documents budgétaires et administratifs publics.",
      "Adopter les bonnes pratiques de cybersécurité pour protéger les données de la commune."
    ],
    capsules: [
      {
        id: 'B.1',
        title: "Le budget participatif : impliquer les citoyens dans les arbitrages",
        content: `Le budget participatif est un mécanisme démocratique par lequel le Conseil Municipal réserve une enveloppe financière spécifique dont l'affectation est directement débattue et votée par les habitants des différents quartiers et villages.

Cette démarche renforce le sentiment d'appartenance collective, améliore le consentement à l'impôt local et assure que les investissements répondent aux urgences vécues des populations.`,
        dureeMinutes: 6
      },
      {
        id: 'B.2',
        title: "Les comités de veille citoyenne et la redevabilité locale",
        content: `Les comités de veille citoyenne rassemblent des représentants de la société civile (jeunes, femmes, leaders religieux, chefs coutumiers) chargés d'observer le bon déroulement des chantiers communaux et la qualité des services délivrés.

Leur rôle est consultatif et collaboratif : ils alertent les services municipaux sur les retards ou anomalies, créant un dialogue vertueux entre gouvernants et gouvernés.`,
        dureeMinutes: 7
      },
      {
        id: 'B.3',
        title: "Le droit d'accès à l'information publique communale",
        content: `Conformément à la loi sur l'accès à l'information d'intérêt public, les citoyens de Zikisso ont le droit de consulter le budget primitif approuvé, le compte administratif et les procès-verbaux des séances publiques du Conseil Municipal.

L'affichage en mairie et la publication en ligne sur le portail de la commune constituent le socle d'une gouvernance transparente et apaisée.`,
        dureeMinutes: 6
      },
      {
        id: 'B.4',
        title: "Cybersécurité des collectivités : protéger les données administratives",
        content: `Avec la dématérialisation des registres d'état civil et des finances, la commune devient la dépositaire de données sensibles des citoyens.

Les règles élémentaires de sécurité s'imposent : sauvegardes externes régulières, mots de passe renforcés, séparation des réseaux administratifs et Wi-Fi public, et sensibilisation des agents contre les tentatives de hameçonnage (phishing).`,
        dureeMinutes: 6
      }
    ]
  }
};
