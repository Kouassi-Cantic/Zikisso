import React from 'react';
import { X, ShieldCheck, Scale, FileText } from 'lucide-react';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'mentions' | 'cgu_rgpd';
}

export const LegalModal: React.FC<LegalModalProps> = ({ isOpen, onClose, type }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-150">
        
        {/* En-tête */}
        <div className="bg-[#1F4E79] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            {type === 'mentions' ? (
              <Scale className="w-5 h-5 text-emerald-300" />
            ) : (
              <ShieldCheck className="w-5 h-5 text-emerald-300" />
            )}
            <h2 className="text-base sm:text-lg font-bold">
              {type === 'mentions' ? 'Mentions Légales et Institutionnelles' : 'Conditions Générales d’Utilisation et Protection des Données (RGPD)'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition cursor-pointer"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corps */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
          {type === 'mentions' ? (
            <>
              <div>
                <h3 className="font-bold text-[#1F4E79] text-sm mb-1">1. Éditeur de la Plateforme</h3>
                <p>
                  Le <strong>MOOC e-Communes — Gouvernance Municipale et Transformation Digitale</strong> est une initiative académique et civique d'intérêt public pour la République de Côte d'Ivoire.
                </p>
                <p className="mt-1">
                  <strong>Gestionnaire en chef :</strong> M. Kouassi Ouréga Goblé, Informaticien, Consultant Digital et Intelligence Artificielle.<br />
                  <strong>Collectivité pilote d'expérimentation :</strong> Commune de Zikisso (Hôtel de Ville de Zikisso, Département de Lakota, Région du Lôh-Djiboua).<br />
                  <strong>Partenaire civique et éducatif :</strong> Plateforme citoyenne Klo-Liké.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-[#1F4E79] text-sm mb-1">2. Cadre Juridique et Référentiels</h3>
                <p>
                  Les contenus pédagogiques s'appuient strictement sur les lois et règlements ivoiriens :
                </p>
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  <li>Loi n° 2012-1128 du 13 décembre 2012 portant organisation des collectivités territoriales en Côte d'Ivoire.</li>
                  <li>Normes et instructions de la Direction Générale de la Décentralisation et du Développement Local (DGDDL).</li>
                  <li>Dispositions relatives à la modernisation de l'état civil (ONECI) et aux principes de transparence des finances publiques locales.</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-[#1F4E79] text-sm mb-1">3. Propriété Intellectuelle et Usage</h3>
                <p>
                  Les guides, fascicules PDF et capsules méthodologiques sont mis à disposition sous licence libre d'accès pour les collectivités territoriales, les élus, les cadres municipaux et la société civile, dans le but d'élever les compétences locales.
                </p>
              </div>
            </>
          ) : (
            <>
              <div>
                <h3 className="font-bold text-[#1F4E79] text-sm mb-1">1. Protection des Données Personnelles</h3>
                <p>
                  Conformément aux lois ivoiriennes sur la protection des données à caractère personnel (ARTCI) et aux standards internationaux de protection des données, les informations recueillies (nom, email, commune de rattachement, notes d'évaluations) sont exclusivement réservées à la délivrance des attestations officielles et à la gestion du parcours d'apprentissage.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-[#1F4E79] text-sm mb-1">2. Traçabilité des Attestations et Registre Public</h3>
                <p>
                  Chaque attestation délivrée par le MOOC e-Communes comporte un identifiant cryptographique unique (ex. ZIK-2026-XXXXX) permettant sa vérification instantanée par les employeurs, concours administratifs et municipalités partenaires dans le registre public d'authenticité.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-[#1F4E79] text-sm mb-1">3. Droit d'Accès, de Rectification et Désabonnement</h3>
                <p>
                  Tout apprenant ou abonné à la veille stratégique dispose d'un droit permanent d'accès, de rectification et de suppression de ses données sur simple demande ou directement depuis son espace personnel. Les abonnés à la newsletter peuvent se désinscrire à tout moment d'un simple clic.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-[#1F4E79] text-sm mb-1">4. Éthique et Neutralité Républicaine</h3>
                <p>
                  La plateforme promeut une gouvernance transparente, républicaine et non partisane, au bénéfice exclusif des populations et du développement équitable de l'ensemble des 31 régions et 2 districts de Côte d'Ivoire.
                </p>
              </div>
            </>
          )}
        </div>

        {/* Pied */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#1F4E79] hover:bg-[#153755] text-white text-xs font-bold rounded-lg transition"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
