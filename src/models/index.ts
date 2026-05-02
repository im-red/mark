export interface Mark {
    id: string;
    emojis: string[];
    backgroundColor: string;
    name?: string;
}

export interface MarkSuite {
    id: string;
    name: string;
    marks: Mark[];
    isBuiltIn: boolean;
    isDynamic: boolean;
}

export interface Board {
    id: string;
    name: string;
    marks: Record<string, string>;
    comments: Record<string, string>;
    recentMarkIds: string[];
    createdAt: number;
    updatedAt: number;
}

export interface AppState {
    boards: Board[];
    markSuites: MarkSuite[];
    currentBoardId: string | null;
}

export const MOOD_SUITE_ID = 'mood-suite';
export const CHECKMARKS_SUITE_ID = 'checkmarks-suite';
export const NUMBERS_0_10_SUITE_ID = 'numbers-0-10-suite';
export const NUMBERS_00_100_SUITE_ID = 'numbers-00-100-suite';
export const RECENT_SUITE_ID = 'recent-suite';

export const MOOD_MARKS: Mark[] = [
    { id: 'mood-1', emojis: ['😣'], backgroundColor: '#ffbaba', name: 'Very Sad' },
    { id: 'mood-2', emojis: ['😔'], backgroundColor: '#fce8e3', name: 'Sad' },
    { id: 'mood-3', emojis: ['😐'], backgroundColor: '#f5f5f4', name: 'Neutral' },
    { id: 'mood-4', emojis: ['😊'], backgroundColor: '#e8f5e9', name: 'Happy' },
    { id: 'mood-5', emojis: ['😄'], backgroundColor: '#c0fad4', name: 'Very Happy' },
];

export const CHECKMARKS_MARKS: Mark[] = [
    { id: 'checkmark', emojis: ['✓'], backgroundColor: '#dcfce7', name: 'Check' },
    { id: 'cross', emojis: ['✗'], backgroundColor: '#fde8e8', name: 'Cross' },
    { id: 'question', emojis: ['?'], backgroundColor: '#fef3c7', name: 'Question' },
];

const NUMBER_EMOJIS = ['0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];

export const NUMBERS_0_10_MARKS: Mark[] = [
    ...Array.from({ length: 11 }, (_, i) => ({
        id: `num-${i}`,
        emojis: [NUMBER_EMOJIS[i]],
        backgroundColor: '#e0f2fe',
        name: `${i}`,
    })),
];

export const NUMBERS_00_100_MARKS: Mark[] = [
    ...Array.from({ length: 100 }, (_, i) => ({
        id: `num-${String(i).padStart(2, '0')}`,
        emojis: [`${String(i).padStart(2, '0')}`],
        backgroundColor: '#f0f9ff',
        name: `${String(i).padStart(2, '0')}`,
    })),
    { id: 'num-100', emojis: ['💯'], backgroundColor: '#fef3c7', name: '100' },
];

export const createDefaultBoard = (): Board => ({
    id: generateId(),
    name: 'My Board',
    marks: {},
    comments: {},
    recentMarkIds: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
});

export const createDefaultMarkSuites = (): MarkSuite[] => [
    {
        id: MOOD_SUITE_ID,
        name: 'Mood',
        marks: MOOD_MARKS,
        isBuiltIn: true,
        isDynamic: false,
    },
    {
        id: CHECKMARKS_SUITE_ID,
        name: 'Checkmarks',
        marks: CHECKMARKS_MARKS,
        isBuiltIn: true,
        isDynamic: false,
    },
    {
        id: NUMBERS_0_10_SUITE_ID,
        name: 'Numbers 0-10',
        marks: NUMBERS_0_10_MARKS,
        isBuiltIn: true,
        isDynamic: false,
    },
    {
        id: NUMBERS_00_100_SUITE_ID,
        name: 'Numbers 00-100',
        marks: NUMBERS_00_100_MARKS,
        isBuiltIn: true,
        isDynamic: false,
    },
];

export function generateId(): string {
    return `${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 9)}`;
}
