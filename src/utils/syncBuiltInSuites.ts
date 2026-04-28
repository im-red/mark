import { MarkSuite, AppState, createDefaultMarkSuites } from '../types';

export function syncBuiltInSuites(storedState: AppState): AppState {
  const defaultSuites = createDefaultMarkSuites();
  const defaultSuitesMap = new Map(defaultSuites.map(s => [s.id, s]));

  const customSuites = storedState.markSuites.filter(s => !s.isBuiltIn);
  const customSuiteIds = new Set(customSuites.map(s => s.id));

  const syncedBuiltInSuites: MarkSuite[] = defaultSuites.map(defaultSuite => {
    const storedBuiltIn = storedState.markSuites.find(
      s => s.id === defaultSuite.id && s.isBuiltIn
    );

    if (storedBuiltIn) {
      return {
        ...defaultSuite,
      };
    }

    return defaultSuite;
  });

  const mergedSuites: MarkSuite[] = [...syncedBuiltInSuites, ...customSuites];

  return {
    ...storedState,
    markSuites: mergedSuites,
  };
}
