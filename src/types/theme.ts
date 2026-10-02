export type AppTheme = 'elephants' | 'republicain' | 'foret' | 'epure';

export interface ThemeOption {
  id: AppTheme;
  label: string;
  sublabel: string;
  icon: string;
  previewBg: string;
}

export const THEME_OPTIONS: ThemeOption[] = [
  {
    id: 'elephants',
    label: 'Éléphants de Côte d\'Ivoire',
    sublabel: 'Emblème national et Savane dorée',
    icon: '🐘',
    previewBg: 'bg-amber-100 border-amber-400',
  },
  {
    id: 'republicain',
    label: 'Ivoire Républicain 🇨🇮',
    sublabel: 'Orange, Blanc, Vert et Texture fine',
    icon: '🇨🇮',
    previewBg: 'bg-orange-50 border-emerald-400',
  },
  {
    id: 'foret',
    label: 'Forêt et Terroir Lôh-Djiboua',
    sublabel: 'Vert canopée et Latérite',
    icon: '🌿',
    previewBg: 'bg-emerald-50 border-emerald-500',
  },
  {
    id: 'epure',
    label: 'Classique Épuré',
    sublabel: 'Blanc cassé minimaliste',
    icon: '🏛️',
    previewBg: 'bg-slate-100 border-slate-300',
  },
];
