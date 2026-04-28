## Why

Users need a simple and intuitive way to track daily activities, moods, and habits through a calendar-based marking system. This provides visual feedback and helps users maintain consistency in their personal tracking goals.

## What Changes

- Add a calendar view that displays the current month with navigable dates
- Enable users to mark individual days with various mark types:
  - **Mood Symbols**: 5 levels from very sad to very happy
  - **Checkmarks**: ✓ and ✗ symbols
  - **Numbers**: Numeric values (0-99)
  - **Custom marks**: Extensible mark types for future expansion
- Implement a "Board" concept where each board has its own independent calendar
- Provide board management (create, rename, delete, switch between boards)
- Persist all marks and boards locally on the device

## Capabilities

### New Capabilities

- `calendar-view`: Monthly calendar display with date navigation and mark visualization
- `mark-types`: Mark type system supporting moods, checkmarks, numbers, and custom marks
- `board-management`: Board creation, switching, renaming, and deletion with independent calendars
- `data-persistence`: Local storage of marks and board configurations

### Modified Capabilities

(None - this is a new feature)

## Impact

- **UI Components**: New calendar component, mark selector, board switcher
- **Data Layer**: New data models for marks, boards, and calendar state
- **Navigation**: Add board selection to app header or side menu
- **Storage**: Use Capacitor Preferences or Filesystem API for data persistence
