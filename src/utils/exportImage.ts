import html2canvas from 'html2canvas-pro';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';

const generateImageFileName = (boardName: string, viewLabel: string): string => {
  const now = new Date();
  const dateStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;
  const sanitizedBoard = boardName.replace(/[^a-zA-Z0-9\u4e00-\u9fff]/g, '_').substring(0, 30);
  const sanitizedLabel = viewLabel.replace(/[^a-zA-Z0-9\u4e00-\u9fff]/g, '_');
  return `${sanitizedBoard}_${sanitizedLabel}_${dateStr}.png`;
};

export const exportViewAsImage = async (
  element: HTMLElement,
  boardName: string,
  viewLabel: string
): Promise<void> => {
  // Clone the element off-screen so modifying it doesn't cause a visual flash
  const clone = element.cloneNode(true) as HTMLElement;
  clone.classList.add('export-capture-area--exporting');
  clone.style.position = 'fixed';
  clone.style.left = '-9999px';
  clone.style.top = '0';
  clone.style.width = `${element.offsetWidth}px`;
  document.body.appendChild(clone);

  try {
    const canvas = await html2canvas(clone, {
      backgroundColor: '#ffffff',
      scale: 2,
      useCORS: true,
      logging: false,
    });

    const dataUrl = canvas.toDataURL('image/png');
    const base64Data = dataUrl.replace(/^data:image\/png;base64,/, '');
    const fileName = generateImageFileName(boardName, viewLabel);

    if (Capacitor.isNativePlatform()) {
      try {
        await Filesystem.writeFile({
          path: fileName,
          data: base64Data,
          directory: Directory.Documents,
        });
        alert(`Image saved to Documents/${fileName}`);
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        console.error('[ExportImage] Failed to save image:', message);
        alert('Failed to save image: ' + message);
        throw err;
      }
    } else {
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = fileName;
      link.click();
    }
  } finally {
    document.body.removeChild(clone);
  }
};
