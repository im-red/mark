## ADDED Requirements

### Requirement: Display side menu
The system SHALL provide a side menu (drawer) for global navigation accessible from the home page.

#### Scenario: Open side menu
- **WHEN** the user taps the hamburger menu icon (☰) in the header
- **THEN** the system slides in the side menu from the left with a backdrop

#### Scenario: Close side menu by backdrop
- **WHEN** the user taps the backdrop outside the side menu
- **THEN** the system closes the side menu

#### Scenario: Close side menu by close button
- **WHEN** the user taps the close button (×) in the side menu header
- **THEN** the system closes the side menu

#### Scenario: Close side menu by swipe
- **WHEN** the user swipes left on the side menu
- **THEN** the system closes the side menu

### Requirement: Side menu styling
The system SHALL style the side menu according to STYLE_GUIDE.md specifications.

#### Scenario: Side menu dimensions
- **WHEN** the side menu is open
- **THEN** the menu width is 75% on desktop (max 300px) and 80% on mobile (max 280px)

#### Scenario: Side menu z-index
- **WHEN** the side menu is open
- **THEN** the menu panel has z-index 1000 and the backdrop has z-index 999

#### Scenario: Side menu animation
- **WHEN** the side menu opens or closes
- **THEN** the animation uses transform: translateX() with 0.3s ease timing

### Requirement: Side menu navigation items
The system SHALL display navigation items in the side menu.

#### Scenario: View menu items
- **WHEN** the side menu is open
- **THEN** the system displays: Export Data, Import Data, and About items

#### Scenario: Tap menu item
- **WHEN** the user taps a menu item
- **THEN** the system closes the side menu and performs the action

### Requirement: Side menu disabled on board detail page
The system SHALL disable the side menu on board detail pages.

#### Scenario: Board detail page header
- **WHEN** viewing a board detail page
- **THEN** the header displays a back button instead of the hamburger menu

#### Scenario: No side menu on board detail
- **WHEN** viewing a board detail page
- **THEN** the side menu cannot be opened

### Requirement: Display app version in side menu
The system SHALL display the app version in the side menu footer.

#### Scenario: View version string
- **WHEN** the side menu is open
- **THEN** the system displays the version string in the footer (e.g., "v1.0.0-b1")

#### Scenario: Development fallback
- **WHEN** running in development mode without Capacitor
- **THEN** the system displays "v99.99.99-b99"
