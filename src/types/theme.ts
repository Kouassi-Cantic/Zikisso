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
    sublabel: 'Emblème national & Savane dorée',
    icon: '🐘',
    previewBg: 'bg-amber-100 border-amber-400',
  },
  {
    id: 'republicain',
    label: 'Ivoire Républicain 🇨🇮',
    sublabel: 'Orange, Blanc, Vert & Texture fine',
    icon: '🇨🇮',
    previewBg: 'bg-orange-50 border-emerald-400',
  },
  {
    id: 'foret',
    label: 'Forêt & Terroir Lôh-Djiboua',
    sublabel: 'Vert canopée & Latérite',
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
