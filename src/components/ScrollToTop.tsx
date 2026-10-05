import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop :
 * Réinitialise automatiquement le défilement de la fenêtre et des conteneurs
 * principaux vers le haut de la page lors de chaque changement d'URL ou de route,
 * sauf si un hash d'ancrage spécifique (#mon-ancre) est expressément présent.
 */
export const ScrollToTop = () => {
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    // Si une ancre interne est présente dans l'URL (#visite-commune, etc.),
    // on laisse le navigateur ou l'élément cibler l'ancre spécifique
    if (hash) {
      const element = document.getElementById(hash.replace('#', ''));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }

    // Défilement absolu vers le haut de la fenêtre principale
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant' as ScrollBehavior, // immédiat pour éviter tout flottement visuel
    });

    // Également réinitialiser le scroll de documentElement et body (sécurité pour mobiles et navigateurs)
    if (document.documentElement) {
      document.documentElement.scrollTop = 0;
    }
    if (document.body) {
      document.body.scrollTop = 0;
    }

    // Réinitialiser les conteneurs scrollables éventuels s'il y en a dans l'application
    const mainContent = document.querySelector('main');
    if (mainContent) {
      mainContent.scrollTop = 0;
    }
  }, [pathname, search, hash]);

  return null;
};
