import { Board, MarkSuite } from '../types';

interface ImportData {
  version: string;
  exportDate: string;
  boards: Board[];
  markSuites?: MarkSuite[];
}

interface ImportResult {
  success: boolean;
  boards?: Board[];
  markSuites?: MarkSuite[];
  error?: string;
}

const isValidBoard = (board: unknown): board is Board => {
  if (typeof board !== 'object' || board === null) return false;
  const b = board as Record<string, unknown>;
  return (
    typeof b.id === 'string' &&
    typeof b.name === 'string' &&
    typeof b.marks === 'object' &&
    typeof b.createdAt === 'number' &&
    typeof b.updatedAt === 'number'
  );
};

const isValidMarkSuite = (suite: unknown): suite is MarkSuite => {
  if (typeof suite !== 'object' || suite === null) return false;
  const s = suite as Record<string, unknown>;
  return (
    typeof s.id === 'string' &&
    typeof s.name === 'string' &&
    Array.isArray(s.marks) &&
    typeof s.isBuiltIn === 'boolean' &&
    typeof s.isDynamic === 'boolean'
  );
};

const isValidImportData = (data: unknown): data is ImportData => {
  if (typeof data !== 'object' || data === null) return false;
  const d = data as Record<string, unknown>;
  if (typeof d.version !== 'string') return false;
  if (typeof d.exportDate !== 'string') return false;
  if (!Array.isArray(d.boards)) return false;
  if (!d.boards.every(isValidBoard)) return false;
  if (d.markSuites !== undefined && !Array.isArray(d.markSuites)) return false;
  if (d.markSuites !== undefined && !d.markSuites.every(isValidMarkSuite)) return false;
  return true;
};

export const parseImportFile = async (file: File): Promise<ImportResult> => {
  return new Promise((resolve) => {
    if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
      resolve({ success: false, error: 'Invalid file type. Please select a JSON file.' });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);

        if (!isValidImportData(data)) {
          resolve({ success: false, error: 'Invalid file structure. Missing required fields.' });
          return;
        }

        resolve({
          success: true,
          boards: data.boards,
          markSuites: data.markSuites || [],
        });
      } catch {
        resolve({ success: false, error: 'Failed to parse JSON file.' });
      }
    };

    reader.onerror = () => {
      resolve({ success: false, error: 'Failed to read file.' });
    };

    reader.readAsText(file);
  });
};

export const mergeImportedBoards = (
  existingBoards: Board[],
  importedBoards: Board[]
): Board[] => {
  const existingNames = new Set(existingBoards.map((b) => b.name));
  const newBoards: Board[] = [];

  for (const board of importedBoards) {
    let name = board.name;
    if (existingNames.has(name)) {
      name = `${name} (imported)`;
    }
    existingNames.add(name);
    newBoards.push({
      ...board,
      id: crypto.randomUUID ? crypto.randomUUID() : `import-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      name,
      recentMarkIds: board.recentMarkIds || [],
    });
  }

  return newBoards;
};

export const mergeImportedSuites = (
  existingSuites: MarkSuite[],
  importedSuites: MarkSuite[]
): MarkSuite[] => {
  const existingNames = new Set(existingSuites.map((s) => s.name));
  const newSuites: MarkSuite[] = [];

  for (const suite of importedSuites) {
    if (suite.isBuiltIn || suite.isDynamic) continue;

    let name = suite.name;
    if (existingNames.has(name)) {
      name = `${name} (imported)`;
    }
    existingNames.add(name);
    newSuites.push({
      ...suite,
      id: crypto.randomUUID ? crypto.randomUUID() : `import-suite-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      name,
    });
  }

  return newSuites;
};
