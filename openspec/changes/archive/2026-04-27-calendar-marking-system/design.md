## Context

Mark is a new Capacitor-based Android application for tracking daily activities through calendar marks. The app needs a clean, mobile-first UI that allows users to quickly mark dates with various symbols. Each user can have multiple "boards" (e.g., "Mood Tracker", "Habit Tracker", "Workout Log") with independent calendars.

**Current State**: Empty React application with basic header.

**Constraints**:
- Mobile-first design (Android)
- Offline-first (local storage)
- Simple, fast interactions
- No backend required for MVP

## Goals / Non-Goals

**Goals:**
- Provide a monthly calendar view with intuitive navigation
- Support multiple mark types (moods, checkmarks, numbers)
- Enable board management for independent tracking contexts
- Persist data locally on device
- Fast, responsive UI optimized for mobile

**Non-Goals:**
- Cloud sync (future consideration)
- User authentication
- Social/sharing features
- Complex analytics or charts
- iOS support (initially)

## Decisions

### 1. Data Storage: LocalStorage via Custom Hook
**Decision**: Use a custom `useLocalStorageState` hook for persistence, similar to memo_pads pattern.

**Rationale**: 
- Simple, synchronous reads/writes
- No additional dependencies
- Sufficient for MVP data volume
- Easy to migrate to Capacitor Preferences later

**Alternatives Considered**:
- Capacitor Preferences API: More complex for MVP, better for sensitive data
- SQLite: Overkill for simple key-value storage
- IndexedDB: More complex, unnecessary for this data volume

### 2. State Management: React useState with Context
**Decision**: Use React's built-in useState and Context API for state management.

**Rationale**:
- Simple state shape (boards, marks, current board)
- No need for Redux or Zustand complexity
- Context provides clean prop drilling avoidance
- Easy to understand and maintain

### 3. UI Framework: Plain CSS with CSS Variables
**Decision**: Use plain CSS with CSS variables, following the memo_pads pattern.

**Rationale**:
- No additional dependencies
- Full control over styling
- CSS variables for theming
- Consistent with existing project style

### 4. Mark Type System: Extensible Enum Pattern
**Decision**: Define mark types as a TypeScript union type with a registry object for metadata.

**Rationale**:
- Type-safe mark handling
- Easy to add new mark types
- Metadata (icons, labels) centralized
- Render logic can be data-driven

### 5. Calendar Library: Custom Implementation
**Decision**: Build a simple calendar component from scratch.

**Rationale**:
- Full control over appearance and behavior
- No external dependencies
- Simpler than adapting a general-purpose library
- Learning opportunity

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| LocalStorage size limits (~5MB) | Monitor usage; migrate to Filesystem API if needed |
| No data backup | Add export/import feature early |
| Custom calendar bugs | Write comprehensive tests for date logic |
| Performance with many marks | Implement virtualization if needed; marks are lightweight |

## Migration Plan

Not applicable - this is a new feature.

## Open Questions

1. Should we support marking past/future months, or restrict to current month only?
   - **Decision**: Support any date in the calendar view (user can navigate to any month)

2. What's the maximum number of boards a user can create?
   - **Decision**: No hard limit initially; monitor usage patterns

3. Should marks be editable after creation?
   - **Decision**: Yes, tapping a marked date opens the mark selector to change or remove
