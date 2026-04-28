## 1. Navigation Architecture

- [x] 1.1 Create NavigationContext for page state management
- [x] 1.2 Implement page transition CSS with hardware-accelerated transforms
- [x] 1.3 Add Android back button handling with Capacitor App plugin
- [x] 1.4 Update App.tsx to use navigation context

## 2. Home Page (Board List)

- [x] 2.1 Create HomePage component with board list
- [x] 2.2 Create BoardCard component with summary info (name, mark count, last updated)
- [x] 2.3 Add "New Board" button and overlay on home page
- [x] 2.4 Implement board card click to navigate to detail page
- [x] 2.5 Add empty state when no boards exist

## 3. Board Detail Page

- [x] 3.1 Create BoardDetailPage component
- [x] 3.2 Move Calendar component to board detail page
- [x] 3.3 Add back button to header (←) replacing hamburger menu
- [x] 3.4 Display board name in header
- [x] 3.5 Add context menu for board actions (rename, delete)

## 4. Side Menu

- [x] 4.1 Create SideMenu component following STYLE_GUIDE.md specifications
- [x] 4.2 Implement side menu animation (slide from left, 0.3s ease)
- [x] 4.3 Add backdrop with blur effect (z-index 999)
- [x] 4.4 Add menu items: Export Data, Import Data, About
- [x] 4.5 Display app version in side menu footer
- [x] 4.6 Disable side menu on board detail page
- [x] 4.7 Add swipe-to-close gesture for side menu

## 5. Data Export

- [x] 5.1 Create export data utility function (JSON serialization)
- [x] 5.2 Create ExportOverlay component following STYLE_GUIDE.md
- [x] 5.3 Implement file download with timestamped filename
- [x] 5.4 Add export success/error feedback

## 6. Data Import

- [x] 6.1 Create import data utility function with validation
- [x] 6.2 Create ImportOverlay component following STYLE_GUIDE.md
- [x] 6.3 Implement file selection and preview
- [x] 6.4 Add duplicate board name handling (append "(imported)")
- [x] 6.5 Add import validation and error handling

## 7. Style Updates (STYLE_GUIDE.md Compliance)

- [x] 7.1 Update CSS variables to match STYLE_GUIDE.md design tokens
- [x] 7.2 Update header component to match STYLE_GUIDE.md specifications
- [x] 7.3 Update button styles (48px min height, no hover, active states)
- [x] 7.4 Update card styles (16px border radius, subtle shadow)
- [x] 7.5 Update overlay/modal styles (backdrop blur, slide-up animation)
- [x] 7.6 Add safe area insets for header
- [x] 7.7 Update typography to match STYLE_GUIDE.md

## 8. Testing & Verification

- [x] 8.1 Test navigation transitions (push/pop)
- [x] 8.2 Test side menu open/close interactions
- [x] 8.3 Test export functionality
- [x] 8.4 Test import functionality with valid and invalid files
- [x] 8.5 Test Android back button navigation
- [x] 8.6 Build and sync with Android platform
