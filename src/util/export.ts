import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';
import { Board, MarkSuite, AppState } from '../models';

interface ExportData {
  version: string;
  exportDate: string;
  boards: Board[];
  markSuites: MarkSuite[];
}

export const exportData = (appState: AppState): ExportData => {
  return {
    version: '2.0.0',
    exportDate: new Date().toISOString(),
    boards: appState.boards,
    markSuites: appState.markSuites.filter(s => !s.isBuiltIn && !s.isDynamic),
  };
};

const generateFileName = (): string => {
  const now = new Date();
  const dateString = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;
  return `mark_${dateString}.json`;
};

export const downloadJson = async (data: ExportData): Promise<void> => {
  const json = JSON.stringify(data, null, 2);
  const fileName = generateFileName();

  if (Capacitor.isNativePlatform()) {
    try {
      await Filesystem.writeFile({
        path: fileName,
        data: json,
        directory: Directory.Documents,
        encoding: Encoding.UTF8,
      });
      alert(`Data exported to Documents/${fileName}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      alert('Failed to export data: ' + message);
      throw err;
    }
  } else {
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  }
};
