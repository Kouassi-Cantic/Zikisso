import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play, Pause, Square, FastForward, Check } from 'lucide-react';

interface AudioReaderProps {
  text: string;
  title?: string;
  variant?: 'button' | 'bar' | 'compact';
  className?: string;
  onEnd?: () => void;
}

export const AudioReader: React.FC<AudioReaderProps> = ({
  text,
  title,
  variant = 'button',
  className = '',
  onEnd,
}) => {
  const [isSupported, setIsSupported] = useState<boolean>(true);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [playbackRate, setPlaybackRate] = useState<number>(1.0);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Initialisation et détection des voix françaises
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setIsSupported(false);
      return;
    }

    const updateVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      // Recherche prioritaire d'une voix française naturelle
      const frenchVoice = voices.find(
        (v) => v.lang.toLowerCase().startsWith('fr') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Premium'))
      ) || voices.find((v) => v.lang.toLowerCase().startsWith('fr')) || voices[0] || null;

      setSelectedVoice(frenchVoice);
    };

    updateVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }

    // Nettoyage lors du démontage du composant
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Gestion de la lecture
  const handlePlay = () => {
    if (!isSupported) return;

    // Si la lecture était en pause, on reprend
    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsPlaying(true);
      return;
    }

    // Annule toute lecture précédente en cours dans le navigateur
    window.speechSynthesis.cancel();

    // Préparation du texte à lire (nettoyage des astérisques markdown et puces)
    const cleanText = text
      .replace(/[*#_`]/g, '')
      .replace(/•/g, ', ')
      .trim();

    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utteranceRef.current = utterance;

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    utterance.lang = 'fr-FR';
    utterance.rate = playbackRate;
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
      if (onEnd) onEnd();
    };

    utterance.onerror = (e) => {
      console.warn('Erreur synthèse vocale:', e);
      setIsPlaying(false);
      setIsPaused(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const handlePause = () => {
    if (isPlaying && !isPaused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
      setIsPlaying(false);
    }
  };

  const handleStop = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
  };

  const cyclePlaybackRate = () => {
    const rates = [1.0, 1.25, 1.5];
    const currentIndex = rates.indexOf(playbackRate);
    const nextRate = rates[(currentIndex + 1) % rates.length];
    setPlaybackRate(nextRate);

    // Si en cours de lecture, on relance avec le nouveau débit
    if (isPlaying || isPaused) {
      handleStop();
    }
  };

  if (!isSupported) {
    return null; // Dégradation gracieuse si le navigateur ne supporte pas l'API
  }

  // --- 1. VARIANT COMPACT (Bouton discret pour les listes ou définitions) ---
  if (variant === 'compact') {
    return (
      <div className={`inline-flex items-center space-x-1 ${className}`}>
        {isPlaying ? (
          <button
            type="button"
            onClick={handlePause}
            className="p-1 rounded text-[#C55A11] bg-amber-50 hover:bg-amber-100 transition"
            title="Mettre en pause"
          >
            <Pause className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handlePlay}
            className="p-1 rounded text-[#1F4E79] bg-blue-50 hover:bg-blue-100 transition"
            title="Écouter la définition"
          >
            <Volume2 className="w-3.5 h-3.5" />
          </button>
        )}
        {(isPlaying || isPaused) && (
          <button
            type="button"
            onClick={handleStop}
            className="p-1 rounded text-slate-400 hover:text-red-600 transition"
            title="Arrêter la lecture"
          >
            <Square className="w-3 h-3" />
          </button>
        )}
      </div>
    );
  }

  // --- 2. VARIANT BAR (Barre d'écoute complète) ---
  if (variant === 'bar') {
    return (
      <div className={`bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-lg p-3 sm:p-4 shadow-sm border border-slate-700 flex flex-wrap items-center justify-between gap-3 ${className}`}>
        <div className="flex items-center space-x-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isPlaying ? 'bg-[#1A6B3C] animate-pulse text-white' : 'bg-slate-700 text-slate-300'}`}>
            <Volume2 className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-white tracking-wide">
              {title || 'Lecture audio de la capsule'}
            </p>
            <p className="text-[11px] text-slate-300 flex items-center space-x-2">
              <span>{isPlaying ? 'Lecture audio en cours...' : isPaused ? 'Lecture en pause' : 'Synthèse vocale native'}</span>
              {isPlaying && (
                <span className="flex items-center space-x-0.5 text-emerald-400">
                  <span className="w-1 h-2 bg-emerald-400 animate-bounce"></span>
                  <span className="w-1 h-3 bg-emerald-400 animate-bounce delay-75"></span>
                  <span className="w-1 h-1.5 bg-emerald-400 animate-bounce delay-150"></span>
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {!isPlaying && !isPaused ? (
            <button
              type="button"
              onClick={handlePlay}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-md bg-[#1A6B3C] hover:bg-[#14532D] text-white text-xs font-bold transition shadow-xs"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Écouter</span>
            </button>
          ) : isPlaying ? (
            <button
              type="button"
              onClick={handlePause}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-md bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold transition shadow-xs"
            >
              <Pause className="w-3.5 h-3.5 fill-current" />
              <span>Pause</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handlePlay}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-md bg-[#1A6B3C] hover:bg-[#14532D] text-white text-xs font-bold transition shadow-xs"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Reprendre</span>
            </button>
          )}

          {(isPlaying || isPaused) && (
            <button
              type="button"
              onClick={handleStop}
              className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-md bg-slate-700 hover:bg-red-800 text-slate-200 hover:text-white text-xs transition"
              title="Arrêter la lecture"
            >
              <Square className="w-3 h-3 fill-current" />
              <span>Stop</span>
            </button>
          )}

          <button
            type="button"
            onClick={cyclePlaybackRate}
            className="px-2 py-1.5 rounded-md bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white text-[11px] font-mono font-bold transition"
            title="Modifier la vitesse de lecture"
          >
            {playbackRate}x
          </button>
        </div>
      </div>
    );
  }

  // --- 3. VARIANT BUTTON (Bouton par défaut intégré à l'en-tête de capsule) ---
  return (
    <div className={`inline-flex items-center space-x-1.5 ${className}`}>
      {!isPlaying && !isPaused ? (
        <button
          type="button"
          onClick={handlePlay}
          className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded bg-white hover:bg-blue-50 text-[#1F4E79] hover:text-[#1F4E79] border border-slate-200 hover:border-blue-300 text-xs font-semibold shadow-2xs transition"
          title="Écouter cette capsule"
        >
          <Volume2 className="w-3.5 h-3.5 text-[#1F4E79]" />
          <span>Écouter</span>
        </button>
      ) : isPlaying ? (
        <div className="inline-flex items-center space-x-1 bg-amber-50 border border-amber-300 px-2 py-0.5 rounded text-xs">
          <span className="flex items-center space-x-0.5 mr-1">
            <span className="w-1 h-2 bg-[#C55A11] animate-bounce"></span>
            <span className="w-1 h-3 bg-[#C55A11] animate-bounce delay-75"></span>
          </span>
          <button
            type="button"
            onClick={handlePause}
            className="font-bold text-[#C55A11] hover:underline"
            title="Pause"
          >
            Pause
          </button>
          <span className="text-slate-300">|</span>
          <button
            type="button"
            onClick={handleStop}
            className="text-slate-500 hover:text-red-600"
            title="Arrêter"
          >
            <Square className="w-3 h-3 fill-current" />
          </button>
        </div>
      ) : (
        <div className="inline-flex items-center space-x-1 bg-slate-100 border border-slate-300 px-2 py-0.5 rounded text-xs">
          <button
            type="button"
            onClick={handlePlay}
            className="font-bold text-[#1F4E79] hover:underline flex items-center space-x-1"
          >
            <Play className="w-2.5 h-2.5 fill-current" />
            <span>Reprendre</span>
          </button>
          <span className="text-slate-300">|</span>
          <button
            type="button"
            onClick={handleStop}
            className="text-slate-500 hover:text-red-600"
            title="Arrêter"
          >
            <Square className="w-3 h-3 fill-current" />
          </button>
        </div>
      )}

      {/* Sélecteur de vitesse de lecture */}
      {(isPlaying || isPaused) && (
        <button
          type="button"
          onClick={cyclePlaybackRate}
          className="text-[10px] font-mono font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded border border-slate-200 transition"
          title="Vitesse"
        >
          {playbackRate}x
        </button>
      )}
    </div>
  );
};
