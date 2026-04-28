## 1. Data Model Updates

- [x] 1.1 Update Mark type to unified structure (id, emojis, backgroundColor, name)
- [x] 1.2 Create MarkSuite type (id, name, marks, isBuiltIn, isDynamic)
- [x] 1.3 Add recentMarkIds field to Board type
- [x] 1.4 Add schemaVersion to AppState
- [x] 1.5 Create built-in Mood suite data

## 2. Data Migration

- [x] 2.1 Implement schema version check on app load
- [x] 2.2 Create migration function for mood marks to Mood suite marks
- [x] 2.3 Create migration function for checkmark marks (✓ with green background)
- [x] 2.4 Create migration function for cross marks (✗ with red background)
- [x] 2.5 Create migration function for number marks (number emojis)
- [x] 2.6 Initialize recentMarkIds for existing boards during migration
- [x] 2.7 Update schema version after successful migration

## 3. Mark Suite Context

- [x] 3.1 Create MarkSuiteContext for managing suites
- [x] 3.2 Implement useMarkSuite hook with CRUD operations
- [x] 3.3 Add built-in Mood suite initialization
- [x] 3.4 Implement Recent suite computation from board's recentMarkIds
- [x] 3.5 Add suite persistence to localStorage

## 4. Mark Management Page

- [x] 4.1 Create MarkManagementPage component
- [x] 4.2 Add "Manage Marks" entry to side menu
- [x] 4.3 Create suite list view with add/edit/delete actions
- [x] 4.4 Create mark list view within selected suite
- [x] 4.5 Implement create suite overlay
- [x] 4.6 Implement edit suite name functionality
- [x] 4.7 Implement delete suite with confirmation
- [x] 4.8 Implement create mark overlay with emoji picker
- [x] 4.9 Implement background color picker for marks
- [x] 4.10 Implement edit mark functionality
- [x] 4.11 Implement delete mark functionality

## 5. Mark Selector Redesign

- [x] 5.1 Update MarkSelector component to show suite dropdown
- [x] 5.2 Implement suite dropdown with Recent as default
- [x] 5.3 Create mark grid display for selected suite
- [x] 5.4 Update mark application to use unified Mark type
- [x] 5.5 Update recent marks tracking when mark is applied
- [x] 5.6 Implement clear mark functionality

## 6. Calendar View Updates

- [x] 6.1 Update Calendar component to display unified marks
- [x] 6.2 Update mark rendering to show emojis on background color
- [x] 6.3 Ensure backward compatibility with migrated marks

## 7. Board Context Updates

- [x] 7.1 Add updateRecentMarks method to BoardContext
- [x] 7.2 Update setMark to track recent marks
- [x] 7.3 Ensure recent marks are board-specific

## 8. Export/Import Updates

- [x] 8.1 Update export to include mark suites
- [x] 8.2 Update import to handle mark suites
- [x] 8.3 Handle schema version during import

## 9. Tests

- [ ] 9.1 Add tests for unified Mark type
- [ ] 9.2 Add tests for MarkSuiteContext
- [ ] 9.3 Add tests for data migration
- [ ] 9.4 Add tests for mark management page
- [ ] 9.5 Add tests for mark selector with suites
- [ ] 9.6 Add tests for recent marks tracking

## 10. Build and Verify

- [x] 10.1 Run all tests to verify changes
- [x] 10.2 Build and sync with Android
- [x] 10.3 Manual testing of mark creation and application
