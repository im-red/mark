## Why

The current implementation shows the calendar directly on the home page, which doesn't scale well when users have multiple boards. Users need a clear overview of all their boards on the home page, with the ability to drill down into individual board details. Additionally, users need a way to backup and restore their data through import/export functionality.

## What Changes

- **BREAKING**: Home page now displays a list of boards instead of the calendar directly
- Add board detail page that shows the calendar and marks for a selected board
- Add side menu navigation following STYLE_GUIDE.md patterns
- Implement data export functionality (JSON format)
- Implement data import functionality with validation
- Update navigation to use push/pop transitions per STYLE_GUIDE.md
- Apply all STYLE_GUIDE.md design tokens and component standards

## Capabilities

### New Capabilities

- `home-page`: Board list view on home page with board cards showing summary info
- `board-detail-page`: Dedicated page for viewing and managing a single board's calendar
- `side-menu`: Global navigation drawer following STYLE_GUIDE.md specifications
- `data-export`: Export all boards and marks to JSON file
- `data-import`: Import boards and marks from JSON file with validation

### Modified Capabilities

- `board-management`: Board CRUD operations now accessible from home page and board detail page
- `calendar-view`: Calendar now displayed on board detail page instead of home page

## Impact

- **Navigation**: New home page → board detail page flow with slide transitions
- **UI Components**: New BoardCard, SideMenu, ImportOverlay, ExportOverlay components
- **State Management**: Add navigation state for page transitions
- **Data Layer**: Add export/import utilities for JSON serialization
- **Styles**: Update all styles to strictly follow STYLE_GUIDE.md tokens
