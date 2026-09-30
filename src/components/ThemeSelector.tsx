import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { THEME_OPTIONS } from '../types/theme';
import { Palette, Check, Sparkles } from 'lucide-react';

export const ThemeSelector: React.FC = () => {
  const { currentTheme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeOption = THEME_OPTIONS.find((t) => t.id === currentTheme) || THEME_OPTIONS[0];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center space-x-1.5 text-xs font-semibold text-white/90 hover:text-white bg-white/10 hover:bg-white/20 border border-white/20 px-2.5 py-1.5 rounded-md transition shadow-2xs"
        title="Changer l'ambiance visuelle du fond de page"
      >
        <span className="text-sm">{activeOption.icon}</span>
        <span className="hidden xl:inline text-[11px] font-medium tracking-tight">
          {activeOption.label}
        </span>
        <Palette className="w-3.5 h-3.5 text-amber-300 ml-0.5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in-50 duration-150">
          <div className="px-3 py-2 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center space-x-1.5 text-[#1F4E79] font-bold text-xs">
              <Palette className="w-4 h-4 text-[#C55A11]" />
              <span>Ambiance &amp; Fond de Page</span>
            </div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
              4 Thèmes
            </span>
          </div>

          <div className="p-1.5 space-y-1">
            {THEME_OPTIONS.map((theme) => {
              const isSelected = theme.id === currentTheme;
              return (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => {
                    setTheme(theme.id);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left p-2 rounded-md flex items-start space-x-2.5 transition text-xs ${
                    isSelected
                      ? 'bg-amber-50/80 border border-amber-300 text-slate-900 font-medium'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span className="text-lg flex-shrink-0 mt-0.5">{theme.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className={`font-semibold ${isSelected ? 'text-[#1F4E79]' : 'text-slate-800'}`}>
                        {theme.label}
                      </span>
                      {isSelected && (
                        <Check className="w-4 h-4 text-[#1A6B3C] flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      {theme.sublabel}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="px-3 pt-2 pb-1 border-t border-slate-100 text-[10px] text-slate-500 flex items-center space-x-1">
            <Sparkles className="w-3 h-3 text-amber-500 flex-shrink-0" />
            <span>Fond par défaut : Éléphants &amp; Savane ivoirienne</span>
          </div>
        </div>
      )}
    </div>
  );
};
