import type { ExerciceFilRouge } from '../types';

export const DEFAULT_EXERCISES: Record<string, ExerciceFilRouge> = {
  'semaine-1': {
    id: 'semaine-1',
    titre: 'Exercice Fil Rouge — Semaine 1 : Diagnostic institutionnel & Répartition des compétences',
    enonce: `Dans le cadre du renforcement de la gouvernance locale à Zikisso, vous êtes chargé(e) de rédiger une note d'analyse institutionnelle (300 à 600 mots).

Votre travail doit répondre aux points suivants :
1. Rappelez la distinction concrète entre les compétences propres de la commune et les missions relevant de la tutelle préfectorale.
2. Identifiez un dysfonctionnement fréquent de coordination locale (par exemple entre la chefferie coutumière, les élus municipaux et les services techniques).
3. Formulez 3 recommandations opérationnelles réalistes pour fluidifier les décisions et renforcer la collaboration institutionnelle au service des habitants de Zikisso.`,
    consignes: [
      'Longueur recommandée : 300 à 600 mots.',
      'Privilégiez des exemples concrets et ancrés dans la réalité communale de Zikisso.',
      'Structurez votre texte avec des sous-titres clairs.'
    ],
    grilleNotation: [
      {
        id: 'c1',
        libelle: 'Maîtrise du cadre légal et des compétences communales',
        pointsMax: 6,
        description: 'Exactitude des notions de décentralisation et de tutelle administrative.'
      },
      {
        id: 'c2',
        libelle: 'Pertinence du diagnostic appliqué au contexte de Zikisso',
        pointsMax: 7,
        description: 'Identification fine des enjeux réels de concertation locale.'
      },
      {
        id: 'c3',
        libelle: 'Faisabilité et impact des 3 recommandations proposées',
        pointsMax: 7,
        description: 'Caractère concret, mesurable et directement applicable des solutions.'
      }
    ]
  },

  'semaine-2': {
    id: 'semaine-2',
    titre: 'Exercice Fil Rouge — Semaine 2 : Stratégie de mobilisation des ressources propres communales',
    enonce: `La commune de Zikisso cherche à accroître ses recettes propres sans étouffer l'activité économique de proximité. Vous êtes invité(e) à formuler une proposition stratégique d'optimisation financière (300 à 600 mots).

Votre proposition doit couvrir :
1. L'état des lieux d'une recette municipale cible (droits de place sur les marchés, taxes d'occupation du domaine public, etc.).
2. Deux leviers concrets pour améliorer le taux de recouvrement effectif (recensement des commerces, sécurisation de la collecte, sensibilisation civique).
3. Les garanties de transparence et de reddition de comptes à apporter aux contribuables pour légitimer l'impôt local.`,
    consignes: [
      'Longueur recommandée : 300 à 600 mots.',
      'Veillez à l’équilibre entre efficacité financière et justice sociale locale.',
      'Détaillez les rôles respectifs de l’ordonnateur (Maire) et du comptable (Trésorier).'
    ],
    grilleNotation: [
      {
        id: 'c1',
        libelle: 'Compréhension des mécanismes de la fiscalité et des recettes locales',
        pointsMax: 6,
        description: 'Distinction claire des recettes propres et respect de la législation fiscale.'
      },
      {
        id: 'c2',
        libelle: 'Réalisme économique et opérationnel des leviers de recouvrement',
        pointsMax: 7,
        description: 'Faisabilité technique et adéquation au pouvoir d’achat local.'
      },
      {
        id: 'c3',
        libelle: 'Dispositifs de transparence et de consentement à l’impôt',
        pointsMax: 7,
        description: 'Mesures crédibles pour restaurer et maintenir la confiance citoyenne.'
      }
    ]
  },

  'semaine-3': {
    id: 'semaine-3',
    titre: 'Exercice Fil Rouge — Semaine 3 : Plan d’action communal d’assainissement et d’urbanisme',
    enonce: `Face aux défis saisonniers de salubrité, de gestion des déchets et d’aménagement de l’espace public à Zikisso, élaborez un plan d'action d'urgence et de moyen terme (300 à 600 mots).

Structurez votre réponse :
1. Diagnostic des points noirs prioritaires (dépôts sauvages, canaux d'évacuation encombrés, circulation autour du grand marché).
2. Plan d'intervention en 4 phases avec calendrier indicatif et moyens requis.
3. Stratégie d'implication des comités de quartier et des organisations de jeunesse pour assurer la salubrité pérenne.`,
    consignes: [
      'Longueur recommandée : 300 à 600 mots.',
      'Mettez en avant le rôle de la police municipale et de la médiation sociale.',
      'Détaillez les actions préventives et curatives.'
    ],
    grilleNotation: [
      {
        id: 'c1',
        libelle: 'Rigueur du diagnostic spatial et environnemental',
        pointsMax: 6,
        description: 'Ciblage précis des zones à risque et des vulnérabilités de la ville.'
      },
      {
        id: 'c2',
        libelle: 'Cohérence et articulation opérationnelle du plan en 4 phases',
        pointsMax: 7,
        description: 'Enchaînement logique des étapes, réalisme des moyens et délais.'
      },
      {
        id: 'c3',
        libelle: 'Mobilisation communautaire et pérennisation des résultats',
        pointsMax: 7,
        description: 'Mécanismes d’appropriation par les habitants et comités locaux.'
      }
    ]
  },

  'semaine-4': {
    id: 'semaine-4',
    titre: 'Exercice Fil Rouge — Semaine 4 : Feuille de route pour la transformation digitale municipale',
    enonce: `Dans l'optique de moderniser la relation usager à la mairie de Zikisso, proposez la feuille de route de digitalisation d'un service communal essentiel (ex : pré-demande d'actes d'état civil, paiement mobile de taxes ou plateforme citoyenne d'alertes).

Votre feuille de route (300 à 600 mots) doit aborder :
1. La justification du service choisi et les bénéfices attendus pour les usagers et les agents.
2. Les mesures prises pour garantir l'inclusion des citoyens sans accès internet ou peu lettrés (guichets relais, SMS, médiation humaine).
3. Le plan de formation et d'accompagnement au changement pour le personnel municipal.`,
    consignes: [
      'Longueur recommandée : 300 à 600 mots.',
      'Tenez compte des réalités de couverture réseau et d’équipement smartphone à Zikisso.',
      'Précisez les indicateurs de succès (délais, taux de satisfaction, sécurité des données).'
    ],
    grilleNotation: [
      {
        id: 'c1',
        libelle: 'Justification stratégique du service dématérialisé',
        pointsMax: 6,
        description: 'Pertinence du cas d’usage et gains tangibles pour le service public.'
      },
      {
        id: 'c2',
        libelle: 'Dispositifs d’inclusion numérique et d’accessibilité pour tous',
        pointsMax: 7,
        description: 'Solutions alternatives humaines et mobiles pour ne laisser aucun citoyen de côté.'
      },
      {
        id: 'c3',
        libelle: 'Conduite du changement et formation des équipes de mairie',
        pointsMax: 7,
        description: 'Qualité du volet humain, sécurisation des processus et pérennité.'
      }
    ]
  },

  'module-bonus': {
    id: 'module-bonus',
    titre: 'Exercice Fil Rouge — Module Bonus : Protocole de cybersécurité et sauvegarde communale',
    enonce: `Pour protéger le patrimoine numérique de la mairie de Zikisso contre les piratages, pertes accidentelles et rançongiciels, rédigez un protocole opérationnel de sécurité informatique (250 à 500 mots) destiné aux agents.

Votre protocole doit comporter :
1. Les 4 règles d'or quotidiennes d'hygiène numérique (mots de passe, gestion des emails douteux, verrouillage de session, usage des clés USB).
2. La procédure standard de sauvegarde régulière des registres et dossiers sensibles.
3. Le plan de réaction immédiate en cas de soupçon d'intrusion ou de blocage d'ordinateur.`,
    consignes: [
      'Longueur recommandée : 250 à 500 mots.',
      'Style direct, impératif, facile à mémoriser pour des agents non spécialistes.',
      'Mettez l’accent sur la protection de la confidentialité des données des citoyens.'
    ],
    grilleNotation: [
      {
        id: 'c1',
        libelle: 'Pertinence et clarté des règles d’hygiène numérique quotidienne',
        pointsMax: 7,
        description: 'Exactitude des bonnes pratiques de sécurité des postes de travail.'
      },
      {
        id: 'c2',
        libelle: 'Fiabilité de la politique de sauvegarde et d’archivage',
        pointsMax: 7,
        description: 'Méthode réaliste de duplication et de conservation hors ligne.'
      },
      {
        id: 'c3',
        libelle: 'Praticité du protocole d’alerte et réflexes d’urgence',
        pointsMax: 6,
        description: 'Rapidité d’endiguement des risques et chaîne de signalement.'
      }
    ]
  },

  'examFinal_etudeDeCas': {
    id: 'examFinal_etudeDeCas',
    titre: 'Examen Final Général — Étude de Cas Professionnelle : "Le Guichet Unique de Zikisso"',
    enonce: `La Mairie de Zikisso engage la modernisation de ses relations avec les usagers par la mise en place d'un "Guichet Unique Communal" (physique et dématérialisé), regroupant l'état civil, les légalisations, les autorisations d'urbanisme légères, le paiement des taxes de marché et le signalement des pannes ou dépôts sauvages.

En tant qu'expert(e) en management public territorial et gouvernance locale, rédigez le mémoire stratégique et opérationnel de déploiement (600 à 1000 mots).

Votre projet doit traiter les 4 axes obligatoires suivants :
1. Diagnostic institutionnel & Vision stratégique : Justifiez la valeur ajoutée du Guichet Unique pour les habitants de Zikisso et pour la productivité des agents communaux.
2. Architecture technique & Dispositif multi-canal : Décrivez l'aménagement physique du hall d'accueil à la mairie et la déclinaison numérique (portail web simple, alertes SMS, paiement mobile sécurisé).
3. Conduite du changement & Inclusion citoyenne : Présentez le plan de formation du personnel communal et les mesures spécifiques pour accompagner les administrés non connectés ou en situation d'analphabétisme.
4. Suivi de performance, indicateurs de qualité & Modèle économique : Définissez 4 indicateurs mesurables de succès (délai moyen de délivrance, taux de satisfaction, sécurisation des recettes fiscales) et la pérennité budgétaire de l'infrastructure.`,
    consignes: [
      'Longueur recommandée : 600 à 1000 mots.',
      'Structurez impérativement votre réponse selon les 4 axes demandés.',
      'Cette étude de cas compte pour 60 % de la note globale de l’Examen Final.'
    ],
    grilleNotation: [
      {
        id: 'c1',
        libelle: 'Diagnostic institutionnel & vision stratégique du Guichet Unique',
        pointsMax: 5,
        description: 'Clarté de la vision, pertinence territoriale pour Zikisso et valeur ajoutée administrative.'
      },
      {
        id: 'c2',
        libelle: 'Conception physique, architecture technique & accessibilité multi-canal',
        pointsMax: 5,
        description: 'Agencement des flux, ergonomie des e-services et sécurité des données citoyennes.'
      },
      {
        id: 'c3',
        libelle: 'Conduite du changement, formation des agents & inclusion des usagers',
        pointsMax: 5,
        description: 'Qualité du plan de formation, accompagnement humain et lutte contre la fracture numérique.'
      },
      {
        id: 'c4',
        libelle: 'Gouvernance, indicateurs de performance & pérennité budgétaire',
        pointsMax: 5,
        description: 'Pertinence des indicateurs de suivi, traçabilité des recettes et viabilité financière.'
      }
    ]
  }
};
