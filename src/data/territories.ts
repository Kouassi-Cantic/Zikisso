export interface TerritoryItem {
  commune: string;
  region: string;
  isPilot?: boolean;
}

export const PILOT_COMMUNE: TerritoryItem = {
  commune: 'Zikisso',
  region: 'Lôh-Djiboua',
  isPilot: true,
};

export const COTE_D_IVOIRE_TERRITORIES: TerritoryItem[] = [
  // Commune pilote mise en avant
  PILOT_COMMUNE,

  // Région du Lôh-Djiboua
  { commune: 'Divo', region: 'Lôh-Djiboua' },
  { commune: 'Lakota', region: 'Lôh-Djiboua' },
  { commune: 'Guitry', region: 'Lôh-Djiboua' },
  { commune: 'Hiré', region: 'Lôh-Djiboua' },

  // Région du Gôh
  { commune: 'Gagnoa', region: 'Gôh' },
  { commune: 'Oumé', region: 'Gôh' },
  { commune: 'Guibéroua', region: 'Gôh' },
  { commune: 'Ouragahio', region: 'Gôh' },
  { commune: 'Diégonéfla', region: 'Gôh' },

  // District Autonome d'Abidjan
  { commune: 'Cocody', region: "District d'Abidjan" },
  { commune: 'Plateau', region: "District d'Abidjan" },
  { commune: 'Yopougon', region: "District d'Abidjan" },
  { commune: 'Abobo', region: "District d'Abidjan" },
  { commune: 'Marcory', region: "District d'Abidjan" },
  { commune: 'Treichville', region: "District d'Abidjan" },
  { commune: 'Port-Bouët', region: "District d'Abidjan" },
  { commune: 'Koumassi', region: "District d'Abidjan" },
  { commune: 'Attécoubé', region: "District d'Abidjan" },
  { commune: 'Adjamé', region: "District d'Abidjan" },
  { commune: 'Bingerville', region: "District d'Abidjan" },
  { commune: 'Songon', region: "District d'Abidjan" },
  { commune: 'Anyama', region: "District d'Abidjan" },

  // District Autonome de Yamoussoukro
  { commune: 'Yamoussoukro', region: 'District de Yamoussoukro' },
  { commune: 'Attégouakro', region: 'District de Yamoussoukro' },

  // Région du Gbêkê
  { commune: 'Bouaké', region: 'Gbêkê' },
  { commune: 'Béoumi', region: 'Gbêkê' },
  { commune: 'Sakassou', region: 'Gbêkê' },
  { commune: 'Botro', region: 'Gbêkê' },

  // Région du Poro
  { commune: 'Korhogo', region: 'Poro' },
  { commune: 'Sinématiali', region: 'Poro' },
  { commune: 'Dikodougou', region: 'Poro' },
  { commune: "M'Bengué", region: 'Poro' },

  // Région de San-Pédro
  { commune: 'San-Pédro', region: 'San-Pédro' },
  { commune: 'Grand-Béréby', region: 'San-Pédro' },
  { commune: 'Tabou', region: 'San-Pédro' },
  { commune: 'Grabo', region: 'San-Pédro' },

  // Région du Haut-Sassandra
  { commune: 'Daloa', region: 'Haut-Sassandra' },
  { commune: 'Issia', region: 'Haut-Sassandra' },
  { commune: 'Vavoua', region: 'Haut-Sassandra' },
  { commune: 'Zoukougbeu', region: 'Haut-Sassandra' },

  // Région du Sud-Comoé
  { commune: 'Grand-Bassam', region: 'Sud-Comoé' },
  { commune: 'Aboisso', region: 'Sud-Comoé' },
  { commune: 'Bonoua', region: 'Sud-Comoé' },
  { commune: 'Adiaké', region: 'Sud-Comoé' },
  { commune: 'Tiapoum', region: 'Sud-Comoé' },

  // Région de l'Indénié-Djuablin
  { commune: 'Abengourou', region: 'Indénié-Djuablin' },
  { commune: 'Agnibilékrou', region: 'Indénié-Djuablin' },
  { commune: 'Bettié', region: 'Indénié-Djuablin' },

  // Région du Tonkpi
  { commune: 'Man', region: 'Tonkpi' },
  { commune: 'Danané', region: 'Tonkpi' },
  { commune: 'Zouan-Hounien', region: 'Tonkpi' },
  { commune: 'Biankouma', region: 'Tonkpi' },
  { commune: 'Sipilou', region: 'Tonkpi' },

  // Région de la Marahoué
  { commune: 'Bouaflé', region: 'Marahoué' },
  { commune: 'Sinfra', region: 'Marahoué' },
  { commune: 'Zuénoula', region: 'Marahoué' },
  { commune: 'Bonon', region: 'Marahoué' },
  { commune: 'Gohitafla', region: 'Marahoué' },

  // Région de l'Agnéby-Tiassa
  { commune: 'Agboville', region: 'Agnéby-Tiassa' },
  { commune: 'Tiassalé', region: 'Agnéby-Tiassa' },
  { commune: 'Sikensi', region: 'Agnéby-Tiassa' },
  { commune: 'Taabo', region: 'Agnéby-Tiassa' },

  // Région de la Nawa
  { commune: 'Soubré', region: 'Nawa' },
  { commune: 'Méagui', region: 'Nawa' },
  { commune: 'Buyo', region: 'Nawa' },
  { commune: 'Guéyo', region: 'Nawa' },

  // Région du Bélier
  { commune: 'Toumodi', region: 'Bélier' },
  { commune: 'Tiébissou', region: 'Bélier' },
  { commune: 'Didiévi', region: 'Bélier' },
  { commune: 'Djékanou', region: 'Bélier' },

  // Région du Hambol
  { commune: 'Katiola', region: 'Hambol' },
  { commune: 'Dabakala', region: 'Hambol' },
  { commune: 'Niakaramandougou', region: 'Hambol' },

  // Région de la Mé
  { commune: 'Adzopé', region: 'Mé' },
  { commune: 'Akoupé', region: 'Mé' },
  { commune: 'Alépé', region: 'Mé' },
  { commune: 'Yakassé-Attobrou', region: 'Mé' },

  // Région des Grands Ponts
  { commune: 'Dabou', region: 'Grands Ponts' },
  { commune: 'Grand-Lahou', region: 'Grands Ponts' },
  { commune: 'Jacqueville', region: 'Grands Ponts' },

  // Région du Guémon
  { commune: 'Duékoué', region: 'Guémon' },
  { commune: 'Bangolo', region: 'Guémon' },
  { commune: 'Kouibly', region: 'Guémon' },
  { commune: 'Facobly', region: 'Guémon' },

  // Région du Cavally
  { commune: 'Guiglo', region: 'Cavally' },
  { commune: 'Bloléquin', region: 'Cavally' },
  { commune: 'Toulepleu', region: 'Cavally' },
  { commune: 'Taï', region: 'Cavally' },

  // Région du Tchologo
  { commune: 'Ferkessédougou', region: 'Tchologo' },
  { commune: 'Ouangolodougou', region: 'Tchologo' },
  { commune: 'Kong', region: 'Tchologo' },

  // Région de la Bagoué
  { commune: 'Boundiali', region: 'Bagoué' },
  { commune: 'Kouto', region: 'Bagoué' },
  { commune: 'Tengréla', region: 'Bagoué' },

  // Région du Kabadougou
  { commune: 'Odienné', region: 'Kabadougou' },
  { commune: 'Madinani', region: 'Kabadougou' },
  { commune: 'Samatiguila', region: 'Kabadougou' },

  // Région du Bounkani
  { commune: 'Bouna', region: 'Bounkani' },
  { commune: 'Doropo', region: 'Bounkani' },
  { commune: 'Nassian', region: 'Bounkani' },

  // Région du Gontougo
  { commune: 'Bondoukou', region: 'Gontougo' },
  { commune: 'Tanda', region: 'Gontougo' },
  { commune: 'Koun-Fao', region: 'Gontougo' },

  // Région du Gbôklé
  { commune: 'Sassandra', region: 'Gbôklé' },
  { commune: 'Fresco', region: 'Gbôklé' },

  // Région du Worodougou
  { commune: 'Séguéla', region: 'Worodougou' },
  { commune: 'Kani', region: 'Worodougou' },

  // Région du Béré
  { commune: 'Mankono', region: 'Béré' },
  { commune: 'Dianra', region: 'Béré' },

  // Région de l'Iffou
  { commune: 'Daoukro', region: 'Iffou' },
  { commune: "M'Bahiakro", region: 'Iffou' },
  { commune: 'Prikro', region: 'Iffou' },

  // Région du Moronou
  { commune: 'Bongouanou', region: 'Moronou' },
  { commune: 'Arrah', region: 'Moronou' },
  { commune: "M'Batto", region: 'Moronou' },

  // Région du Bafing
  { commune: 'Touba', region: 'Bafing' },
  { commune: 'Koro', region: 'Bafing' },

  // Option d'ouverture générale / Diaspora
  { commune: 'Autre commune de Côte d’Ivoire', region: 'Côte d’Ivoire' },
  { commune: 'International / Diaspora', region: 'Diaspora et Partenaires' },
];

export const REGIONS_LIST = Array.from(
  new Set(COTE_D_IVOIRE_TERRITORIES.map((t) => t.region))
);

export const findTerritoryByCommune = (communeName: string): TerritoryItem | undefined => {
  if (!communeName) return undefined;
  return COTE_D_IVOIRE_TERRITORIES.find(
    (t) => t.commune.toLowerCase() === communeName.trim().toLowerCase()
  );
};
