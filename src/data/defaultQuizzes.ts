import type { QuizQuestion } from '../types';

export const DEFAULT_QUIZZES: Record<string, QuizQuestion[]> = {
  'semaine-1': [
    {
      question: "En Côte d'Ivoire, quel est le statut juridique d'une commune comme celle de Zikisso ?",
      options: [
        "Un simple démembrement déconcentré du ministère de l'Intérieur",
        "Une collectivité territoriale dotée de la personnalité morale et de l'autonomie financière",
        "Une entreprise publique à vocation commerciale",
        "Une chefferie traditionnelle sans compétences administratives"
      ],
      correctAnswer: 1,
      explanation: "Selon la loi ivoirienne sur la décentralisation, la commune est une collectivité territoriale jouissant de la personnalité morale et de l'autonomie de gestion financière."
    },
    {
      question: "Quel organe communal est chargé de voter le budget et les délibérations municipales ?",
      options: [
        "Le Conseil municipal",
        "Le Sous-préfet seul",
        "Le receveur municipal",
        "La commission électorale"
      ],
      correctAnswer: 0,
      explanation: "Le Conseil municipal est l'organe délibérant élu de la commune. Il débat et vote les décisions collectives, notamment le budget primitif."
    },
    {
      question: "Qui est le chef de l'administration municipale et l'ordonnateur principal du budget communal ?",
      options: [
        "Le Secrétaire Général de la Préfecture",
        "Le Maire de la commune",
        "Le Trésorier général",
        "Le Directeur technique"
      ],
      correctAnswer: 1,
      explanation: "Le Maire est à la fois l'exécutif de la commune, le chef des services administratifs municipaux et l'ordonnateur des recettes et des dépenses."
    },
    {
      question: "Quel rôle exerce la tutelle préfectorale sur les actes pris par la mairie ?",
      options: [
        "Une gestion financière directe à la place du maire",
        "Un contrôle de légalité a posteriori pour s'assurer de la conformité aux lois de la République",
        "La nomination de tous les conseillers municipaux",
        "La révocation immédiate sans motif légal"
      ],
      correctAnswer: 1,
      explanation: "Dans le cadre de la décentralisation, la tutelle administrative exerce un contrôle de légalité afin de garantir que les délibérations et arrêtés respectent les lois nationales."
    },
    {
      question: "Quelle compétence relève typiquement du champ d'action de la mairie de Zikisso ?",
      options: [
        "La défense nationale et le commandement des armées",
        "L'émission de la monnaie",
        "La tenue des registres de l'état civil (naissances, mariages, décès)",
        "La politique étrangère"
      ],
      correctAnswer: 2,
      explanation: "La gestion de l'état civil, de la salubrité publique, de la voirie locale et des marchés communaux figure au premier rang des compétences de proximité de la mairie."
    }
  ],

  'semaine-2': [
    {
      question: "Qu'est-ce que le principe d'équilibre budgétaire pour une collectivité locale ?",
      options: [
        "Les dépenses doivent obligatoirement dépasser les recettes pour stimuler l'économie",
        "Le total des recettes prévues doit être égal ou supérieur au total des dépenses prévues",
        "La commune n'a pas le droit d'engager la moindre dépense",
        "Le budget ne concerne que le salaire des agents"
      ],
      correctAnswer: 1,
      explanation: "Le budget d'une commune doit être voté en équilibre réel entre les recettes et les dépenses, tant en section de fonctionnement qu'en investissement."
    },
    {
      question: "Laquelle de ces ressources constitue une recette fiscale propre de la commune ?",
      options: [
        "L'impôt sur les bénéfices des multinationales pétrolières",
        "La taxe municipale d'occupation du domaine public et les taxes de marché",
        "Les droits de douane maritimes",
        "Les réserves de change de la BCEAO"
      ],
      correctAnswer: 1,
      explanation: "Les taxes foraines, droits de place sur les marchés de Zikisso et redevances d'occupation du domaine public constituent des ressources fiscales directes de la mairie."
    },
    {
      question: "Qui est chargé du recouvrement effectif des fonds et du paiement des mandats communaux ?",
      options: [
        "Le Maire",
        "Le Trésorier municipal (comptable public)",
        "Le premier adjoint au maire",
        "Le chef de quartier"
      ],
      correctAnswer: 1,
      explanation: "En vertu du principe de séparation de l'ordonnateur et du comptable, le Maire ordonne la dépense et le Trésorier (comptable public) exécute le paiement."
    },
    {
      question: "Que finance prioritairement la section de fonctionnement du budget communal ?",
      options: [
        "La construction d'un nouveau dispensaire ou d'un lycée",
        "Les salaires des agents, le carburant, les fournitures et l'entretien courant",
        "L'achat d'un satellite spatial",
        "Le remboursement des dettes de l'État central"
      ],
      correctAnswer: 1,
      explanation: "La section de fonctionnement couvre les charges récurrentes et indispensables à la marche quotidienne de l'administration communale."
    },
    {
      question: "Pourquoi la transparence et la reddition des comptes budgétaires sont-elles capitales à Zikisso ?",
      options: [
        "Pour dissuader les citoyens de payer leurs impôts",
        "Pour renforcer la confiance citoyenne et justifier l'usage des deniers publics au service du développement",
        "Pour alourdir inutilement les démarches administratives",
        "Pour supprimer le Conseil municipal"
      ],
      correctAnswer: 1,
      explanation: "La transparence budgétaire légitime l'action publique, améliore le consentement à l'impôt et favorise la participation des habitants aux priorités locales."
    }
  ],

  'semaine-3': [
    {
      question: "Quel document officiel constitue la preuve juridique de l'existence légale d'un citoyen ?",
      options: [
        "Un carnet de notes scolaires",
        "L'acte de naissance enregistré à l'état civil communal",
        "Une attestation sur l'honneur rédigée à la main",
        "Un badge professionnel"
      ],
      correctAnswer: 1,
      explanation: "L'acte de naissance délivré par le centre d'état civil communal est le document fondamental attestant l'identité et les droits civiques du citoyen."
    },
    {
      question: "Quel est l'enjeu majeur de l'urbanisme et du lotissement concerté dans une ville comme Zikisso ?",
      options: [
        "Empêcher toute nouvelle construction",
        "Planifier un développement spatial harmonieux, sécurisé, avec accès aux réseaux d'eau, d'électricité et de voirie",
        "Créer des zones inondables sans assainissement",
        "Vendre des terrains communaux sans registre légal"
      ],
      correctAnswer: 1,
      explanation: "L'urbanisme communal vise à structurer l'espace urbain, prévenir l'habitat précaire et doter les quartiers des équipements sociocommunautaires essentiels."
    },
    {
      question: "Quelle mesure permet d'améliorer la salubrité publique et la gestion des déchets sur la commune ?",
      options: [
        "Brûler tous les déchets plastiques en plein centre-ville",
        "Instaurer des points de collecte réguliers, sensibiliser les riverains et organiser le curage des caniveaux",
        "Interdire le nettoyage des marchés",
        "Déverser les eaux usées dans les cours d'eau potables"
      ],
      correctAnswer: 1,
      explanation: "Une politique de salubrité efficace combine l'organisation logistique du ramassage, l'entretien des ouvrages d'évacuation et l'engagement citoyen éco-responsable."
    },
    {
      question: "Quelle est la responsabilité du maire en matière de police municipale administrative ?",
      options: [
        "Maintenir le bon ordre, la sûreté, la tranquillité et la salubrité publiques sur le territoire communal",
        "Juger les crimes au tribunal",
        "Voter les lois à l'Assemblée nationale",
        "Réguler le commerce international"
      ],
      correctAnswer: 0,
      explanation: "Les pouvoirs de police administrative confèrent au maire la mission de garantir la tranquillité, la sécurité et la salubrité pour tous les administrés."
    },
    {
      question: "En cas de litige foncier coutumier, quelle démarche est préconisée pour la mairie ?",
      options: [
        "Ignorer les parties prenantes et imposer une solution unilatérale",
        "Favoriser la médiation concertée associant la chefferie coutumière, les élus et les services du cadastre",
        "Détruire immédiatement les cultures sans concertation",
        "Transférer le dossier hors de la région sans examen"
      ],
      correctAnswer: 1,
      explanation: "Le dialogue social entre autorités traditionnelles et administration municipale est le gage d'une résolution pacifique et pérenne des tensions foncières."
    }
  ],

  'semaine-4': [
    {
      question: "Quel est l'objectif premier de la transformation digitale des services d'une mairie de province ?",
      options: [
        "Remplacer tous les employés municipaux par des ordinateurs",
        "Rapprocher l'administration des citoyens en simplifiant les démarches et en réduisant les délais de traitement",
        "Obliger chaque citoyen à acheter un ordinateur dernier cri",
        "Fermer les guichets physiques de la mairie"
      ],
      correctAnswer: 1,
      explanation: "La transformation digitale vise à moderniser le service public, accélérer la délivrance des actes (état civil, légalisations) et accroître l'accessibilité."
    },
    {
      question: "Comment lutter efficacement contre la fracture numérique au sein de la population de Zikisso ?",
      options: [
        "Supprimer toute assistance humaine au guichet",
        "Mettre en place des points d'accès numériques accompagnés et des interfaces adaptées au smartphone",
        "Exiger des démarches uniquement en langue étrangère",
        "Facturer des frais très élevés pour les demandes en ligne"
      ],
      correctAnswer: 1,
      explanation: "L'inclusion numérique nécessite des relais d'accompagnement humain pour les administrés peu familiarisés avec les outils connectés."
    },
    {
      question: "Laquelle de ces applications illustre un dispositif de démocratie participative digitale ?",
      options: [
        "Une boîte de suggestions et de signalement citoyen (voirie, pannes) sur application mobile ou SMS",
        "Un jeu vidéo payant",
        "Une boîte email réservée uniquement au maire",
        "Un site inaccessible depuis les téléphones"
      ],
      correctAnswer: 0,
      explanation: "Les plateformes citoyennes permettent aux habitants de signaler des dysfonctionnements locaux et d'exprimer leurs avis sur les projets de quartier."
    },
    {
      question: "Dans le cadre de l'e-administration, que garantit la signature et la traçabilité électronique des actes ?",
      options: [
        "Aucune valeur juridique",
        "L'authenticité du document et la lutte contre la fraude documentaire",
        "L'effacement automatique des archives",
        "Le ralentissement des validations"
      ],
      correctAnswer: 1,
      explanation: "La numérisation sécurisée limite les falsifications, sécurise l'enregistrement des actes et assure une conservation pérenne des données communales."
    },
    {
      question: "Quel indicateur permet d'évaluer le succès d'un projet de digitalisation municipale ?",
      options: [
        "Le nombre de documents papier perdus",
        "Le taux de satisfaction des usagers et le délai moyen d'obtention de leurs documents administratifs",
        "Le coût maximal dépensé sans résultat",
        "L'abandon des usagers face aux pannes répétées"
      ],
      correctAnswer: 1,
      explanation: "L'efficacité d'un service numérique communal se mesure au gain de temps, à la fiabilité et au niveau de satisfaction exprimé par les usagers."
    }
  ],

  'module-bonus': [
    {
      question: "Quel est le premier réflexe de cybersécurité pour sécuriser l'accès aux postes de travail de la mairie ?",
      options: [
        "Écrire son mot de passe sur un post-it collé sur l'écran",
        "Utiliser un mot de passe robuste, unique, et verrouiller sa session lors de chaque absence",
        "Partager ses identifiants avec tous ses collègues et visiteurs",
        "Ne jamais éteindre son ordinateur"
      ],
      correctAnswer: 1,
      explanation: "La robustesse des mots de passe et le verrouillage systématique de l'écran préviennent les accès illicites aux données confidentielles de la commune."
    },
    {
      question: "Que désigne une attaque par hameçonnage (phishing) reçue par un agent communal ?",
      options: [
        "Un virus qui détruit physiquement le clavier",
        "Un courriel frauduleux imitant une institution légitime pour dérober des identifiants ou propager un rançongiciel",
        "Une mise à jour automatique de sécurité",
        "Une coupure générale du réseau électrique"
      ],
      correctAnswer: 1,
      explanation: "Le phishing tente d'induire l'agent en erreur en l'incitant à cliquer sur un lien malveillant ou à transmettre des codes confidentiels."
    },
    {
      question: "Pourquoi est-il crucial d'effectuer des sauvegardes régulières (sur disque externe sécurisé ou cloud souverain) des fichiers de la mairie ?",
      options: [
        "Pour encombrer les disques durs",
        "Pour garantir la continuité de service et la récupération des données en cas de panne matérielle ou cyberattaque",
        "Pour empêcher les agents de consulter leurs dossiers",
        "Pour annuler les décisions du Conseil municipal"
      ],
      correctAnswer: 1,
      explanation: "Une politique de sauvegarde régulière et testée évite la perte irrémédiable des registres administratifs et des documents communaux stratégiques."
    },
    {
      question: "Que prévoit la réglementation sur la protection des données personnelles administratives ?",
      options: [
        "La vente libre des données d'état civil des habitants à des entreprises commerciales",
        "Le respect de la confidentialité, la limitation des finalités de collecte et la sécurité des données privées",
        "La publication sur les réseaux sociaux de tous les salaires et dossiers médicaux des agents",
        "L'interdiction totale d'utiliser l'informatique"
      ],
      correctAnswer: 1,
      explanation: "Les données des usagers recueillies par la mairie doivent être strictement protégées, confidentielles et utilisées uniquement pour leurs missions de service public."
    },
    {
      question: "Quel outil collaboratif gratuit ou open-source est adapté pour planifier les réunions de commissions municipales ?",
      options: [
        "Un agenda partagé en ligne avec notifications de calendrier",
        "L'envoi de lettres physiques recommandées pour chaque réunion ordinaire",
        "L'absence totale de calendrier",
        "Un logiciel piraté et non mis à jour"
      ],
      correctAnswer: 0,
      explanation: "Les agendas partagés et messageries sécurisées simplifient la coordination entre élus, directions techniques et partenaires communaux."
    }
  ],

  'examen-final': [
    {
      question: "Quelle est la définition fondamentale d'une collectivité locale décentralisée en Côte d'Ivoire ?",
      options: [
        "Une entité territoriale dotée de la personnalité juridique, d'organes élus et de l'autonomie financière sous tutelle de l'État",
        "Une simple subdivision ministérielle sans pouvoir d'initiative",
        "Une association privée à but non lucratif",
        "Un territoire administré uniquement par l'armée"
      ],
      correctAnswer: 0,
      explanation: "La décentralisation confère aux collectivités locales la personnalité morale, l'autonomie de gestion et des compétences propres sous le contrôle de légalité de l'État."
    },
    {
      question: "Quel principe budgétaire exige que toutes les recettes et toutes les dépenses soient inscrites dans un document unique ?",
      options: [
        "Le principe de l'unité budgétaire",
        "Le principe de spécialité",
        "Le principe de caducité",
        "Le principe de gratuité"
      ],
      correctAnswer: 0,
      explanation: "Le principe de l'unité budgétaire impose que l'ensemble des opérations financières de la commune figure dans un seul et même document prévisionnel."
    },
    {
      question: "Quel acteur public détient la compétence exclusive du maniement des deniers publics communaux ?",
      options: [
        "Le Maire",
        "Le Trésorier municipal (comptable public assermenté)",
        "Le Secrétaire Général de mairie",
        "Le chef du village le plus peuplé"
      ],
      correctAnswer: 1,
      explanation: "Seul le comptable public (Trésorier) a la responsabilité personnelle et pécuniaire de manipuler les fonds, encaisser les recettes et payer les dépenses de la commune."
    },
    {
      question: "Dans le cadre de la numérisation des services communaux de Zikisso, quelle condition est indispensable pour éviter l'exclusion des citoyens ?",
      options: [
        "Le maintien d'un guichet d'assistance physique et d'un accompagnement personnalisé pour les personnes non connectées",
        "L'interdiction formelle de se présenter physiquement à la mairie",
        "L'obligation de payer les certificats en cryptomonnaie",
        "La fermeture des permanences d'état civil"
      ],
      correctAnswer: 0,
      explanation: "L'inclusion sociale et administrative impose d'accompagner les administrés éloignés du numérique grâce à des médiateurs municipaux."
    },
    {
      question: "Quelle attitude adopter immédiatement en cas de réception d'un email suspect demandant le virement d'un marché public communal ?",
      options: [
        "Effectuer le virement immédiatement sans poser de question",
        "Vérifier par canal téléphonique officiel auprès du bénéficiaire et alerter le responsable informatique de la mairie",
        "Transférer le courriel sur sa boîte personnelle pour le lire plus tard",
        "Supprimer tous les fichiers de l'ordinateur"
      ],
      correctAnswer: 1,
      explanation: "La vérification directe hors ligne et le signalement aux équipes techniques permettent d'éviter les fraudes au président ou aux faux ordres de virement."
    },
    {
      question: "Quel organe délibérant vote le budget primitif et approuve le compte administratif de la commune de Zikisso ?",
      options: [
        "Le Conseil municipal réuni en session ordinaire",
        "Le Sous-préfet statuant en référé",
        "Le directeur des services financiers seul",
        "La chambre de commerce régionale"
      ],
      correctAnswer: 0,
      explanation: "Le Conseil municipal est l'assemblée souveraine élue qui délibère sur les affaires de la commune, vote les budgets et autorise les investissements."
    },
    {
      question: "Laquelle de ces taxes constitue une ressource fiscale propre directe pour la mairie de Zikisso ?",
      options: [
        "La taxe municipale d'occupation du domaine public (ODP) et les droits de place du grand marché",
        "La taxe sur la valeur ajoutée (TVA) nationale perçue aux frontières",
        "L'impôt général sur le revenu versé au Trésor national",
        "Les droits de chancellerie des ambassades"
      ],
      correctAnswer: 0,
      explanation: "Les droits de place sur les marchés communaux et redevances d'occupation du domaine public constituent des recettes fiscales directes de la mairie."
    },
    {
      question: "Quelle autorité exerce les pouvoirs de police administrative municipale sur le territoire communal ?",
      options: [
        "Le Maire de la commune",
        "Le juge d'instruction",
        "Le président du tribunal de commerce",
        "Le ministre des Affaires étrangères"
      ],
      correctAnswer: 0,
      explanation: "Le Maire est investi des pouvoirs de police administrative pour assurer le bon ordre, la sûreté, la tranquillité et la salubrité publiques."
    },
    {
      question: "Quel acte fondamental d'état civil conditionne l'accès aux droits civiques et à l'identité légale de chaque enfant né à Zikisso ?",
      options: [
        "L'acte de naissance régulièrement transcrit dans le registre communal",
        "Le bulletin trimestriel de l'école primaire",
        "Une attestation coutumière non signée",
        "Un abonnement téléphonique prépayé"
      ],
      correctAnswer: 0,
      explanation: "L'enregistrement à l'état civil communal et la délivrance de l'acte de naissance confèrent à l'enfant sa personnalité juridique et son identité républicaine."
    },
    {
      question: "Quelle méthode garantit la réussite d'un plan d'aménagement urbain et d'assainissement communal ?",
      options: [
        "Une démarche concertée associant comités de quartier, chefferie coutumière, élus et services techniques",
        "L'expulsion sans concertation de tous les commerçants du marché",
        "L'abandon du curage des caniveaux à la saison des pluies",
        "L'interdiction de construire tout bâtiment public"
      ],
      correctAnswer: 0,
      explanation: "La concertation avec les riverains et les leaders communautaires assure l'appropriation civique et la pérennité des aménagements urbains."
    },
    {
      question: "En matière de gestion des données des citoyens, quelle règle d'or de cybersécurité s'impose à chaque agent municipal ?",
      options: [
        "Verrouiller systématiquement sa session informatique lors de tout éloignement du poste et ne jamais divulguer ses identifiants",
        "Afficher son mot de passe sur le comptoir d'accueil pour dépanner ses collègues",
        "Utiliser le mot de passe '123456' sur tous les logiciels",
        "Désactiver l'antivirus pour accélérer l'ordinateur"
      ],
      correctAnswer: 0,
      explanation: "Le verrouillage d'écran et la confidentialité stricte des mots de passe protègent les données personnelles des administrés contre les fuites et usurpations."
    },
    {
      question: "Quel mécanisme participatif favorise la transparence et le consentement des citoyens aux politiques municipales de Zikisso ?",
      options: [
        "L'organisation d'audiences publiques budgétaires et la publication simplifiée des comptes communaux",
        "Le secret absolu sur les délibérations du conseil municipal",
        "L'interdiction aux citoyens d'assister aux réunions publiques",
        "La suppression des registres de doléances"
      ],
      correctAnswer: 0,
      explanation: "La reddition des comptes et les débats d'orientation budgétaire ouverts légitiment l'impôt et renforcent le civisme fiscal des administrés."
    }
  ],
  'examFinal': [
    {
      question: "Quelle est la définition fondamentale d'une collectivité locale décentralisée en Côte d'Ivoire ?",
      options: [
        "Une entité territoriale dotée de la personnalité juridique, d'organes élus et de l'autonomie financière sous tutelle de l'État",
        "Une simple subdivision ministérielle sans pouvoir d'initiative",
        "Une association privée à but non lucratif",
        "Un territoire administré uniquement par l'armée"
      ],
      correctAnswer: 0,
      explanation: "La décentralisation confère aux collectivités locales la personnalité morale, l'autonomie de gestion et des compétences propres sous le contrôle de légalité de l'État."
    },
    {
      question: "Quel principe budgétaire exige que toutes les recettes et toutes les dépenses soient inscrites dans un document unique ?",
      options: [
        "Le principe de l'unité budgétaire",
        "Le principe de spécialité",
        "Le principe de caducité",
        "Le principe de gratuité"
      ],
      correctAnswer: 0,
      explanation: "Le principe de l'unité budgétaire impose que l'ensemble des opérations financières de la commune figure dans un seul et même document prévisionnel."
    },
    {
      question: "Quel acteur public détient la compétence exclusive du maniement des deniers publics communaux ?",
      options: [
        "Le Maire",
        "Le Trésorier municipal (comptable public assermenté)",
        "Le Secrétaire Général de mairie",
        "Le chef du village le plus peuplé"
      ],
      correctAnswer: 1,
      explanation: "Seul le comptable public (Trésorier) a la responsabilité personnelle et pécuniaire de manipuler les fonds, encaisser les recettes et payer les dépenses de la commune."
    },
    {
      question: "Dans le cadre de la numérisation des services communaux de Zikisso, quelle condition est indispensable pour éviter l'exclusion des citoyens ?",
      options: [
        "Le maintien d'un guichet d'assistance physique et d'un accompagnement personnalisé pour les personnes non connectées",
        "L'interdiction formelle de se présenter physiquement à la mairie",
        "L'obligation de payer les certificats en cryptomonnaie",
        "La fermeture des permanences d'état civil"
      ],
      correctAnswer: 0,
      explanation: "L'inclusion sociale et administrative impose d'accompagner les administrés éloignés du numérique grâce à des médiateurs municipaux."
    },
    {
      question: "Quelle attitude adopter immédiatement en cas de réception d'un email suspect demandant le virement d'un marché public communal ?",
      options: [
        "Effectuer le virement immédiatement sans poser de question",
        "Vérifier par canal téléphonique officiel auprès du bénéficiaire et alerter le responsable informatique de la mairie",
        "Transférer le courriel sur sa boîte personnelle pour le lire plus tard",
        "Supprimer tous les fichiers de l'ordinateur"
      ],
      correctAnswer: 1,
      explanation: "La vérification directe hors ligne et le signalement aux équipes techniques permettent d'éviter les fraudes au président ou aux faux ordres de virement."
    },
    {
      question: "Quel organe délibérant vote le budget primitif et approuve le compte administratif de la commune de Zikisso ?",
      options: [
        "Le Conseil municipal réuni en session ordinaire",
        "Le Sous-préfet statuant en référé",
        "Le directeur des services financiers seul",
        "La chambre de commerce régionale"
      ],
      correctAnswer: 0,
      explanation: "Le Conseil municipal est l'assemblée souveraine élue qui délibère sur les affaires de la commune, vote les budgets et autorise les investissements."
    },
    {
      question: "Laquelle de ces taxes constitue une ressource fiscale propre directe pour la mairie de Zikisso ?",
      options: [
        "La taxe municipale d'occupation du domaine public (ODP) et les droits de place du grand marché",
        "La taxe sur la valeur ajoutée (TVA) nationale perçue aux frontières",
        "L'impôt général sur le revenu versé au Trésor national",
        "Les droits de chancellerie des ambassades"
      ],
      correctAnswer: 0,
      explanation: "Les droits de place sur les marchés communaux et redevances d'occupation du domaine public constituent des recettes fiscales directes de la mairie."
    },
    {
      question: "Quelle autorité exerce les pouvoirs de police administrative municipale sur le territoire communal ?",
      options: [
        "Le Maire de la commune",
        "Le juge d'instruction",
        "Le président du tribunal de commerce",
        "Le ministre des Affaires étrangères"
      ],
      correctAnswer: 0,
      explanation: "Le Maire est investi des pouvoirs de police administrative pour assurer le bon ordre, la sûreté, la tranquillité et la salubrité publiques."
    },
    {
      question: "Quel acte fondamental d'état civil conditionne l'accès aux droits civiques et à l'identité légale de chaque enfant né à Zikisso ?",
      options: [
        "L'acte de naissance régulièrement transcrit dans le registre communal",
        "Le bulletin trimestriel de l'école primaire",
        "Une attestation coutumière non signée",
        "Un abonnement téléphonique prépayé"
      ],
      correctAnswer: 0,
      explanation: "L'enregistrement à l'état civil communal et la délivrance de l'acte de naissance confèrent à l'enfant sa personnalité juridique et son identité républicaine."
    },
    {
      question: "Quelle méthode garantit la réussite d'un plan d'aménagement urbain et d'assainissement communal ?",
      options: [
        "Une démarche concertée associant comités de quartier, chefferie coutumière, élus et services techniques",
        "L'expulsion sans concertation de tous les commerçants du marché",
        "L'abandon du curage des caniveaux à la saison des pluies",
        "L'interdiction de construire tout bâtiment public"
      ],
      correctAnswer: 0,
      explanation: "La concertation avec les riverains et les leaders communautaires assure l'appropriation civique et la pérennité des aménagements urbains."
    },
    {
      question: "En matière de gestion des données des citoyens, quelle règle d'or de cybersécurité s'impose à chaque agent municipal ?",
      options: [
        "Verrouiller systématiquement sa session informatique lors de tout éloignement du poste et ne jamais divulguer ses identifiants",
        "Afficher son mot de passe sur le comptoir d'accueil pour dépanner ses collègues",
        "Utiliser le mot de passe '123456' sur tous les logiciels",
        "Désactiver l'antivirus pour accélérer l'ordinateur"
      ],
      correctAnswer: 0,
      explanation: "Le verrouillage d'écran et la confidentialité stricte des mots de passe protègent les données personnelles des administrés contre les fuites et usurpations."
    },
    {
      question: "Quel mécanisme participatif favorise la transparence et le consentement des citoyens aux politiques municipales de Zikisso ?",
      options: [
        "L'organisation d'audiences publiques budgétaires et la publication simplifiée des comptes communaux",
        "Le secret absolu sur les délibérations du conseil municipal",
        "L'interdiction aux citoyens d'assister aux réunions publiques",
        "La suppression des registres de doléances"
      ],
      correctAnswer: 0,
      explanation: "La reddition des comptes et les débats d'orientation budgétaire ouverts légitiment l'impôt et renforcent le civisme fiscal des administrés."
    }
  ]
};
