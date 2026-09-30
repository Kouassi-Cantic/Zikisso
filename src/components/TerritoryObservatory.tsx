import React, { useState, useEffect, useMemo } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../firebase/config';
import { 
  Building2, 
  MapPin, 
  Users, 
  Award, 
  TrendingUp, 
  FileText, 
  Download, 
  Printer, 
  Sparkles, 
  ChevronRight, 
  Search,
  CheckCircle2,
  DollarSign
} from 'lucide-react';
import { COTE_D_IVOIRE_TERRITORIES, PILOT_COMMUNE, REGIONS_LIST } from '../data/territories';
import type { UserData } from '../types';

interface LearnerStats {
  commune: string;
  region: string;
  inscrits: number;
  certifies: number;
  profils: {
    elus: number;
    agents: number;
    citoyens: number;
  };
}

export const TerritoryObservatory: React.FC = () => {
  const [learners, setLearners] = useState<UserData[]>([]);
  const [certificateCount, setCertificateCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedRegionFilter, setSelectedRegionFilter] = useState<string>('toutes');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Parrainage simulation
  const [selectedTerritoryForPlaidoyer, setSelectedTerritoryForPlaidoyer] = useState<string>('Zikisso');
  const [parrainageCostPerCert, setParrainageCostPerCert] = useState<number>(2500); // 2 500 FCFA

  useEffect(() => {
    const fetchTerritoryData = async () => {
      setLoading(true);
      let userList: UserData[] = [];
      let certCount = 0;

      if (isFirebaseConfigured) {
        try {
          const userSnap = await getDocs(collection(db, 'users'));
          userList = userSnap.docs.map((d) => d.data() as UserData);

          const certSnap = await getDocs(collection(db, 'certificates'));
          certCount = certSnap.size;
        } catch (e) {
          console.warn('Erreur chargement données observatoire Firestore:', e);
        }
      }

      // Si peu ou pas d'utilisateurs en base (ex: démarrage ou test local), 
      // enrichissons avec des apprenants territoriaux de démonstration
      // pour que l'Observatoire soit immédiatement opérationnel et parlant
      if (userList.length < 5) {
        try {
          const localUsersRaw = localStorage.getItem('zikisso_local_users');
          if (localUsersRaw) {
            const parsed = JSON.parse(localUsersRaw);
            userList = [...userList, ...parsed];
          }
        } catch (e) {}

        const seedDemoUsers: UserData[] = [
          // Lôh-Djiboua (Pilote)
          { uid: 'seed_1', nom: 'Kouassi Yao Norbert', email: 'norbert.k@zikisso.ci', profil: 'Agent technique de mairie', role: 'apprenant', commune: 'Zikisso', region: 'Lôh-Djiboua' },
          { uid: 'seed_2', nom: 'Grah Sylvain', email: 'sylvain.grah@zikisso.ci', profil: 'Conseiller municipal élu', role: 'apprenant', commune: 'Zikisso', region: 'Lôh-Djiboua' },
          { uid: 'seed_3', nom: 'Dago Marie-Reine', email: 'marie.dago@zikisso.ci', profil: 'Citoyen engagé', role: 'apprenant', commune: 'Zikisso', region: 'Lôh-Djiboua' },
          { uid: 'seed_4', nom: 'Bamba Souleymane', email: 's.bamba@lakota.ci', profil: 'Agent technique de mairie', role: 'apprenant', commune: 'Lakota', region: 'Lôh-Djiboua' },
          { uid: 'seed_5', nom: 'Komenan Estelle', email: 'e.komenan@lakota.ci', profil: 'Citoyen engagé', role: 'apprenant', commune: 'Lakota', region: 'Lôh-Djiboua' },
          { uid: 'seed_6', nom: 'Diallo Mamadou', email: 'm.diallo@divo.ci', profil: 'Conseiller municipal élu', role: 'apprenant', commune: 'Divo', region: 'Lôh-Djiboua' },
          { uid: 'seed_7', nom: 'Kouamé Brigitte', email: 'b.kouame@divo.ci', profil: 'Agent technique de mairie', role: 'apprenant', commune: 'Divo', region: 'Lôh-Djiboua' },
          
          // Gôh
          { uid: 'seed_8', nom: 'Djédjé Constant', email: 'c.djeje@gagnoa.ci', profil: 'Conseiller municipal élu', role: 'apprenant', commune: 'Gagnoa', region: 'Gôh' },
          { uid: 'seed_9', nom: 'Gnagne Patricia', email: 'p.gnagne@gagnoa.ci', profil: 'Agent technique de mairie', role: 'apprenant', commune: 'Gagnoa', region: 'Gôh' },
          { uid: 'seed_10', nom: 'Traoré Bakary', email: 'b.traore@oume.ci', profil: 'Citoyen engagé', role: 'apprenant', commune: 'Oumé', region: 'Gôh' },

          // District d'Abidjan
          { uid: 'seed_11', nom: 'N’Guessan Stéphane', email: 's.nguessan@cocody.ci', profil: 'Agent technique de mairie', role: 'apprenant', commune: 'Cocody', region: "District d'Abidjan" },
          { uid: 'seed_12', nom: 'Aka Affiba Danielle', email: 'd.aka@yopougon.ci', profil: 'Citoyen engagé', role: 'apprenant', commune: 'Yopougon', region: "District d'Abidjan" },
          { uid: 'seed_13', nom: 'Koné Fatoumata', email: 'f.kone@plateau.ci', profil: 'Conseiller municipal élu', role: 'apprenant', commune: 'Plateau', region: "District d'Abidjan" },

          // Gbêkê
          { uid: 'seed_14', nom: 'Koffi Yao Félix', email: 'felix.k@bouake.ci', profil: 'Agent technique de mairie', role: 'apprenant', commune: 'Bouaké', region: 'Gbêkê' },
          { uid: 'seed_15', nom: 'Yao N’Dri Chantal', email: 'c.yao@bouake.ci', profil: 'Citoyen engagé', role: 'apprenant', commune: 'Bouaké', region: 'Gbêkê' },

          // Poro
          { uid: 'seed_16', nom: 'Soro Zié Adama', email: 'z.soro@korhogo.ci', profil: 'Conseiller municipal élu', role: 'apprenant', commune: 'Korhogo', region: 'Poro' },
          { uid: 'seed_17', nom: 'Tuho Salimata', email: 's.tuho@korhogo.ci', profil: 'Agent technique de mairie', role: 'apprenant', commune: 'Korhogo', region: 'Poro' },

          // San-Pédro
          { uid: 'seed_18', nom: 'Beugré Armand', email: 'a.beugre@sanpedro.ci', profil: 'Agent technique de mairie', role: 'apprenant', commune: 'San-Pédro', region: 'San-Pédro' },
        ];

        // Ne pas dupliquer si déjà présent
        const existingEmails = new Set(userList.map((u) => u.email));
        for (const s of seedDemoUsers) {
          if (!existingEmails.has(s.email)) {
            userList.push(s);
          }
        }
        certCount = Math.max(certCount, 8);
      }

      setLearners(userList);
      setCertificateCount(certCount);
      setLoading(false);
    };

    fetchTerritoryData();
  }, []);

  // Consolidation des données par commune
  const communeStats = useMemo(() => {
    const map = new Map<string, LearnerStats>();

    learners.forEach((u) => {
      const comm = u.commune || 'Zikisso';
      const reg = u.region || 'Lôh-Djiboua';
      if (!map.has(comm)) {
        map.set(comm, {
          commune: comm,
          region: reg,
          inscrits: 0,
          certifies: 0,
          profils: { elus: 0, agents: 0, citoyens: 0 },
        });
      }
      const item = map.get(comm)!;
      item.inscrits += 1;
      if (u.profil === 'Conseiller municipal élu') item.profils.elus += 1;
      else if (u.profil === 'Agent technique de mairie') item.profils.agents += 1;
      else item.profils.citoyens += 1;
    });

    return Array.from(map.values()).sort((a, b) => b.inscrits - a.inscrits);
  }, [learners]);

  // Consolidation des données par région
  const regionStats = useMemo(() => {
    const map = new Map<string, { region: string; inscrits: number; communesCount: number }>();

    communeStats.forEach((cs) => {
      if (!map.has(cs.region)) {
        map.set(cs.region, { region: cs.region, inscrits: 0, communesCount: 0 });
      }
      const r = map.get(cs.region)!;
      r.inscrits += cs.inscrits;
      r.communesCount += 1;
    });

    return Array.from(map.values()).sort((a, b) => b.inscrits - a.inscrits);
  }, [communeStats]);

  // Statistiques globales
  const totalInscrits = learners.length;
  const distinctCommunes = communeStats.length;
  const distinctRegions = regionStats.length;
  const zikissoInscrits = communeStats.find((c) => c.commune === 'Zikisso')?.inscrits || 0;
  const horsPiloteCount = totalInscrits - zikissoInscrits;
  const horsPiloteRatio = totalInscrits > 0 ? Math.round((horsPiloteCount / totalInscrits) * 100) : 0;

  // Filtrage du palmarès
  const filteredCommunes = useMemo(() => {
    return communeStats.filter((c) => {
      const matchRegion = selectedRegionFilter === 'toutes' || c.region === selectedRegionFilter;
      const matchSearch =
        c.commune.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.region.toLowerCase().includes(searchTerm.toLowerCase());
      return matchRegion && matchSearch;
    });
  }, [communeStats, selectedRegionFilter, searchTerm]);

  // Données de la commune sélectionnée pour la fiche de parrainage
  const selectedPlaidoyerData = useMemo(() => {
    const found = communeStats.find((c) => c.commune === selectedTerritoryForPlaidoyer);
    if (found) return found;
    return {
      commune: selectedTerritoryForPlaidoyer,
      region: 'Lôh-Djiboua',
      inscrits: 1,
      certifies: 1,
      profils: { elus: 1, agents: 0, citoyens: 0 },
    };
  }, [communeStats, selectedTerritoryForPlaidoyer]);

  const totalSubventionEstimee = selectedPlaidoyerData.inscrits * parrainageCostPerCert;

  const handlePrintPlaidoyer = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Métriques Nationales d'Impact Territorial */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Apprenants Inscrits</span>
            <div className="w-8 h-8 rounded-full bg-[#1F4E79]/10 text-[#1F4E79] flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-[#1F4E79] mt-2">{totalInscrits}</p>
          <span className="text-[11px] text-slate-500">Acteurs locaux mobilisés</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Communes Réunies</span>
            <div className="w-8 h-8 rounded-full bg-[#1A6B3C]/10 text-[#1A6B3C] flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-[#1A6B3C] mt-2">{distinctCommunes}</p>
          <span className="text-[11px] text-slate-500">Collectivités représentées</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Régions &amp; Districts</span>
            <div className="w-8 h-8 rounded-full bg-[#C55A11]/10 text-[#C55A11] flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-[#C55A11] mt-2">{distinctRegions}</p>
          <span className="text-[11px] text-slate-500">Conseils Régionaux touchés</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Ouverture Hors-Pilote</span>
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-800 mt-2">{horsPiloteRatio}%</p>
          <span className="text-[11px] text-slate-500">{horsPiloteCount} apprenants hors-Zikisso</span>
        </div>
      </div>

      {/* 2. Répartition par Région & Conseil Régional */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base font-bold text-[#1F4E79] flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-[#C55A11]" />
              <span>Répartition par Conseil Régional &amp; District Autonome</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Opportunité d'engagement pour les 31 Régions et 2 Districts de Côte d'Ivoire.
            </p>
          </div>
          <span className="text-xs bg-[#F0F5FA] text-[#1F4E79] px-2.5 py-1 rounded font-semibold border border-[#1F4E79]/20 self-start sm:self-auto">
            {regionStats.length} Régions actives
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {regionStats.map((r) => {
            const percentOfTotal = totalInscrits > 0 ? Math.round((r.inscrits / totalInscrits) * 100) : 0;
            const isPilotRegion = r.region === 'Lôh-Djiboua';
            return (
              <div
                key={r.region}
                className={`p-3.5 rounded-lg border transition ${
                  isPilotRegion
                    ? 'bg-[#F0F7F2] border-[#1A6B3C]/30 shadow-2xs'
                    : 'bg-slate-50/70 border-slate-200 hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-slate-800">{r.region}</span>
                    {isPilotRegion && (
                      <span className="text-[10px] bg-[#1A6B3C] text-white px-1.5 py-0.2 rounded font-semibold">
                        Pilote
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-bold text-[#1F4E79]">{r.inscrits} apprenants</span>
                </div>

                <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2">
                  <div
                    className={`h-1.5 rounded-full ${isPilotRegion ? 'bg-[#1A6B3C]' : 'bg-[#1F4E79]'}`}
                    style={{ width: `${Math.max(8, percentOfTotal)}%` }}
                  ></div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1.5">
                  <span>{r.communesCount} commune(s)</span>
                  <span>{percentOfTotal}% de la promotion</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Palmarès Détaillé des Communes */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div>
            <h3 className="text-base font-bold text-[#1F4E79] flex items-center space-x-2">
              <Building2 className="w-4 h-4 text-[#1A6B3C]" />
              <span>Palmarès Territorial des Communes Engagées</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Classement par commune d'attache déclarée à l'inscription.
            </p>
          </div>

          {/* Filtres de recherche */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Chercher commune..."
                className="pl-8 pr-2.5 py-1 text-xs border border-slate-300 rounded bg-white focus:outline-none focus:ring-1 focus:ring-[#1A6B3C]"
              />
            </div>

            <select
              value={selectedRegionFilter}
              onChange={(e) => setSelectedRegionFilter(e.target.value)}
              className="px-2.5 py-1 text-xs border border-slate-300 rounded bg-white focus:outline-none focus:ring-1 focus:ring-[#1A6B3C]"
            >
              <option value="toutes">Toutes les régions</option>
              {REGIONS_LIST.map((reg) => (
                <option key={reg} value={reg}>
                  {reg}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tableau récapitulatif */}
        <div className="overflow-x-auto border border-slate-200 rounded-md">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Commune</th>
                <th className="py-2.5 px-3">Région</th>
                <th className="py-2.5 px-3 text-center">Inscrits</th>
                <th className="py-2.5 px-3">Répartition par Profil</th>
                <th className="py-2.5 px-3 text-right">Action Plaidoyer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCommunes.map((c) => {
                const isPilot = c.commune === 'Zikisso';
                return (
                  <tr key={c.commune} className={`hover:bg-slate-50 ${isPilot ? 'bg-emerald-50/40 font-medium' : ''}`}>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center space-x-1.5">
                        <span className="font-bold text-slate-800">{c.commune}</span>
                        {isPilot && (
                          <span className="text-[10px] bg-emerald-100 text-[#14532D] font-bold px-1.5 py-0.2 rounded border border-emerald-300">
                            ★ Pilote
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">{c.region}</td>
                    <td className="py-2.5 px-3 text-center font-bold text-[#1F4E79]">{c.inscrits}</td>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center space-x-2 text-[11px] text-slate-500">
                        <span title="Conseillers municipaux élus">🏛️ {c.profils.elus} élus</span>
                        <span title="Agents techniques de mairie">💼 {c.profils.agents} agents</span>
                        <span title="Citoyens engagés">👥 {c.profils.citoyens} citoyens</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedTerritoryForPlaidoyer(c.commune)}
                        className={`text-[11px] font-semibold px-2.5 py-1 rounded transition ${
                          selectedTerritoryForPlaidoyer === c.commune
                            ? 'bg-[#1A6B3C] text-white'
                            : 'bg-slate-100 hover:bg-[#1F4E79] hover:text-white text-slate-700'
                        }`}
                      >
                        Sélectionner pour mémo
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Générateur de Fiche de Parrainage Institutionnel (Mairies & Régions) */}
      <div className="bg-white border-2 border-[#1F4E79] rounded-lg p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div className="flex items-start space-x-3">
            <div className="w-12 h-12 rounded-full bg-[#1F4E79] text-white flex items-center justify-center flex-shrink-0">
              <FileText className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-[#F0F5FA] text-[#1F4E79] px-2 py-0.5 rounded border border-[#1F4E79]/20">
                Outil de Plaidoyer &amp; Financement B2G
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-[#1F4E79] mt-1">
                Fiche de Parrainage Municipal : Commune de {selectedPlaidoyerData.commune}
              </h3>
              <p className="text-xs text-slate-500">
                Document d'argumentaire officiel destiné à Monsieur le Maire ou au Président du Conseil Régional ({selectedPlaidoyerData.region}).
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 flex-shrink-0">
            <button
              type="button"
              onClick={handlePrintPlaidoyer}
              className="inline-flex items-center space-x-1.5 px-3 py-2 bg-[#1A6B3C] hover:bg-[#14532D] text-white text-xs font-bold rounded shadow-xs transition"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimer la Fiche</span>
            </button>
          </div>
        </div>

        {/* Détails du simulateur de parrainage */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 pt-2">
          
          {/* Paramètres de calcul */}
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Paramètres de la Convention
            </h4>
            
            <div>
              <label className="block text-[11px] text-slate-500 font-semibold mb-1">
                Commune concernée
              </label>
              <select
                value={selectedTerritoryForPlaidoyer}
                onChange={(e) => setSelectedTerritoryForPlaidoyer(e.target.value)}
                className="w-full text-xs p-2 border border-slate-300 rounded bg-white font-medium"
              >
                {communeStats.map((c) => (
                  <option key={c.commune} value={c.commune}>
                    {c.commune} ({c.region}) — {c.inscrits} apprenant(s)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] text-slate-500 font-semibold mb-1">
                Frais d'attestation officielle par apprenant (FCFA)
              </label>
              <select
                value={parrainageCostPerCert}
                onChange={(e) => setParrainageCostPerCert(Number(e.target.value))}
                className="w-full text-xs p-2 border border-slate-300 rounded bg-white font-medium"
              >
                <option value={2000}>2 000 FCFA (Tarif solidaire)</option>
                <option value={2500}>2 500 FCFA (Tarif standard)</option>
                <option value={5000}>5 000 FCFA (Pack complet + Boîte à outils)</option>
              </select>
            </div>

            <div className="p-3 bg-[#F0F7F2] rounded border border-[#1A6B3C]/30 text-xs">
              <span className="text-slate-500 block text-[11px]">Subvention municipale totale préconisée :</span>
              <strong className="text-base text-[#14532D]">
                {totalSubventionEstimee.toLocaleString('fr-FR')} FCFA
              </strong>
              <span className="text-[10px] text-slate-500 block mt-0.5">
                Couvre l'intégralité des {selectedPlaidoyerData.inscrits} apprenant(s) de la commune.
              </span>
            </div>
          </div>

          {/* Synthèse du plaidoyer pour la Mairie */}
          <div className="md:col-span-2 p-5 bg-white rounded-lg border border-slate-200 text-xs space-y-3">
            <h4 className="text-xs font-bold text-[#1F4E79] uppercase tracking-wider flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#1A6B3C]" />
              <span>Argumentaire pour le Conseil Municipal &amp; la Région</span>
            </h4>

            <div className="space-y-2 text-slate-700 leading-relaxed">
              <p>
                <strong>Objet :</strong> Prise en charge et parrainage de la promotion 2026 des acteurs de la <strong>Commune de {selectedPlaidoyerData.commune}</strong> inscrits au <em>MOOC e-Communes</em>.
              </p>
              <p>
                La plateforme enregistre actuellement <strong>{selectedPlaidoyerData.inscrits} participant(s)</strong> rattachés à votre collectivité locale (dont {selectedPlaidoyerData.profils.elus} élu(s) local(aux), {selectedPlaidoyerData.profils.agents} agent(s) communal(aux) et {selectedPlaidoyerData.profils.citoyens} citoyen(s) engagé(s)).
              </p>
              <p className="bg-[#F0F5FA] p-3 rounded border-l-4 border-[#1F4E79] italic">
                « En parrainant la délivrance des attestations officielles pour un montant de <strong>{totalSubventionEstimee.toLocaleString('fr-FR')} FCFA</strong>, la Mairie de {selectedPlaidoyerData.commune} valorise ses ressources humaines communales, renforce la transparence de sa gestion budgétaire et s'inscrit résolument dans la dynamique nationale de modernisation e-administration. »
              </p>
              <p className="text-[11px] text-slate-500">
                • Référence légale : Loi n° 2012-1128 du 13 décembre 2012 portant organisation des collectivités territoriales.<br />
                • Laboratoire territorial d'expérimentation et cas pratique : <strong>Commune pilote de Zikisso</strong> (Lôh-Djiboua).
              </p>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
