## Context

The current mark system uses discriminated union types (MoodMark, CheckmarkMark, CrossMark, NumberMark) with separate UI handling for each type. This design proposes a unified Mark type with emoji sequences and background colors, plus a mark suite system for organization.

**Current State:**
- Mark is a discriminated union with 4 variants
- Hardcoded mood levels (1-5) with fixed emojis
- No customization or user-defined marks
- No organization system for marks

**Constraints:**
- Must maintain backward compatibility with existing data during migration
- Local storage only (no backend)
- Mobile-first UI considerations

## Goals / Non-Goals

**Goals:**
- Unified Mark type with emoji sequence + background color
- Mark suite system for organizing marks
- Built-in Mood suite with 5 mood levels
- Dynamic Recent suite (last 5 used marks per board)
- Mark management page for CRUD operations on suites and marks
- Updated mark selection UI with suite dropdown

**Non-Goals:**
- Cloud sync of mark suites
- Sharing suites between users
- Animated or complex mark visuals
- Mark templates or presets beyond the built-in Mood suite

## Decisions

### 1. Mark Data Structure
**Decision**: Unified Mark type with emoji array and background color
```typescript
interface Mark {
  id: string;
  emojis: string[];      // 1-2 emojis typically
  backgroundColor: string; // hex color
  name: string;          // optional label
}
```
**Rationale**: Flexible enough to represent any visual mark. Emoji array allows combinations like "🔥💪" or single emojis. Background color adds visual distinction.

**Alternatives considered:**
- Single emoji only: Too limiting for expressiveness
- Icon library: Requires asset management, less portable
- Image-based: Storage overhead, complexity

### 2. Mark Suite Structure
**Decision**: Suites as named collections of marks with metadata
```typescript
interface MarkSuite {
  id: string;
  name: string;
  marks: Mark[];
  isBuiltIn: boolean;    // true for Mood suite
  isDynamic: boolean;    // true for Recent suite
}
```
**Rationale**: Clear separation between user-created, built-in, and dynamic suites. Built-in suites cannot be deleted.

**Alternatives considered:**
- Tags on marks: Less intuitive for grouping
- Hierarchical folders: Overkill for current needs

### 3. Recent Suite Implementation
**Decision**: Store recent mark IDs per board, resolve to full marks at render time
```typescript
interface Board {
  // ... existing fields
  recentMarkIds: string[]; // max 5, most recent first
}
```
**Rationale**: Storing IDs instead of full marks ensures consistency if mark is edited. Max 5 keeps UI manageable.

**Alternatives considered:**
- Store full marks: Could diverge from source mark
- Global recent: Less relevant per board context

### 4. Mark Selection UI Flow
**Decision**: Two-step selection: Suite dropdown → Mark grid
**Rationale**: Familiar pattern (like emoji keyboards with categories). Reduces cognitive load by showing relevant subset.

**Alternatives considered:**
- Single scrollable list: Too long with many marks
- Search-first: Overkill for typical use case
- Tab-based suite switching: Less discoverable

### 5. Data Migration Strategy
**Decision**: Automatic migration on app load with versioning
- Mood marks → Mood suite marks
- Checkmark → ✓ emoji with green background
- Cross → ✗ emoji with red background
- Number marks → Number emoji (0️⃣-9️⃣) with neutral background

**Rationale**: Seamless user experience. Version flag in localStorage triggers migration.

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Data loss during migration | Migration runs once, preserves original data until success |
| Performance with many suites | Lazy load suites, virtualize mark grid if > 50 marks |
| User confusion with new system | Clear UI labels, tutorial tooltip on first use |
| Emoji rendering differences | Use widely-supported emojis, test on multiple devices |
| Storage bloat with custom marks | Limit mark name length, compress emoji sequences |

## Migration Plan

1. **Version Check**: Add `schemaVersion` to AppState (default: 1)
2. **On Load**: If version < 2, run migration
3. **Migrate Marks**: Convert each Mark to new format, create Mood suite
4. **Update Boards**: Add empty `recentMarkIds` arrays
5. **Set Version**: Update to version 2
6. **Rollback**: Keep original data in `legacyMarks` for one session, then purge

## Open Questions

- Should users be able to reorder marks within a suite? (Deferred: not in initial scope)
- Mark suite import/export? (Deferred: can use existing data export)
- Maximum marks per suite limit? (Suggest: 50, configurable later)
