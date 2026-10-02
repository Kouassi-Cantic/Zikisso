import React from 'react';
import { 
  Scale, 
  AlertTriangle, 
  MapPin, 
  BookMarked, 
  Lightbulb, 
  CheckCircle2, 
  FileText, 
  ShieldCheck,
  Building2,
  HelpCircle
} from 'lucide-react';

interface FormattedContentProps {
  content: string;
}

export const FormattedCourseContent: React.FC<FormattedContentProps> = ({ content }) => {
  // Découper le texte en blocs par double saut de ligne
  const rawBlocks = content.split(/\n\s*\n/).map(b => b.trim()).filter(Boolean);

  return (
    <div className="space-y-4 font-sans">
      {rawBlocks.map((block, idx) => {
        // 1. Détection des titres de sections de cours (ex: "### 1. Fondements Juridiques", "## Titre", ou "SECTION 1:")
        if (block.startsWith('###') || block.startsWith('##')) {
          const cleanTitle = block.replace(/^#+\s*/, '');
          const isLegal = /juridique|loi|code|décret|article|institution/i.test(cleanTitle);
          const isTerrain = /zikisso|terrain|cas pratique|application|commune/i.test(cleanTitle);
          const isVigilance = /vigilance|piège|attention|sanction|nullité/i.test(cleanTitle);

          return (
            <div key={idx} className="pt-3 pb-1 border-b border-slate-200/70 flex items-center space-x-2">
              {isLegal && <Scale className="w-4 h-4 text-[#1F4E79]" />}
              {isTerrain && <MapPin className="w-4 h-4 text-[#1A6B3C]" />}
              {isVigilance && <AlertTriangle className="w-4 h-4 text-[#C55A11]" />}
              {!isLegal && !isTerrain && !isVigilance && <BookMarked className="w-4 h-4 text-[#1F4E79]" />}
              <h4 className="text-sm sm:text-base font-bold text-[#1F4E79] tracking-tight">
                {cleanTitle}
              </h4>
            </div>
          );
        }

        // 2. Encadré "Point de Vigilance de l'Élu et de l'Agent" ou "Attention"
        if (block.startsWith('⚠️') || block.toUpperCase().startsWith('POINT DE VIGILANCE') || block.toUpperCase().startsWith('ATTENTION :') || block.toUpperCase().startsWith('PIÈGE :')) {
          return (
            <div key={idx} className="p-4 rounded-xl bg-amber-50/90 border border-amber-300 text-amber-950 text-xs sm:text-sm shadow-2xs">
              <div className="flex items-center space-x-2 font-bold text-[#C55A11] mb-1.5">
                <AlertTriangle className="w-4 h-4 text-[#C55A11] flex-shrink-0" />
                <span className="uppercase tracking-wider text-[11px]">Point de vigilance institutionnelle et risque juridique</span>
              </div>
              <p className="leading-relaxed whitespace-pre-line text-slate-800">
                {block.replace(/^⚠️\s*/, '').replace(/^(POINT DE VIGILANCE|ATTENTION|PIÈGE)\s*:\s*/i, '')}
              </p>
            </div>
          );
        }

        // 3. Encadré "Cas Pratique Zikisso et Réalités Communales"
        if (block.startsWith('📍') || block.toUpperCase().startsWith('CAS PRATIQUE ZIKISSO') || block.toUpperCase().startsWith('FOCUS TERRAIN')) {
          return (
            <div key={idx} className="p-4 rounded-xl bg-emerald-50/80 border border-emerald-300 text-[#14532D] text-xs sm:text-sm shadow-2xs">
              <div className="flex items-center space-x-2 font-bold text-[#1A6B3C] mb-1.5">
                <MapPin className="w-4 h-4 text-[#1A6B3C] flex-shrink-0" />
                <span className="uppercase tracking-wider text-[11px]">Cas d'application territorial — Commune pilote de Zikisso</span>
              </div>
              <p className="leading-relaxed whitespace-pre-line text-slate-800">
                {block.replace(/^📍\s*/, '').replace(/^(CAS PRATIQUE ZIKISSO|FOCUS TERRAIN)\s*:\s*/i, '')}
              </p>
            </div>
          );
        }

        // 4. Encadré "Références Légales et Normes Ivoiriennes"
        if (block.startsWith('⚖️') || block.toUpperCase().startsWith('TEXTES DE RÉFÉRENCE') || block.toUpperCase().startsWith('BASE LÉGALE')) {
          return (
            <div key={idx} className="p-4 rounded-xl bg-blue-50/80 border border-blue-200 text-[#1F4E79] text-xs sm:text-sm shadow-2xs">
              <div className="flex items-center space-x-2 font-bold text-[#1F4E79] mb-1.5">
                <Scale className="w-4 h-4 text-[#1F4E79] flex-shrink-0" />
                <span className="uppercase tracking-wider text-[11px]">Cadre légal républicain et Normes nationales (DGDDL / UVICOCI)</span>
              </div>
              <p className="leading-relaxed whitespace-pre-line text-slate-800">
                {block.replace(/^⚖️\s*/, '').replace(/^(TEXTES DE RÉFÉRENCE|BASE LÉGALE)\s*:\s*/i, '')}
              </p>
            </div>
          );
        }

        // 5. Encadré "Recommandation Stratégique pour l'Élu / la Mairie"
        if (block.startsWith('💡') || block.toUpperCase().startsWith('RECOMMANDATION :') || block.toUpperCase().startsWith('BONNE PRATIQUE')) {
          return (
            <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs sm:text-sm shadow-2xs">
              <div className="flex items-center space-x-2 font-bold text-[#1F4E79] mb-1.5">
                <Lightbulb className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <span className="uppercase tracking-wider text-[11px]">Recommandation de gouvernance pour l'exécutif communal</span>
              </div>
              <p className="leading-relaxed whitespace-pre-line text-slate-700">
                {block.replace(/^💡\s*/, '').replace(/^(RECOMMANDATION|BONNE PRATIQUE)\s*:\s*/i, '')}
              </p>
            </div>
          );
        }

        // 6. Liste à puces ou numérotée
        if (/^(\d+\.|\-|\•)\s+/.test(block)) {
          const lines = block.split('\n');
          return (
            <ul key={idx} className="space-y-2 py-1 pl-1">
              {lines.map((line, lIdx) => {
                const isItem = /^(\d+\.|\-|\•)\s+/.test(line);
                const cleanLine = line.replace(/^(\d+\.|\-|\•)\s+/, '');
                return (
                  <li key={lIdx} className="flex items-start space-x-2.5 text-xs sm:text-sm text-slate-700 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1A6B3C] flex-shrink-0 mt-2" />
                    <span>{cleanLine}</span>
                  </li>
                );
              })}
            </ul>
          );
        }

        // 7. Paragraphe régulier avec support du gras inline (**mot**)
        const parts = block.split(/(\*\*[^*]+\*\*)/g);
        return (
          <p key={idx} className="text-xs sm:text-sm text-slate-700 leading-relaxed text-justify">
            {parts.map((part, pIdx) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                return (
                  <strong key={pIdx} className="font-bold text-slate-900">
                    {part.slice(2, -2)}
                  </strong>
                );
              }
              return part;
            })}
          </p>
        );
      })}
    </div>
  );
};
