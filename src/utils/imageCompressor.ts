// Utilitaire pour optimiser et compresser les images téléversées côté client
// Produit un Data URL léger (JPEG/WebP) parfaitement stockable dans Firestore (< 200 Ko)
export const processAndCompressImage = (
  file: File,
  maxWidth = 1000,
  maxHeight = 1000,
  quality = 0.8
): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      return reject(new Error('Le fichier sélectionné doit être une image (JPG, PNG, WebP).'));
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Impossible de lire le fichier image.'));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error("Format d'image non supporté ou fichier corrompu."));
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return reject(new Error('Erreur de traitement graphique dans le navigateur.'));
        }

        ctx.drawImage(img, 0, 0, width, height);
        // Exporte en image/jpeg compressée
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
};
