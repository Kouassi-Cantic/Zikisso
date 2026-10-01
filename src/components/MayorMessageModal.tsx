import React, { useState, useEffect } from 'react';
import type { MayorMessageData } from '../data/mayorsMessages';
import { getMayorMessageForCommune } from '../services/mayorsService';
import { 
  Building2, 
  X, 
  MapPin, 
  Award, 
  Quote, 
  CheckCircle2, 
  Sparkles, 
  UserCheck, 
  ArrowRight,
  ShieldCheck,
  Loader2
} from 'lucide-react';

interface MayorMessageModalProps {
  isOpen: boolean;
  commune: string;
  onClose: () => void;
  onGoToAuth?: () => void;
}

export const MayorMessageModal: React.FC<MayorMessageModalProps> = ({
  isOpen,
  commune,
  onClose,
  onGoToAuth,
}) => {
  const [data, setData] = useState<MayorMessageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && commune) {
      setLoading(true);
      getMayorMessageForCommune(commune)
        .then((res) => setData(res))
        .catch(() => setData(null))
        .finally(() => setLoading(false));
    }
  }, [isOpen, commune]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Bandeau tricolore républicain supérieur */}
        <div className="h-1.5 flex w-full">
          <div className="w-1/3 bg-[#E06A1B]" />
          <div className="w-1/3 bg-white" />
          <div className="w-1/3 bg-[#1A6B3C]" />
        </div>

        {/* En-tête protocolaire */}
        <div className="bg-gradient-to-r from-[#1F4E79] via-[#153755] to-[#1F4E79] text-white px-6 py-5 flex items-start justify-between">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-emerald-300 shadow-inner flex-shrink-0">
              <Building2 className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <div className="inline-flex items-center space-x-1.5 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-0.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Parrainage Institutionnel &amp; Encouragements</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight">
                Commune de {commune}
              </h2>
              <p className="text-xs text-blue-200">
                Région : {data?.region || 'Collectivité de Côte d’Ivoire'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition cursor-pointer"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corps du mot du Maire */}
        <div className="p-6 sm:p-7 overflow-y-auto space-y-6 flex-1 text-slate-800">
          
          {loading ? (
            <div className="py-12 text-center text-slate-500 space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-[#1F4E79] mx-auto" />
              <p className="text-xs font-semibold">Réception du mot officiel de la Mairie...</p>
            </div>
          ) : data ? (
            <>
              {/* Titre & Émetteur */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    Message solennel délivré par :
                  </span>
                  <h3 className="text-base font-extrabold text-[#1F4E79] mt-0.5">
                    {data.nomMaire || `Le Maire de ${commune}`}
                  </h3>
                  <p className="text-xs text-slate-600 font-medium">
                    {data.titreOfficiel || `Mairie de la Commune de ${commune}`}
                  </p>
                </div>

                <span className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#14532D] bg-[#F0F7F2] border border-[#1A6B3C]/30 px-3 py-1 rounded-full self-start sm:self-auto">
                  <UserCheck className="w-3.5 h-3.5 text-[#1A6B3C]" />
                  <span>Collectivité Partenaire</span>
                </span>
              </div>

              {/* Citation clé */}
              {data.citationCle && (
                <div className="relative p-4 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50/40 border-l-4 border-[#C55A11] shadow-2xs">
                  <Quote className="w-5 h-5 text-[#C55A11]/40 absolute top-2 right-3" />
                  <p className="text-xs sm:text-sm font-semibold text-[#8C3D0B] italic leading-relaxed pr-6">
                    {data.citationCle}
                  </p>
                </div>
              )}

              {/* Texte du message */}
              <div className="space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed font-serif whitespace-pre-line bg-slate-50/70 p-5 rounded-xl border border-slate-200">
                {data.messageBienvenue}
              </div>

              {/* Priorités et engagements municipaux */}
              {data.prioritesMunicipales && data.prioritesMunicipales.length > 0 && (
                <div className="space-y-2.5 pt-1">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#1A6B3C]" />
                    <span>Priorités d'action de la Commune de {commune}</span>
                  </h4>
                  <ul className="grid grid-cols-1 gap-2 text-xs text-slate-700">
                    {data.prioritesMunicipales.map((prio, idx) => (
                      <li key={idx} className="flex items-start space-x-2 bg-white p-2.5 rounded-lg border border-slate-200 shadow-2xs">
                        <CheckCircle2 className="w-4 h-4 text-[#1A6B3C] flex-shrink-0 mt-0.5" />
                        <span>{prio}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8 text-slate-500 text-xs">
              Aucun message disponible pour cette commune.
            </div>
          )}

        </div>

        {/* Pied de page avec appel à l'action */}
        <div className="p-4 sm:px-6 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-xs text-slate-500 flex items-center space-x-1.5">
            <Award className="w-4 h-4 text-[#C55A11]" />
            <span>Ce mot restera accessible sur votre profil personnel.</span>
          </div>

          <div className="flex items-center space-x-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 transition cursor-pointer"
            >
              Fermer
            </button>
            {onGoToAuth && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onGoToAuth();
                }}
                className="inline-flex items-center space-x-2 px-5 py-2 text-xs sm:text-sm font-bold text-white bg-[#1F4E79] hover:bg-[#153755] rounded-lg shadow transition cursor-pointer"
              >
                <span>Rejoindre la formation</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
