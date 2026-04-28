## Context

Mark currently displays the calendar directly on the home page. This change restructures the app to show a board list on the home page, with navigation to a board detail page for calendar viewing. The app must strictly follow the STYLE_GUIDE.md for all UI components, including side menu, navigation transitions, and overlays.

**Current State:**
- Home page shows calendar for current board
- Board switching via dropdown in header
- No side menu navigation
- No import/export functionality

**Constraints:**
- Must strictly follow STYLE_GUIDE.md design tokens and patterns
- Mobile-first design with 480px max-width
- Hardware-accelerated transitions for smooth performance
- Capacitor-native integration (haptics, status bar, back button)

## Goals / Non-Goals

**Goals:**
- Display board list on home page with summary cards
- Navigate to board detail page with slide transition
- Implement side menu following STYLE_GUIDE.md specifications
- Add import/export functionality accessible from side menu
- Apply all STYLE_GUIDE.md design tokens (colors, typography, spacing)
- Implement proper navigation transitions (push/pop)

**Non-Goals:**
- Cloud sync functionality
- User authentication
- Multiple calendar views (week, day)
- Advanced filtering or search

## Decisions

### 1. Navigation Architecture: Simple State-Based Routing
**Decision**: Use React state to manage current page (home vs board detail) with CSS transitions.

**Rationale:**
- Simple app with only two main views
- No need for React Router complexity
- Full control over transition animations
- Easy to handle Android back button

**Alternatives Considered:**
- React Router: Overkill for two-page app
- React Navigation: Designed for React Native, not web

### 2. Side Menu Implementation: STYLE_GUIDE.md Pattern
**Decision**: Implement side menu exactly per STYLE_GUIDE.md specifications with left-side drawer, backdrop, and proper z-index hierarchy.

**Rationale:**
- Consistent with mobile app patterns
- Follows established design system
- Proper touch gestures and back button handling

### 3. Page Transitions: Hardware-Accelerated CSS Transforms
**Decision**: Use `transform: translateX()` for page transitions, not `left` or `margin` properties.

**Rationale:**
- STYLE_GUIDE.md requirement for Capacitor performance
- GPU-accelerated for smooth 60fps animations
- Prevents layout thrashing

### 4. Import/Export Format: JSON
**Decision**: Use JSON format for data export/import with version field for future compatibility.

**Rationale:**
- Human-readable and editable
- Easy to validate
- Supports all data types (boards, marks)
- Can add version field for migration support

### 5. Board Card Design: Summary Information
**Decision**: Show board name, mark count, and last updated date on board cards.

**Rationale:**
- Gives users quick overview without opening board
- Helps identify boards at a glance
- Follows card design patterns from STYLE_GUIDE.md

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Import corrupts existing data | Add confirmation dialog; backup before import |
| Large data exports | Stream data; show progress indicator |
| Navigation state complexity | Keep state minimal; clear page stack on actions |
| Transition performance on low-end devices | Use will-change CSS hint; test on various devices |

## Migration Plan

1. Backup user data before deploying
2. Deploy new navigation structure
3. Existing boards automatically appear in board list
4. No data migration needed - data structure unchanged

## Open Questions

1. Should we show mark preview on board cards?
   - **Decision**: Show mark count and last updated, not preview (keeps cards clean)

2. What happens when importing a board with the same name?
   - **Decision**: Append "(imported)" suffix to avoid duplicates
