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
  // =========================================================================
  // SEMAINE 1 : CADRE INSTITUTIONNEL, ACTEURS ET DÉCENTRALISATION
  // =========================================================================
  'semaine-1': {
    id: 'semaine-1',
    ordre: 1,
    titre: "Cadre Institutionnel, Acteurs et Décentralisation en Côte d'Ivoire",
    objectifs: [
      "Maîtriser les fondements juridiques et l'architecture de la loi n° 2012-1128 du 13 décembre 2012.",
      "Distinguer rigoureusement les attributions du Conseil Municipal, de la Municipalité et du Maire.",
      "Gérer la dualité des fonctions du Maire : agent de la collectivité décentralisée vs représentant de l'État.",
      "Sécuriser la légalité des actes administratifs face au contrôle de tutelle préfectorale de Lakota."
    ],
    capsules: [
      {
        id: '1.1',
        title: "La loi n° 2012-1128 et l'architecture de la décentralisation ivoirienne",
        dureeMinutes: 10,
        content: `### 1. Genèse et finalités de la refondation territoriale

La décentralisation ivoirienne repose sur la **loi n° 2012-1128 du 13 décembre 2012** portant orientation générale de l'organisation générale de l'administration territoriale, modifiée et complétée par les décrets d'application subséquents. Ce texte fondamental a mis fin à l'enchevêtrement institutionnel antérieur en rationalisant le territoire national autour de deux niveaux exclusifs de collectivités territoriales de plein exercice : les **Régions** et les **Communes**, aux côtés des deux entités particulières à statut dérogatoire que sont les **Districts Autonomes** d'Abidjan et de Yamoussoukro.

Le législateur constitutionnel a consacré le principe de **libre administration des collectivités territoriales** (Article 170 de la Constitution de 2016). Ce principe garantit à la Commune la personnalité juridique morale, un patrimoine propre, des organes délibérants et exécutifs élus démocratiquement, des compétences légalement dévolues et une autonomie financière réelle pour impulser le développement économique et social local.

### 2. Le périmètre des compétences transférées par l'État

Aux termes de la loi, la décentralisation opère un transfert progressif de 16 domaines de compétences réparties entre l'État, les Régions et les Communes. La Commune intervient en première ligne sur les compétences de proximité immédiate :
• **Aménagement de l'espace urbain et rural** : élaboration du plan directeur d'urbanisme, plans de lotissement communaux, schéma de circulation.
• **Équipements socioculturels et éducatifs de base** : construction et réhabilitation des écoles primaires publiques, écoles maternelles et cantines scolaires.
• **Santé communautaire et salubrité publique** : gestion des dispensaires municipaux, maternités de proximité, collecte et traitement des ordures ménagères, hygiène des marchés.
• **Infrastructures marchandes et économiques** : édification et gestion des marchés centraux, gares routières, abattoirs municipaux et aires de stationnement.
• **Action sociale et insertion des jeunes** : secours d'urgence, appui aux groupements féminins agricoles et encouragement des initiatives d'Économie Sociale et Solidaire (ESS).

⚖️ **BASE LÉGALE & NORME MINISTÉRIELLE**
Articles 1 à 15 de la loi n° 2012-1128 du 13 décembre 2012. Circulaire interministérielle n° 004/MEMIS/DGDDL relative à l'exercice effectif des compétences dévolues aux communes.

📍 **CAS PRATIQUE ZIKISSO — L'ARTICULATION COMMUNE / RÉGION DU LÔH-DJIBOUA**
Sur le territoire de Zikisso, l'imbrication géographique entre le périmètre communal (qui englobe la ville chef-lieu et ses villages rattachés) et le Conseil Régional du Lôh-Djiboua basé à Divo exige une stricte coordination stratégique.
• La Commune de Zikisso finance prioritairement les écoles primaires de proximité et les pistes de desserte agricole intra-communales.
• Le Conseil Régional du Lôh-Djiboua prend en charge les collèges de proximité, les lycées et les axes structurants interdépartementaux (axe Lakota - Zikisso).
L'élu local doit impérativement éviter le doublon d'investissement en inscrivant ses projets en cohérence avec le Schéma Régional d'Aménagement du Territoire (SRAT).

⚠️ **POINT DE VIGILANCE DE L'ÉLU — LE PRINCIPE D'EXCLUSIVITÉ DES COMPÉTENCES**
Une délibération municipale engageant des fonds communaux pour une compétence relevant exclusivement de l'État régalien (ex: acquisition d'armes de police, diplomatie étrangère) ou de la Région (ex: lycée) est frappée d'incompétence matérielle. Le Préfet de tutelle est tenu de déférer un tel acte devant la chambre administrative de la Cour Suprême pour excès de pouvoir.`
      },
      {
        id: '1.2',
        title: "Les organes de la Commune : Conseil Municipal, Municipalité et Maire",
        dureeMinutes: 12,
        content: `### 1. Le Conseil Municipal : L'organe délibérant souverain

Le **Conseil Municipal** est l'assemblée délibérante souveraine de la commune, élue au suffrage universel direct pour un mandat de 5 ans selon un scrutin de liste à la proportionnelle avec prime majoritaire. Sa composition numérique dépend de la strate démographique de la collectivité (généralement 25 à 55 conseillers).

Le Conseil règle par ses délibérations les affaires de la commune. Ses attributions majeures comprennent :
• Le vote du **Budget Primitif (BP)** annuel, des budgets modificatifs et l'approbation du **Compte Administratif (CA)**.
• L'adoption du **Programme Triennal d'Investissement**.
• L'approbation des plans d'aménagement urbain, des concessions de service public et des contrats de partenariat public-privé.
• La fixation des tarifs des taxes communales directes (droits de place, stationnement, voirie) dans le respect du Code Général des Impôts.

Le Conseil se réunit obligatoirement au moins une fois par trimestre en session ordinaire sur convocation du Maire. Les séances sont publiques, sauf si l'assemblée décide du huis clos pour des motifs impérieux d'ordre public.

### 2. La Municipalité : L'exécutif collégial restreint

La **Municipalité** est l'organe exécutif collégial composé du Maire et de ses Adjoints au Maire (du 1er au 4e ou 6e adjoint selon la taille de la population). 
• Elle ne détient pas de pouvoir réglementaire autonome direct, mais assure la concertation politique hebdomadaire, prépare l'ordre du jour des sessions du Conseil et suit l'exécution des délibérations.
• Les Adjoints reçoivent des délégations expresses de signature et de fonction accordées par arrêté du Maire (ex: délégation à l'état civil, aux finances, aux travaux ou à l'environnement).

### 3. Le statut d'exception du Maire : La double casquette républicaine

Le Maire occupe une place singulière au sommet de l'administration locale, matérialisée par un dédoublement fonctionnel :
1. **En tant que chef de l'exécutif communal décentralisé** :
   • Il est le seul ordonnateur principal des recettes et des dépenses de la commune.
   • Il est le chef suprême de l'administration municipale : il nomme aux emplois communaux et dispose du pouvoir hiérarchique sur l'ensemble du personnel contractuel et détaché.
   • Il représente la commune en justice et dans tous les actes de la vie civile (signature des marchés publics, des conventions de parrainage et de jumelage).

2. **En tant qu'agent de l'État dans la circonscription communale (autorité déconcentrée)** :
   • **Officier de l'État Civil** : il assure la tenue des registres, la célébration solennelle des mariages républicains et la délivrance des actes de naissance et de décès.
   • **Officier de Police Judiciaire (OPJ)** : sous l'autorité du Procureur de la République.
   • **Autorité de Police Administrative Municipale** : il a la charge d'assurer le bon ordre, la sûreté, la sécurité et la salubrité publiques sur l'ensemble du territoire communal (Article 71 de la loi 2012-1128).

⚖️ **RÉFÉRENCES RÉGLEMENTAIRES**
Articles 25 à 88 de la loi n° 2012-1128. Décret n° 2013-477 fixant les indemnités de fonction et le régime des congés des élus locaux ivoiriens.

⚠️ **POINT DE VIGILANCE — LA DÉLÉGATION DE POUVOIR N'EST PAS UN ABANDON DE RESPONSABILITÉ**
Même lorsqu'un Maire délègue ses attributions d'état civil ou de gestion des marchés à un Adjoint par arrêté municipal, sa responsabilité juridique et politique personnelle demeure engagée. Le Maire conserve un pouvoir d'évocation permanente et peut réformer à tout instant les actes pris par ses délégataires.`
      },
      {
        id: '1.3',
        title: "Le contrôle de tutelle administrative et le déféré préfectoral",
        dureeMinutes: 10,
        content: `### 1. La nature moderne de la tutelle en droit ivoirien

Dans un État unitaire décentralisé comme la Côte d'Ivoire, l'autonomie communale ne signifie en aucun cas l'indépendance. L'État veille au respect de la légalité républicaine, de l'intérêt général et de la cohérence des politiques publiques nationales par le biais de la **tutelle administrative**.

La tutelle n'est pas un pouvoir hiérarchique : l'autorité de tutelle ne peut ni adresser d'injonctions directes au Conseil Municipal, ni se substituer au Maire, sauf dans les cas d'urgence expressément prévus par la loi (ex: carence manifeste en matière de police de la salubrité menaçant la santé publique).
Pour la Commune de Zikisso, la **tutelle rapprochée** est exercée par le Préfet du Département de Lakota, assisté du Sous-Préfet de Zikisso, sous l'autorité supérieure du Ministère de l'Intérieur et de la Sécurité (Direction Générale de la Décentralisation et du Développement Local - DGDDL).

### 2. Le régime des actes soumis à approbation préalable vs transmission simple

L'allègement de la tutelle issu des réformes successives distingue désormais deux régimes d'actes :
• **Actes exécutoires de plein droit dès transmission** : Les arrêtés municipaux de gestion courante, les délibérations ne touchant pas aux matières financières sensibles deviennent exécutoires dès leur transmission officielle à la Préfecture et leur affichage en mairie.
• **Actes soumis à approbation préalable expresse de la tutelle** :
  1. Le Budget Primitif et les décisions modificatives budgétaires.
  2. Le Compte Administratif du Maire.
  3. Les baux d'une durée supérieure à 18 ans et les aliénations du patrimoine immobilier communal.
  4. Les emprunts et les garanties d'emprunt bancaires.
  5. Les conventions de coopération décentralisée ou internationale.

### 3. La procédure du déféré préfectoral

Lorsque le Préfet estime qu'une délibération municipale ou un arrêté du Maire est entaché d'illégalité (violation d'une loi, incompétence, détournement de pouvoir), il met en œuvre la procédure du **contrôle de légalité** :
1. **Le recours gracieux** : Le Préfet invite le Maire par écrit motivé à retirer ou modifier l'acte litigieux dans un délai réglementaire (généralement 15 à 30 jours).
2. **Le déféré juridictionnel** : Si la commune refuse d'abroger son acte, le Préfet défère la décision devant la juridiction administrative compétente (Chambre administrative de la Cour Suprême). Le Préfet peut y assortir une demande de sursis à exécution si l'acte présente un péril grave.

📍 **CAS PRATIQUE ZIKISSO — GESTION DES CONFLITS D'USAGE SUR LES PISTES AGRICOLES**
À Zikisso, un arrêté municipal visant à interdire la circulation des camions de collecte de cacao de fort tonnage durant la saison des pluies pour préserver les pistes en terre doit être rédigé avec minutie. S'il n'est pas assorti d'itinéraires de déviation ou s'il entrave la liberté fondamentale de commerce sans motif de sécurité impérieux, il s'expose à une annulation immédiate pour disproportion par le Préfet de Lakota.

💡 **RECOMMANDATION STRATÉGIQUE UVICOCI**
La Mairie doit instaurer une relation de confiance et de concertation préventive avec les services de la Préfecture. Soumettre les projets d'arrêtés sensibles à la relecture informelle du Secrétaire Général de Préfecture en amont du vote désamorce 95% des contentieux de tutelle.`
      },
      {
        id: '1.4',
        title: "Focus Digital : Le portail DGDDL et l'interopérabilité républicaine",
        dureeMinutes: 9,
        content: `### 1. La dématérialisation de la tutelle : vers le zéro papier

Sous l'impulsion du Ministère de l'Intérieur et de la Sécurité, la Côte d'Ivoire déploie une stratégie résolue de digitalisation de la chaîne administrative liant les 201 communes à l'administration centrale.

La plateforme nationale de la **DGDDL (Direction Générale de la Décentralisation et du Développement Local)** et le portail intégré **e-Gouv** transforment radicalement les relations institutionnelles :
• **Télétransmission sécurisée des actes administratifs** : Les délibérations du Conseil Municipal de Zikisso, les budgets votés et les arrêtés sont numérisés, horodatés avec signature électronique certifiée et transmis en quelques secondes à la Préfecture de Lakota et à la DGDDL à Abidjan.
• **Réduction drastique des délais d'approbation** : Les délais de visa préfectoral passent de plusieurs semaines (temps d'acheminement physique par courrier routier) à moins de 72 heures ouvrées grâce aux circuits de validation numériques.
• **Centralisation des statistiques territoriales** : Les données budgétaires, fiscales et d'état civil alimentent automatiquement le tableau de bord national de performance des communes ivoiriennes.

### 2. Le rôle fédérateur de l'UVICOCI dans l'équipement technologique

L'**Union des Villes et Communes de Côte d'Ivoire (UVICOCI)**, en partenariat avec les bailleurs internationaux (Banque Mondiale, Union Européenne, PNUD), accompagne la mise à niveau des parcs informatiques municipaux :
• Octroi de kits de connectivité satellitaire pour les communes de l'intérieur enclavées.
• Déploiement de serveurs locaux d'archivage conformes aux normes de l'Autorité de Régulation des Télécommunications/TIC de Côte d'Ivoire (ARTCI).
• Formation continue des secrétaires généraux et des régisseurs communaux.

💡 **BONNE PRATIQUE DE GOUVERNANCE MUNICIPALE**
La Mairie de Zikisso doit inscrire dans son budget annuel une ligne de maintenance informatique et de formation aux TIC. La numérisation n'est pas un coût d'apparat, mais le premier multiplicateur d'efficacité administrative et de confiance citoyenne.`
      }
    ]
  },

  // =========================================================================
  // SEMAINE 2 : PLANIFICATION LOCALE ET BUDGÉTISATION TERRITORIALE
  // =========================================================================
  'semaine-2': {
    id: 'semaine-2',
    ordre: 2,
    titre: "Planification Locale et Budgétisation Territoriale",
    objectifs: [
      "Maîtriser la méthodologie d'élaboration participative du Plan Triennal d'Investissement.",
      "Structurer le Budget Primitif selon les règles strictes de la nomenclature M57/DGDDL.",
      "Garantir l'équilibre réel entre Section de Fonctionnement et Section d'Investissement.",
      "Respecter les ratios prudentiels nationaux (plafonnement des dépenses de personnel à 40% max)."
    ],
    capsules: [
      {
        id: '2.1',
        title: "Le Plan Triennal d'Investissement, boussole du développement communal",
        dureeMinutes: 11,
        content: `### 1. Définition et nature juridique du Plan Triennal

Le **Plan Triennal d'Investissement** est l'instrument de planification stratégique et pluriannuelle glissante par lequel la commune programme ses investissements matériels et immatériels sur une période de trois exercices budgétaires consécutifs (Année N, N+1 et N+2).

Exigé par la loi organique et les instructions budgétaires de la DGDDL, le Plan Triennal n'est pas un simple catalogue de promesses électorales : c'est un engagement financier juridiquement contraignant qui lie l'exécutif communal au Conseil Municipal et à l'État. Aucun projet d'envergure ne peut être inscrit au Budget Primitif annuel s'il n'a pas été préalablement identifié et validé dans la première tranche du Plan Triennal approuvé par la tutelle.

### 2. La démarche participative d'identification des besoins

Pour être soutenable et légitime, l'élaboration du Plan Triennal doit rompre avec la technocratie de bureau :
1. **Diagnostic territorial partagé** : Recensement rigoureux de l'état des infrastructures existantes dans le chef-lieu de Zikisso et dans l'ensemble des villages du canton (nombre de salles de classe réhabilitables, forages en panne, points noirs d'insalubrité, tronçons de pistes impraticables).
2. **Consultations communautaires préalables** : Organisation d'audiences publiques décentralisées associant la chefferie traditionnelle, les comités villageois de développement (CVD), les associations féminines de vivrier et les coopératives de jeunesse.
3. **Hiérarchisation multicritère des projets** : Arbitrage politique fondé sur l'impact socio-économique immédiat, le coût d'entretien récurrent et le degré d'urgence sanitaire ou éducative.

### 3. La structure type d'une fiche-projet triennale

Chaque opération inscrite au Plan Triennal doit obligatoirement comporter :
• L'intitulé précis et la localisation géographique (ex: *Construction d'un bâtiment de 3 classes + bureau et latrines à l'EPP Makobly, Commune de Zikisso*).
• Le montant total estimé de l'opération TTC, certifié par un devis quantitatif et estimatif (DQE) visé par la Direction Régionale de la Construction ou des Travaux Publics.
• Le plan de financement pluriannuel prévisionnel : autofinancement communal, quote-part du Fonds de Développement Local (FDL), appui de l'État ou cofinancement bailleurs.

⚖️ **CADRE RÉGLEMENTAIRE**
Instruction conjointe n° 002/MEMIS/MEF/DGDDL/DGBF relative à la programmation triennale des opérations des collectivités territoriales.

⚠️ **POINT DE VIGILANCE — LE PIÈGE DE LA SURÉVALUATION FICTIVE**
Il est formellement interdit d'inscrire au Plan Triennal des projets dont le financement repose sur des recettes purement hypothétiques (ex: promesses verbales de donateurs non contractualisées). La tutelle préfectorale rejettera systématiquement tout Plan Triennal dont la première année dépasse les capacités réelles d'autofinancement et de subvention certifiée de la collectivité.`
      },
      {
        id: '2.2',
        title: "La structure du Budget Communal : Fonctionnement vs Investissement",
        dureeMinutes: 12,
        content: `### 1. La règle d'or : L'équilibre réel des deux sections

Le budget de la commune est l'acte par lequel sont prévues et autorisées les recettes et les dépenses annuelles de la collectivité. Il est régi par les principes d'unité, d'universalité, d'annualité, de spécialité des crédits et d'**équilibre réel**.

Le budget se divise de façon rigoureusement étanche en deux sections distinctes qui doivent impérativement s'équilibrer séparément en recettes et en dépenses :

#### A. La Section de Fonctionnement (La gestion quotidienne)
Elle enregistre toutes les opérations récurrentes nécessaires à la vie administrative et technique de la mairie :
• **Dépenses de fonctionnement** : Rémunérations et charges sociales des personnels communaux (permanents et journaliers), fournitures de bureau, carburant et lubrifiants des véhicules de service, entretien des bâtiments communaux, primes d'assurance, indemnités des élus, frais de mission.
• **Recettes de fonctionnement** : Produits des taxes communales directes (marchés, voirie, stationnement), quote-part des impôts partagés de l'État (patente, foncier), droits de délivrance d'actes d'état civil, revenus du domaine municipal.

#### B. La Section d'Investissement (La construction de l'avenir)
Elle regroupe toutes les opérations modifiant la consistance ou la valeur du patrimoine communal :
• **Dépenses d'investissement** : Acquisitions de terrains, construction d'écoles, réhabilitation de centres de santé, ouverture et bitumage de voiries, équipement informatique lourd, acquisition d'engins de collecte des déchets.
• **Recettes d'investissement** : Virement obligatoire prélevé sur l'excédent de la Section de Fonctionnement (autofinancement net), subventions d'équipement de l'État (subvention DGDDL / FDL), emprunts bancaires autorisés, dons et legs en capital.

### 2. Le ratio prudentiel des charges de personnel (Plafond des 40%)

Pour préserver la capacité d'action concrète de la collectivité et éviter la dérive de la "mairie-bureau de placement", les directives nationales du Ministère de l'Intérieur et des Finances imposent une règle intangible :
**Le ratio des dépenses salariales (Chapitre 64 / Personnels) ne doit en aucun cas excéder 40% des recettes de fonctionnement recouvrées.**

📍 **CAS PRATIQUE ZIKISSO — SAUVEGARDER L'ÉPARGNE BRUTE**
Si la Commune de Zikisso mobilise 150 000 000 FCFA de recettes de fonctionnement sur un exercice :
• Le montant total des salaires, primes et charges sociales ne saurait dépasser 60 000 000 FCFA (40%).
• Les autres charges de fonctionnement (fournitures, énergie, maintenance) doivent être contenues à environ 45 000 000 FCFA (30%).
• Cela dégage ainsi une **épargne brute de 45 000 000 FCFA (30%)** qui est obligatoirement virée en recettes d'investissement pour cofinancer les travaux dans les villages.`
      },
      {
        id: '2.3',
        title: "Le cycle budgétaire : Du Débat d'Orientation Budgétaire au Compte Administratif",
        dureeMinutes: 10,
        content: `### 1. La chronologie réglementaire annuelle

L'exercice budgétaire communal s'étend du 1er janvier au 31 décembre de chaque année civile. Sa trajectoire obéit à un rituel institutionnel cadencé en quatre étapes incontournables :

1. **Le Débat d'Orientation Budgétaire (DOB) — Septembre/Octobre (N-1)** :
   Le Maire présente au Conseil Municipal un rapport d'orientation générale fixant les priorités politiques pour l'année à venir, l'évolution de la fiscalité locale et l'état d'endettement. Ce débat donne lieu à un procès-verbal sans vote de crédits.

2. **Le Vote du Budget Primitif (BP) — Avant le 31 décembre (N-1)** :
   Le Conseil Municipal examine chapitre par chapitre, article par article, le projet de budget chiffré préparé par la Municipalité. Le vote intervient à la majorité absolue des suffrages exprimés.

3. **L'Approbation de la Tutelle Préfectorale — Janvier (Année N)** :
   Le Budget Primitif voté est transmis sous quinzaine au Préfet de Lakota. La commission technique préfectorale vérifie l'équilibre réel, la sincérité des évaluations de recettes et le respect des inscriptions obligatoires (dette, salaires, contingents légaux). Le budget devient exécutoire par arrêté d'approbation du Préfet.

4. **Le vote du Compte Administratif (CA) — Avant le 30 juin (N+1)** :
   À la clôture de l'exercice, le Maire rend compte de son exécution financière devant le Conseil Municipal.

### 2. Le principe de la présidence dérogatoire lors du vote du Compte Administratif

Lorsque le Conseil Municipal examine le Compte Administratif du Maire :
• Le Maire présente son rapport d'exécution et justifie les écarts constatés entre prévisions et réalisations.
• **Au moment du vote solennel, le Maire doit obligatoirement quitter la salle des délibérations.**
• L'assemblée élit un président de séance parmi ses membres pour diriger les débats et procéder au vote d'approbation ou de rejet.

⚠️ **POINT DE VIGILANCE — LA NULLITÉ DU COMPTE ADMINISTRATIF EN CAS DE PRÉSENCE DU MAIRE**
La présence du Maire dans la salle lors du vote de son propre compte administratif constitue une cause formelle de **nullité absolue** de la délibération pour violation du principe de contrôle démocratique des comptes publics.`
      },
      {
        id: '2.4',
        title: "Focus Digital : SIGFIP, e-Commune et transparence budgétaire",
        dureeMinutes: 9,
        content: `### 1. La fin des écritures manuelles sur registres volants

Longtemps pénalisée par des retards d'imputation comptable et des pertes de pièces justificatives, la gestion budgétaire communale en Côte d'Ivoire s'est arrimée aux standards modernes grâce au déploiement des progiciels intégrés de gestion territoriale :
• **L'application nationale e-Commune** : Développée sous l'égide de la DGDDL et de la Direction Générale du Budget et des Finances (DGBF), elle gère l'ensemble de la nomenclature budgétaire M57.
• **Le verrouillage informatique des engagements** : Le logiciel empêche techniquement l'émission d'un bon de commande si la ligne budgétaire correspondante est épuisée ou si le crédit n'est pas préalablement réservé.
• **L'interconnexion Trésor Public / Mairie** : La passerelle informatique entre le service financier de la Mairie et la Recette Municipale permet la transmission dématérialisée des mandats de paiement accompagnés de leurs bordereaux électroniques certifiés.

### 2. La restitution citoyenne du budget : Le "Budget Citoyen"

Une gestion budgétaire performante ne s'arrête pas à la rigueur des tableaux comptables ; elle s'ouvre à la compréhension de tous :
• La commune doit traduire son volumineux Budget Primitif technique en un **« Budget Citoyen » synthétique**, visuel et pédagogique (infographies murales, diffusions radio locales en langue Dida et Baoulé à Zikisso).
• Les administrés visualisent ainsi exactement comment chaque 1 000 FCFA d'impôt collecté sur le marché est réinvesti dans l'éclairage public, les tables-bancs scolaires et l'entretien des caniveaux.`
      }
    ]
  },

  // =========================================================================
  // SEMAINE 3 : FISCALITÉ LOCALE ET MOBILISATION DES RESSOURCES PROPRES
  // =========================================================================
  'semaine-3': {
    id: 'semaine-3',
    ordre: 3,
    titre: "Fiscalité Locale et Mobilisation des Ressources Propres",
    objectifs: [
      "Maîtriser la distinction entre impôts rétrocédés (DGI) et fiscalité municipale directe.",
      "Optimiser le potentiel fiscal des marchés communaux, gares et droits d'occupation temporaire.",
      "Appliquer rigoureusement le principe républicain de séparation ordonnateur / comptable public.",
      "Déployer des solutions de télépaiement Mobile Money pour éradiquer les déperditions de caisse."
    ],
    capsules: [
      {
        id: '3.1',
        title: "La cartographie des ressources fiscales des communes ivoiriennes",
        dureeMinutes: 11,
        content: `### 1. La typologie des ressources communales

L'autonomie financière d'une collectivité locale se mesure à sa capacité à lever des ressources propres pérennes pour ne pas dépendre exclusivement des subventions d'équilibre de l'État. En Côte d'Ivoire, les ressources financières communales se décomposent en trois grands paniers :

#### A. Les impôts d'État partagés ou rétrocédés (Recouvrés par la DGI)
Ce sont des impôts nationaux dont l'assiette et le recouvrement sont assurés par les services de la Direction Générale des Impôts (DGI) et dont le produit est intégralement ou partiellement reversé à la commune de localisation de l'activité ou de l'immeuble :
• **La contribution des patentes et licences** : assise sur le chiffre d'affaires des commerces, entreprises et transporteurs locaux.
• **L'impôt sur le revenu foncier (bâti et non bâti)** : pesant sur les propriétaires d'immeubles locatifs, entrepôts et parcelles urbanisées.
• **La taxe sur la valeur ajoutée (TVA) redistribuée** : quote-part de péréquation nationale reversée pour soutenir les communes rurales à faible tissu industriel.

#### B. Les taxes directes communales (Levées par la Mairie)
Instituées obligatoirement par délibération du Conseil Municipal dans le cadre des plafonds fixés par le Code Général des Collectivités Territoriales :
• Droits de place sur les marchés publics et foires hebdomadaires.
• Droits de stationnement des taxis communaux, tricycles et cars de transport (gbakas, minicars).
• Droits d'occupation du domaine public (terrasses, kiosques, étals, dépôts de matériaux, panneaux publicitaires).
• Taxes sur les débits de boissons, spectacles et cérémonies publiques.
• Taxes de salubrité et d'enlèvement des ordures ménagères.

#### C. Les revenus du domaine et prestations de services
• Produits de la délivrance des actes d'état civil (extraits de naissance, livrets de famille, certificats de résidence).
• Droits de fourrière municipale, d'inhumation au cimetière communal et concessions funéraires.

⚖️ **RÉFÉRENCES JURIDIQUES**
Loi portant Code Général des Impôts de Côte d'Ivoire (Dispositions fiscales relatives aux collectivités territoriales). Décret n° 2014-416 portant nomenclature des taxes directes et indirectes des communes.`
      },
      {
        id: '3.2',
        title: "Taxes de marché, stationnement et occupation temporaire du domaine public",
        dureeMinutes: 10,
        content: `### 1. Le marché communal : Poumon économique et fiscal

Pour une commune comme Zikisso, le grand marché communal et les marchés forains périodiques représentent la première source immédiate de liquidités quotidiennes.
Toutefois, la gestion manuelle classique présente de lourdes vulnérabilités :
• **La déperdition par les carnets à souches papier** : Risques de falsification de reçus, non-versement de l'intégralité des sommes collectées par certains collecteurs vacataires, manipulation dangereuse d'espèces sonnantes et trébuchantes sur les pistes isolées.
• **L'incivisme fiscal** : Résistance des commerçants refusant de payer au motif de l'absence de hangars couverts, de latrines salubres ou d'éclairage nocturne.

### 2. L'encadrement strict de l'Occupation du Domaine Public (ODP)

Le domaine public communal (trottoirs, places publiques, emprises routières) est inaliénable et imprescriptible :
• **Tout empiètement privatif est soumis à une Autorisation d'Occupation Temporaire (AOT)** délivrée par arrêté précaire et révocable du Maire.
• Nul ne peut installer de kiosque, boutique de transfert d'argent, atelier de vulcanisation ou terrasse sans s'acquitter d'une redevance annuelle ou mensuelle fixée par le Conseil Municipal.
• **Le démembrement de l'AOT** : Une autorisation ne confère aucun droit de propriété foncière. La Mairie peut y mettre fin à tout moment pour cause d'utilité publique (élargissement de voirie, canalisations d'eau) sans indemnité d'expropriation.

📍 **CAS PRATIQUE ZIKISSO — LE RECENSEMENT GÉORÉFÉRENCÉ DES COMMERÇANTS**
Pour doubler ses recettes sans augmenter la pression fiscale, la Mairie de Zikisso met en œuvre un recensement numérique de tous les commerces fixes et forains du périmètre communal. Chaque étal reçoit un QR code unique associé à l'identité du propriétaire. L'agent collecteur scanne le code et enregistre le paiement instantanément, éliminant les litiges de double taxation.`
      },
      {
        id: '3.3',
        title: "La séparation de l'ordonnateur et du comptable : Bouclier de la probité financière",
        dureeMinutes: 12,
        content: `### 1. La règle cardinale de la comptabilité publique ivoirienne

Le droit des finances publiques ivoirien repose sur une incompatibilité absolue, fondamentale et d'ordre public : **la séparation stricte des fonctions d'ordonnateur et des fonctions de comptable public**.

Cette séparation vise à prévenir la concussion, le détournement de deniers publics et le gaspillage en séparant celui qui décide la dépense de celui qui détient et décaisse effectivement l'argent :

| Rôle | Titulaire | Missions et Prérogatives |
| :--- | :--- | :--- |
| **L'Ordonnateur** | **Le Maire de la Commune** | • Prescrit l'exécution des recettes et des dépenses.<br>• Engage la commune juridiquement (contrats, bons de commande).<br>• Constate le service fait et liquide la dette.<br>• Émet les titres de recettes et les mandats de paiement.<br>• **Interdiction formelle de manier de l'argent liquide.** |
| **Le Comptable Public** | **Le Receveur Municipal** *(Haut fonctionnaire du Trésor Public)* | • Seul habilité à manier les fonds publics, encaisser les recettes et payer les mandats.<br>• Contrôle la régularité juridique des pièces justificatives.<br>• Gardien de la trésorerie et responsable pécuniairement et personnellement sur ses deniers propres. |

### 2. Le délit de gestion de fait : L'écueil mortel de l'élu local

La **gestion de fait** est la qualification juridique appliquée à toute personne (Maire, Adjoint, Conseiller, Secrétaire Général) qui manie des deniers publics ou effectue des opérations d'encaissement et de décaissement sans avoir la qualité officielle de comptable public assermenté ou sans habilitation légale de régisseur :
• **Conséquences judiciaires** : La Cour des Comptes déclare l'élu "comptable de fait". Il est contraint de restituer l'intégralité des fonds sur son patrimoine personnel, assorti d'amendes et d'éventuelles poursuites pénales pour usurpation de fonction et concussion.

⚠️ **POINT DE VIGILANCE ABSOLU POUR LE MAIRE ET SES ADJOINTS**
Il est formellement interdit à un Maire, un Adjoint ou un chauffeur de collecter lui-même de l'argent de taxes, ou de payer directement en espèces un entrepreneur ou un fournisseur sur les recettes du marché sans passer par un mandat visé par le Receveur Municipal du Trésor.`
      },
      {
        id: '3.4',
        title: "Focus Digital : Le télépaiement Mobile Money et la collecte électronique sécurisée",
        dureeMinutes: 9,
        content: `### 1. Le saut technologique de la collecte municipale

La généralisation du téléphone mobile en Côte d'Ivoire offre une opportunité historique de sécuriser et de moderniser les finances locales. Le système de collecte digitale par terminaux mobiles de paiement (POS) et porte-monnaie électroniques (Orange Money, MTN MoMo, Moov Money, Wave) transforme la régie municipale :

1. **Identification et traçabilité totale** : Chaque commerçant possède un compte contribuable municipal lié à son numéro de téléphone ou à sa carte d'identité biométrique.
2. **Encaissement sans espèces** : Le commerçant compose un code USSD ou présente son QR code au collecteur. Le débit s'opère instantanément.
3. **Émission d'une quittance numérique sécurisée** : Un SMS officiel ou un ticket imprimé par le terminal Bluetooth avec horodatage indélébile est délivré sur le champ.
4. **Consolidation bancaire immédiate** : Les fonds collectés ne transitent plus par des poches ou des sacoches : ils sont directement crédités sur le compte officiel de la Mairie logé au Trésor Public.

### 2. Les résultats mesurés sur les communes pilotes

Les expérimentations conduites avec l'UVICOCI révèlent des impacts spectaculaires dès la première année :
• Augmentation de **40% à 70%** des recettes effectives collectées sur les marchés.
• Suppression intégrale des risques de braquage lors du convoyage physique des fonds.
• Tableaux de bord de suivi en temps réel accessibles sur smartphone par le Maire, le Secrétaire Général et le Receveur Municipal.`
      }
    ]
  },

  // =========================================================================
  // SEMAINE 4 : MODERNISATION DES SERVICES PUBLICS ET ADMINISTRATION NUMÉRIQUE
  // =========================================================================
  'semaine-4': {
    id: 'semaine-4',
    ordre: 4,
    titre: "Modernisation des Services Publics et Administration Numérique",
    objectifs: [
      "Maîtriser la réforme nationale de l'état civil et le cadre de collaboration avec l'ONECI.",
      "Résorber le phénomène des 'enfants sans papiers' dans les villages et campements ruraux.",
      "Piloter la conduite du changement auprès des agents municipaux de guichet.",
      "Déployer un guichet unique communal virtuel et des services inclusifs en canal USSD."
    ],
    capsules: [
      {
        id: '4.1',
        title: "Les services publics municipaux de proximité : Missions et continuité républicaine",
        dureeMinutes: 10,
        content: `### 1. La notion de service public au niveau communal

Le service public municipal est l'activité d'intérêt général prise en charge directement par la commune ou sous son contrôle pour satisfaire les besoins fondamentaux des administrés. Il repose sur trois lois fondamentales dites "lois de Rolland" :
• **Le principe de continuité** : Le service public doit fonctionner de manière régulière et sans interruption intempestive (l'état civil, les secours, l'enlèvement des ordures ne peuvent s'arrêter arbitrairement).
• **Le principe d'égalité et de neutralité** : Tout citoyen de la commune, quelle que soit son ethnie, sa religion, son obédience politique ou son statut social, a un droit d'égal accès aux prestations communales aux mêmes tarifs légaux.
• **Le principe de mutabilité (ou adaptabilité)** : Le service public doit évoluer pour intégrer les innovations techniques et technologiques (digitalisation des registres, dématérialisation des démarches).

### 2. Les modes de gestion des services communaux

Selon sa technicité et ses moyens d'investissement, la commune peut opérer selon plusieurs modes :
• **La régie directe** : La commune gère le service avec son propre personnel et son matériel (ex: l'état civil, la police municipale, la voirie d'urgence).
• **La délégation de service public (concession / affermage)** : La commune confie la gestion d'un service à un opérateur privé spécialisé par contrat d'affermage (ex: gestion déléguée des abattoirs, gestion des parkings payants, ramassage des ordures ménagères).
• **La régie autonome dotée de la personnalité morale** : Réservée aux très grands équipements économiques.`
      },
      {
        id: '4.2',
        title: "La modernisation de l'état civil : Cadre légal et partenariat avec l'ONECI",
        dureeMinutes: 12,
        content: `### 1. L'état civil, fondement de la citoyenneté et de la sécurité nationale

L'état civil est le premier service régalien délégué au Maire. Un enfant sans acte de naissance est un citoyen invisible, privé du droit de passer ses examens scolaires (entrée en sixième, BEPC), exclu de la Couverture Maladie Universelle (CMU) et vulnérable à l'exploitation et à la traite.

En Côte d'Ivoire, l'**Office National de l'État Civil et de l'Identification (ONECI)** pilote la refonte complète du Registre National des Personnes Physiques (RNPP) qui attribue à chaque individu un Numéro National d'Identification (NNI) unique de la naissance à la mort.

### 2. Le cadre légal impératif des déclarations de naissance

La loi n° 2018-862 relative à l'état civil fixe des délais stricts d'ordre public :
• **Le délai légal ordinaire : 3 mois** suivant l'accouchement pour déclarer la naissance auprès de l'officier ou de l'agent d'état civil communal ou du centre secondaire.
• **La procédure dérogatoire : Le jugement supplétif** : Passé le délai impératif de 3 mois, l'officier d'état civil a l'interdiction absolue d'inscrire l'enfant sur les registres ordinaires. L'établissement de l'acte nécessite obligatoirement la saisine du tribunal ou de la section de tribunal pour obtenir un jugement supplétif d'acte de naissance ou une ordonnance d'homologation lors des audiences foraines organisées par le Ministère de la Justice.

### 3. Les centres secondaires d'état civil dans les campements

Pour rapprocher l'état civil des populations rurales éloignées du chef-lieu, le Conseil Municipal peut, après avis favorable du Procureur de la République et arrêté du Préfet, créer des **centres secondaires d'état civil** dans les gros villages du canton de Zikisso :
• Les accoucheuses et infirmiers des centres de santé ruraux sont formés pour déclarer les naissances dès la maternité.
• Des agents de liaison acheminent mensuellement les carnets vers le centre principal de la Mairie pour transcription officielle.

⚠️ **POINT DE VIGILANCE — LA LUTTE CONTRE LES REGISTRES VOLANTS ET LA FRAUDE DOCUMENTAIRE**
La délivrance d'extraits d'acte de naissance complaisants ou antidatés constitue un délit de faux en écriture publique passible de 5 à 10 ans de réclusion criminelle devant les tribunaux pour les agents et les élus impliqués.`
      },
      {
        id: '4.3',
        title: "La conduite du changement auprès du personnel et des usagers",
        dureeMinutes: 10,
        content: `### 1. Surmonter les résistances à la transformation digitale

La numérisation d'une mairie ne se limite pas à acheter des ordinateurs : elle modifie profondément les habitudes de travail, les équilibres informels de pouvoir et les circuits de validation.
Les sources classiques de résistance identifiées dans les mairies ivoiriennes :
• La peur de la perte d'emploi ou de déclassement chez les agents non formés à l'informatique.
• La perte d'avantages occultes liés à la manipulation des reçus papier manuels.
• L'appréhension des usagers analphabètes ou âgés face aux écrans et aux démarches en ligne.

### 2. La stratégie d'accompagnement en 4 axes

1. **Le plan de formation continue diplômant** : Valoriser les secrétaires et agents de guichet par des certifications reconnues, faisant d'eux des "conseillers en démarches numériques".
2. **L'aménagement d'un espace d'accueil citoyen physique** : Maintenir un accueil humain chaleureux en mairie où des jeunes volontaires du service civique aident les administrés à formuler leurs demandes numériques.
3. **La prime de performance à la digitalisation** : Encourager les services ayant atteint 100% de dossiers dématérialisés sans perte ni retard.
4. **La communication multicanale et multilingue** : Expliquer les nouvelles procédures sur les ondes de la radio de proximité en langues locales pour rassurer les chefs de village et les patriarches.`
      },
      {
        id: '4.4',
        title: "Focus Digital : Le Guichet Unique Virtuel e-Commune et les solutions USSD",
        dureeMinutes: 9,
        content: `### 1. L'architecture du Guichet Unique Communal

Le concept de **Guichet Unique Virtuel** permet à tout citoyen résidant à Zikisso, ou appartenant à la diaspora zikisquoise résidant à Abidjan, Bouaké ou à l'étranger, d'effectuer ses formalités administratives sans se déplacer physiquement :
• **Portail web responsive** : Demande d'extrait d'acte de naissance, de certificat de célibat, de légalisation de diplôme ou d'attestation de résidence.
• **Paiement sécurisé en ligne** : Règlement instantané des droits de timbre par Mobile Money.
• **Acheminement postal ou téléchargement certifié** : Envoi de l'acte sous enveloppe sécurisée par La Poste de Côte d'Ivoire ou génération d'un document PDF revêtu d'un cachet électronique visible (QR code 2D-Doc certifié conforme par la DGDDL).

### 2. L'inclusion rurale par la technologie USSD (*xxx#)

Consciente que plus de 50% des habitants des campements ruraux ne disposent pas d'un smartphone ou d'une connexion Internet 4G permanente, la Mairie moderne déploie des services par **codes courts USSD** :
• Sans connexion Internet, sur n'importe quel téléphone basique à clavier : l'administré compose le code de la mairie (ex: *800*99#).
• Il sélectionne le menu en français simplifié : déclaration précoce d'une naissance au village, alerte sur une panne de pompe hydraulique villageoise, consultation du calendrier des séances du Conseil Municipal.`
      }
    ]
  },

  // =========================================================================
  // MODULE BONUS : REDEVABILITÉ, CYBERSÉCURITÉ & PARTICIPATION CITOYENNE
  // =========================================================================
  'module-bonus': {
    id: 'module-bonus',
    ordre: 5,
    titre: "Redevabilité, Cybersécurité & Participation Citoyenne",
    objectifs: [
      "Maîtriser la méthodologie et le cadre réglementaire du budget participatif communal.",
      "Structurer des comités de concertation citoyenne conformes à la démocratie participative locale.",
      "Garantir le droit d'accès à l'information publique selon les normes de la CAIDP.",
      "Protéger le système d'information de la mairie contre les cyberattaques et l'extorsion de données."
    ],
    capsules: [
      {
        id: 'B.1',
        title: "Le budget participatif communal : Méthodologie et co-construction",
        dureeMinutes: 10,
        content: `### 1. Définition et plus-value démocratique

Le **budget participatif** est un mécanisme institutionnel par lequel le Conseil Municipal alloue une fraction déterminée de son budget d'investissement (habituellement 5% à 10%) pour financer des micro-projets proposés, débattus et choisis directement par les habitants des quartiers et villages de la commune.

Loin d'affaiblir l'autorité du Maire, le budget participatif renforce puissamment la paix sociale et la cohésion républicaine :
• Il convertit les récriminations passives des citoyens en propositions d'action constructives.
• Il restaure le civisme fiscal : le citoyen qui constate que ses taxes financent directement le forage de son quartier paie spontanément ses droits de marché.
• Il assure une répartition équitable des investissements entre le centre urbain et les villages périphériques enclavés.

### 2. Le cycle en 5 étapes d'un budget participatif réussi

1. **Fixation de l'enveloppe et du règlement intérieur** : Le Conseil Municipal vote le montant dédié (ex: 20 000 000 FCFA pour Zikisso) et définit les critères d'éligibilité (projets d'intérêt collectif, relevant des compétences communales, pérennes).
2. **Appel à idées citoyennes** : Dépôt des fiches-projets simples dans des urnes citoyennes en mairie, sous-préfecture, chefferies de village ou via le formulaire en ligne du portail municipal.
3. **Analyse de recevabilité technique et financière** : Les services techniques municipaux vérifient la faisabilité et chiffrent le coût exact de chaque idée.
4. **Le vote populaire citoyen** : Les habitants votent pour leurs 3 projets préférés lors d'une journée civique ou par SMS gratuit.
5. **Réalisation et inauguration participative** : Les projets lauréats sont inscrits au budget et réalisés sous le regard d'un comité mixte élus-citoyens.`
      },
      {
        id: 'B.2',
        title: "La redevabilité locale et les comités de concertation de quartier",
        dureeMinutes: 10,
        content: `### 1. La redevabilité publique : Un devoir constitutionnel

L'Article 170 de la Constitution et les directives de bonne gouvernance de l'UVICOCI posent l'exigence de la **redevabilité locale** (ou *accountability*) : les élus qui manient les deniers publics et détiennent le mandat du peuple ont l'obligation républicaine de rendre compte régulièrement de leurs décisions, de leurs dépenses et de leurs résultats.

La redevabilité ne se réduit pas au vote annuel du Compte Administratif à huis clos : elle s'exprime à travers des **Journées Communales de Redevabilité**, organisées en place publique, au cours desquelles le Maire et la Municipalité répondent publiquement et sans tabou aux interpellations des administrés sur l'état d'avancement des chantiers et les finances locales.

### 2. L'institutionnalisation des Comités de Quartier et de Village

Pour structurer ce dialogue au quotidien, la mairie moderne s'appuie sur des comités de veille et de développement territorial :
• Présidés conjointement par un représentant coutumier et un délégué associatif élu.
• Intégrant obligatoirement un quota de 30% minimum de femmes et de jeunes.
• Chargés d'alerter la mairie sur les urgences sanitaires, les pannes de réseaux, les conflits de voisinage et de relayer fidèlement les messages de salubrité et de civisme émis par la municipalité.`
      },
      {
        id: 'B.3',
        title: "Le droit d'accès à l'information publique et la conformité CAIDP",
        dureeMinutes: 9,
        content: `### 1. Le cadre légal garanti par la CAIDP

En vertu de la loi n° 2013-867 relative à l'accès à l'information d'intérêt public, toute personne physique ou morale a le droit fondamental de solliciter et d'obtenir communication des documents administratifs détenus par une mairie. La **Commission d'Accès à l'Information d'Intérêt Public et aux Documents Publics (CAIDP)** veille au respect de cette obligation républicaine.

Documents communicables de plein droit à tout citoyen :
• Le Budget Primitif approuvé et le Compte Administratif.
• Les procès-verbaux des séances du Conseil Municipal et les délibérations votées.
• Les marchés publics signés et les rapports d'attribution des commissions d'appel d'offres.
• Les arrêtés municipaux réglementaires de police et de tarification des taxes.

### 2. Les limites strictes imposées par la loi

Ne sont en aucun cas communicables pour protéger les libertés fondamentales :
• Les dossiers individuels du personnel communal (salaires, sanctions disciplinaires, données médicales).
• Les informations couvertes par le secret de la défense nationale, la sécurité publique ou le secret médical.
• Les registres d'état civil originaux (seule la délivrance d'extraits conformes est autorisée aux ayants droit).

💡 **BONNE PRATIQUE RECOMMANDÉE PAR LA CAIDP**
Désigner par arrêté municipal un **Responsable de l'Information (RI)** au sein de la mairie (souvent le Secrétaire Général ou le responsable de la communication) chargé de répondre aux requêtes citoyennes dans le délai légal de 15 jours ouvrables.`
      },
      {
        id: 'B.4',
        title: "Cybersécurité des collectivités territoriales et conformité ARTCI",
        dureeMinutes: 11,
        content: `### 1. La mairie face aux nouvelles menaces cybernétiques

Avec l'informatisation généralisée de l'état civil, des bases de données fiscales et des échanges avec les ministères, la mairie devient une cible privilégiée pour les cybercriminels (rançongiciels, usurpation d'identité institutionnelle, vols de données personnelles).

La loi n° 2013-450 sur la protection des données à caractère personnel encadrée par l'**Autorité de Régulation des Télécommunications/TIC de Côte d'Ivoire (ARTCI)** impose aux collectivités locales une obligation légale de sécurité et de confidentialité sous peine de lourdes sanctions pécuniaires et pénales.

### 2. Le protocole de sécurité hygiène cyber en 6 règles vitales

1. **Sauvegardes externalisées immuables (Règle 3-2-1)** :
   Conserver 3 copies des données de la mairie (bases état civil, fichiers comptables), sur 2 supports différents (serveur local et disque dur externe sécurisé), avec 1 copie hors ligne ou dans un cloud certifié de l'État.
2. **Politique stricte de gestion des accès et mots de passe** :
   Chaque agent municipal dispose de son propre identifiant nominatif. Interdiction absolue de partager les mots de passe. Obligation d'activer l'authentification à double facteur (2FA) pour l'accès aux serveurs administratifs.
3. **Séparation étanche des réseaux informatiques** :
   Le réseau Wi-Fi mis à disposition des visiteurs et du public en mairie doit être physiquement et logiquement séparé du réseau local interne hébergeant les postes de comptabilité et d'état civil.
4. **Protection contre le phishing et l'ingénierie sociale** :
   Sensibilisation mensuelle des secrétaires municipaux : ne jamais ouvrir une pièce jointe suspecte, ne jamais cliquer sur un lien demandant les identifiants de la mairie.
5. **Mise à jour régulière des correctifs logiciels** :
   Activer les mises à jour de sécurité automatiques sur l'ensemble des systèmes d'exploitation et antivirus.
6. **Plan de continuité et de reprise d'activité (PCA/PRA)** :
   La mairie doit disposer d'une procédure écrite claire pour continuer à délivrer les actes d'état civil d'urgence en cas de panne réseau prolongée ou d'incident électrique majeur.`
      }
    ]
  }
};
