export interface MayorMessageData {
  commune: string;
  region: string;
  nomMaire?: string;
  titreOfficiel?: string;
  photoMaireUrl?: string;
  messageBienvenue: string;
  citationCle?: string;
  prioritesMunicipales?: string[];
  dateMiseAJour?: string;
  misAJourPar?: string;
}

// Message type par défaut utilisé pour toute commune n'ayant pas encore personnalisé sa fiche
export const generateDefaultMayorMessage = (commune: string, region: string): MayorMessageData => ({
  commune,
  region,
  nomMaire: `L'Autorité Municipale de ${commune}`,
  titreOfficiel: `Maire de la Commune de ${commune}`,
  citationCle: `« L'élévation des compétences communales est la clé de voûte de notre essor territorial. »`,
  messageBienvenue: `Au nom du Conseil Municipal et de l'ensemble des populations de la Commune de ${commune} (Région du ${region}), je vous adresse nos plus chaleureuses félicitations pour votre engagement dans le MOOC e-Communes.
  
Que vous soyez conseiller municipal, agent administratif, acteur de la société civile ou citoyen engagé, votre volonté de vous former à la bonne gouvernance locale, à la transparence budgétaire et à la digitalisation territoriale honore notre cité.
  
Notre commune a besoin de forces vives instruites, outillées et mobilisées. Persévérez jusqu'à l'obtention de votre attestation officielle : nous serons fiers de valoriser vos acquis au service de notre communauté locale !`,
  prioritesMunicipales: [
    'Digitalisation et transparence des services municipaux',
    'Participation citoyenne et redevabilité publique',
    'Développement économique local et transition écologique',
  ],
});

// Messages spécifiques et personnalisés (ex: Commune pilote de Zikisso)
export const CUSTOM_MAYORS_MESSAGES: Record<string, MayorMessageData> = {
  Zikisso: {
    commune: 'Zikisso',
    region: 'Lôh-Djiboua',
    nomMaire: 'Le Conseil Municipal de la Commune Pilote de Zikisso',
    titreOfficiel: 'Mairie de la Commune de Zikisso — Territoire Pilote National',
    photoMaireUrl: '',
    citationCle: `« Zikisso, berceau de l'expérimentation citoyenne et pionnière de la transformation digitale communale. »`,
    messageBienvenue: `Chères concitoyennes, chers concitoyens, chers apprenants de toute la Côte d'Ivoire,
  
C’est avec une fierté immense que la Commune de Zikisso vous accueille en tant que laboratoire national d'expérimentation et territoire d’application du MOOC e-Communes.
  
Ici, au cœur du Lôh-Djiboua, nous croyons fermement qu'une collectivité locale prospère repose sur l'harmonie entre ses élus, ses fonctionnaires municipaux et sa jeunesse citoyenne. Chaque cas d'usage étudié — de la numérisation de notre état civil au guichet unique, en passant par le budget participatif — est le reflet de notre ambition pour un service public moderne, intègre et proche du citoyen.
  
À vous tous qui apprenez à nos côtés : soyez persévérants, audacieux et bâtisseurs. La Mairie de Zikisso vous encourage et salue votre noble soif de compétences !`,
    prioritesMunicipales: [
      'Laboratoire territorial du Guichet Unique dématérialisé',
      'Assainissement urbain, salubrité publique et protection environnementale',
      'Promotion de l’Économie Sociale et Solidaire (ESS) et insertion des jeunes',
    ],
  },
  Divo: {
    commune: 'Divo',
    region: 'Lôh-Djiboua',
    nomMaire: 'Mairie de Divo — Chef-lieu de la Région du Lôh-Djiboua',
    titreOfficiel: 'Maire de la Commune de Divo',
    citationCle: `« Mobiliser les compétences pour faire de Divo un pôle d'excellence territoriale et économique. »`,
    messageBienvenue: `La Municipalité de Divo salue et encourage tous les inscrits au MOOC e-Communes. L’avenir de nos cités repose sur des acteurs locaux formés aux meilleures pratiques administratives, budgétaires et citoyennes. Nous suivons avec attention votre parcours d'excellence !`,
    prioritesMunicipales: [
      'Modernisation des infrastructures et désenclavement',
      'Mobilisation optimale des ressources fiscales propres',
      'Renforcement des capacités du personnel communal',
    ],
  },
  Gagnoa: {
    commune: 'Gagnoa',
    region: 'Gôh',
    nomMaire: 'Mairie de Gagnoa',
    titreOfficiel: 'Maire de la Commune de Gagnoa',
    citationCle: `« La formation continue au cœur de notre contrat de confiance avec les populations. »`,
    messageBienvenue: `La Commune de Gagnoa félicite l'ensemble des apprenants. Se former, c'est préparer le terrain d'un service public communal performant et dévoué aux usagers. Plein succès à chacune et à chacun !`,
    prioritesMunicipales: [
      'Développement urbain durable et salubrité',
      'Inclusion numérique et guichet de proximité',
      'Dialogue communautaire et cohésion sociale',
    ],
  },
  Cocody: {
    commune: 'Cocody',
    region: "District d'Abidjan",
    nomMaire: 'Mairie de Cocody',
    titreOfficiel: 'Maire de la Commune de Cocody',
    citationCle: `« L'innovation municipale au service du citoyen et de la ville durable. »`,
    messageBienvenue: `La Commune de Cocody encourage chaleureusement tous les participants au MOOC e-Communes. La transition écologique et l'administration électronique sont les défis majeurs de notre siècle : votre apprentissage est notre plus bel atout collectif !`,
    prioritesMunicipales: [
      'Smart City et transition numérique des formalités',
      'Aménagement durable et espaces verts partagés',
      'Soutien à l’entrepreneuriat jeune et féminin',
    ],
  },
  Bouaké: {
    commune: 'Bouaké',
    region: 'Gbêkê',
    nomMaire: 'Mairie de Bouaké',
    titreOfficiel: 'Maire de la Commune de Bouaké',
    citationCle: `« Renaissance et dynamisme communal par le savoir et l'action citoyenne. »`,
    messageBienvenue: `Au nom de la Commune de Bouaké, carrefour d'échanges et de fraternité, nous souhaitons une pleine réussite à tous les auditeurs du MOOC e-Communes. Bâtissons ensemble des collectivités résilientes et prospères !`,
    prioritesMunicipales: [
      'Reconstruction et relance économique locale',
      'Gestion moderne des marchés et recettes communales',
      'Engagement civique et formation professionnelle',
    ],
  },
};
