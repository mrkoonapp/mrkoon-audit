import { useCallback } from 'react';

// ----------------------------------------------------------------------

export function useWatermark() {
  const addWatermark = useCallback(
    async (file: File): Promise<File> =>
      new Promise((resolve, reject) => {
        const img = new Image();
        const watermark = new Image();
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        watermark.src = '/migrated/dashboard/watermark.png';
        watermark.onload = () => {
          img.onload = () => {
            try {
              canvas.width = img.width;
              canvas.height = img.height;

              if (!ctx) {
                reject(new Error('Failed to get canvas context'));
                return;
              }

              ctx.drawImage(img, 0, 0);

              const watermarkWidth = img.width * 0.12;
              const watermarkHeight = (watermark.height * watermarkWidth) / watermark.width;

              const spacingX = watermarkWidth * 1.8;
              const spacingY = watermarkHeight * 1.8;

              ctx.globalAlpha = 0.2;

              const padding = Math.max(watermarkWidth, watermarkHeight);

              for (let y = -padding; y < img.height + padding; y += spacingY) {
                for (let x = -padding; x < img.width + padding; x += spacingX) {
                  ctx.save();
                  ctx.translate(x + watermarkWidth / 2, y + watermarkHeight / 2);
                  ctx.rotate(-15 * (Math.PI / 180));
                  ctx.drawImage(
                    watermark,
                    -watermarkWidth / 2,
                    -watermarkHeight / 2,
                    watermarkWidth,
                    watermarkHeight
                  );
                  ctx.restore();
                }
              }

              ctx.globalAlpha = 1.0;

              canvas.toBlob((blob) => {
                if (blob) {
                  resolve(new File([blob], file.name, { type: file.type }));
                } else {
                  reject(new Error('Failed to create watermarked image'));
                }
              }, file.type);
            } catch (error) {
              reject(error);
            }
          };

          img.onerror = () => reject(new Error('Failed to load image'));

          const reader = new FileReader();
          reader.onload = (e) => {
            img.src = e.target?.result as string;
          };
          reader.onerror = () => reject(new Error('Failed to read file'));
          reader.readAsDataURL(file);
        };

        watermark.onerror = () => reject(new Error('Failed to load watermark image'));
      }),
    []
  );

  return { addWatermark };
}
