## Why

The current mark system has multiple distinct mark types (mood, checkmark, number) with separate UI and data structures. This creates complexity and limits flexibility. Users cannot create custom marks or organize marks into meaningful groups. A unified mark system with customizable mark suites will provide a more flexible and extensible solution.

## What Changes

- **BREAKING**: Unify all mark types into a single `Mark` type containing emojis and background color
- Add mark suite concept to organize and store user-defined marks
- Provide built-in mark suite: Mood (5 mood levels as emoji sequences)
- Add dynamic "Recent" suite that stores last 5 used marks per board
- Add mark management page to create, edit, and delete marks and mark suites
- Update mark selection UI to show suite dropdown and marks from selected suite

## Capabilities

### New Capabilities
- `mark-suite-management`: Create, edit, delete mark suites and custom marks. Manage mark organization.

### Modified Capabilities
- `mark-types`: **BREAKING** - Complete redesign. Unified Mark type with emojis and background color instead of separate mood/checkmark/number types.
- `calendar-view`: Update mark selection modal to include suite dropdown and display marks from selected suite.
- `board-management`: Add storage for recent marks (last 5 used marks per board) to support the Recent suite.
- `data-persistence`: Update data model to store marks with new unified structure and mark suites.

## Impact

- **Data Model**: Mark structure changes from type-specific fields to unified emoji sequence + background color
- **UI Components**: MarkSelector component needs complete redesign
- **New Page**: Mark management page accessible from side menu
- **Migration**: Existing marks need to be migrated to new unified format
- **Board Data**: Each board will track its recent marks for the Recent suite
