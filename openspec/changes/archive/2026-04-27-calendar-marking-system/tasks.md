## 1. Project Setup & Types

- [x] 1.1 Create TypeScript types for Mark, Board, and MarkType in src/types/
- [x] 1.2 Create useLocalStorageState hook for data persistence
- [x] 1.3 Update App.tsx with basic app shell structure

## 2. Data Layer

- [x] 2.1 Create BoardContext and BoardProvider for state management
- [x] 2.2 Implement board CRUD operations (create, read, update, delete)
- [x] 2.3 Implement mark CRUD operations per board
- [x] 2.4 Add default board initialization on first load

## 3. Mark Types System

- [x] 3.1 Define mark type registry with metadata (icons, labels)
- [x] 3.2 Create MarkSelector component for choosing mark type
- [x] 3.3 Implement mood mark type with 5 levels
- [x] 3.4 Implement checkmark mark type (✓ and ✗)
- [x] 3.5 Implement number mark type with input validation
- [x] 3.6 Add "Clear mark" functionality

## 4. Calendar View

- [x] 4.1 Create Calendar component with monthly grid layout
- [x] 4.2 Implement month navigation (previous/next)
- [x] 4.3 Add "Today" button for quick navigation
- [x] 4.4 Display month and year header
- [x] 4.5 Render marks on calendar dates
- [x] 4.6 Handle date selection and open mark selector
- [x] 4.7 Highlight today's date

## 5. Board Management UI

- [x] 5.1 Create BoardSelector component (dropdown or modal)
- [x] 5.2 Add "New Board" functionality with name input
- [x] 5.3 Add board rename functionality
- [x] 5.4 Add board delete functionality with confirmation
- [x] 5.5 Display current board name in header
- [x] 5.6 Implement board switching

## 6. Styling & Polish

- [x] 6.1 Style calendar grid for mobile viewport
- [x] 6.2 Style mark selector modal/overlay
- [x] 6.3 Style board selector UI
- [x] 6.4 Add responsive adjustments for tablets
- [x] 6.5 Add CSS transitions for smooth interactions

## 7. Testing & Verification

- [x] 7.1 Test board creation, switching, and deletion
- [x] 7.2 Test mark creation for all mark types
- [x] 7.3 Test mark editing and removal
- [x] 7.4 Test data persistence across app restarts
- [x] 7.5 Test month navigation
- [x] 7.6 Build and sync with Android platform
