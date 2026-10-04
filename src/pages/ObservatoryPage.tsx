import React from 'react';
import { TerritoryObservatory } from '../components/TerritoryObservatory';
import { Link } from 'react-router-dom';
import { ArrowLeft, Building2, MapPin, Sparkles, GraduationCap } from 'lucide-react';

export const ObservatoryPage: React.FC = () => {
  return (
    <div className="space-y-6 pb-12">
      {/* En-tête de retour et présentation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <Link
          to="/"
          className="inline-flex items-center space-x-2 text-xs sm:text-sm font-semibold text-[#1F4E79] hover:text-[#C55A11] transition-colors bg-white px-3 py-1.5 rounded-md border border-slate-200 shadow-2xs self-start"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour à l'accueil</span>
        </Link>

        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#1A6B3C] bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-[#1A6B3C]" />
            <span>Transparence & Impact National</span>
          </span>
          <Link
            to="/register"
            className="inline-flex items-center space-x-1 text-xs font-bold text-white bg-[#C55A11] hover:bg-[#A3480C] px-3 py-1 rounded-md transition shadow-2xs"
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Rejoindre la promotion</span>
          </Link>
        </div>
      </div>

      {/* Bannière d'introduction publique */}
      <div className="bg-gradient-to-r from-[#1F4E79] via-[#1A365D] to-[#142A4A] rounded-2xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs font-semibold">
            <Building2 className="w-3.5 h-3.5" />
            <span>31 Régions • 2 Districts Autonomes • Commune Pilote de Zikisso</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Observatoire Territorial et Cartographie du Déploiement
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
            Consultez en temps réel l'engagement des communes ivoiriennes, la répartition des apprenants (élus municipaux, cadres techniques, citoyens engagés) et les simulations de parrainage de certification par les collectivités locales.
          </p>
        </div>

        {/* Effet décoratif d'arrière-plan */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none flex items-center justify-center">
          <MapPin className="w-64 h-64 text-white" />
        </div>
      </div>

      {/* Composant Observatoire Territorial complet */}
      <TerritoryObservatory />
    </div>
  );
};
