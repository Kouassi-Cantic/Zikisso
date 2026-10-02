import React from 'react';
import { CheckCircle2, Circle, Clock, FileText } from 'lucide-react';
import { AudioReader } from './AudioReader';
import { FormattedCourseContent } from './FormattedCourseContent';

interface CapsuleCardProps {
  id: string;
  orderNumber: number;
  title: string;
  content: string;
  dureeMinutes?: number;
  isRead: boolean;
  onToggleRead: (capsuleId: string) => void;
}

export const CapsuleCard: React.FC<CapsuleCardProps> = ({
  id,
  orderNumber,
  title,
  content,
  dureeMinutes = 6,
  isRead,
  onToggleRead,
}) => {
  return (
    <article
      id={`capsule-${id}`}
      className={`bg-white rounded-lg border transition-all duration-200 shadow-sm overflow-hidden ${
        isRead ? 'border-emerald-300 ring-1 ring-emerald-100' : 'border-slate-200 hover:border-slate-300'
      }`}
    >
      {/* En-tête de la capsule */}
      <div className="bg-[#F0F5FA] border-b border-slate-200/80 px-4 sm:px-6 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <span
            className={`w-7 h-7 rounded flex items-center justify-center text-xs font-bold transition-colors ${
              isRead ? 'bg-[#1A6B3C] text-white' : 'bg-[#1F4E79] text-white'
            }`}
          >
            {isRead ? '✓' : orderNumber}
          </span>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-[#1F4E79] leading-snug">
              {title}
            </h3>
            <div className="flex items-center space-x-3 text-[11px] text-slate-500 mt-0.5">
              <span className="flex items-center space-x-1">
                <FileText className="w-3 h-3 text-slate-400" />
                <span>Capsule {orderNumber}</span>
              </span>
              <span>•</span>
              <span className="flex items-center space-x-1 text-slate-600 font-medium">
                <Clock className="w-3 h-3 text-amber-600" />
                <span>{dureeMinutes} min de lecture</span>
              </span>
            </div>
          </div>
        </div>

        {/* Actions : Écoute Audio + Bouton Lu et assimilé */}
        <div className="flex items-center space-x-2 self-start sm:self-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200/60 w-full sm:w-auto justify-between sm:justify-end">
          <AudioReader
            text={`${title}. ${content}`}
            title={`Capsule ${orderNumber} : ${title}`}
            variant="button"
          />

          <button
            type="button"
            onClick={() => onToggleRead(id)}
            className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded text-xs font-semibold transition border ${
              isRead
                ? 'bg-emerald-50 text-[#1A6B3C] border-emerald-300 hover:bg-emerald-100'
                : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-300 hover:text-[#1A6B3C]'
            }`}
            title={isRead ? 'Marquer comme non lu' : 'Marquer comme lu et assimilé'}
          >
            {isRead ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-[#1A6B3C]" />
                <span>Lu et assimilé</span>
              </>
            ) : (
              <>
                <Circle className="w-3.5 h-3.5 text-slate-400" />
                <span>Marquer comme lu</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Contenu textuel de la capsule */}
      <div className="p-4 sm:p-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
        <FormattedCourseContent content={content} />
      </div>
    </article>
  );
};
