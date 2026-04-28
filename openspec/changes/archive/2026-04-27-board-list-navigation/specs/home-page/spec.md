## ADDED Requirements

### Requirement: Display board list on home page
The system SHALL display a list of all boards on the home page as clickable cards.

#### Scenario: View board list
- **WHEN** the user opens the app
- **THEN** the system displays all boards as cards in a vertical list

#### Scenario: Empty state for no boards
- **WHEN** no boards exist
- **THEN** the system displays an empty state message with option to create a new board

### Requirement: Display board card information
The system SHALL display board name, mark count, and last updated date on each board card.

#### Scenario: View board card details
- **WHEN** viewing the board list
- **THEN** each board card shows the board name, total mark count, and last updated date

#### Scenario: Board card styling
- **WHEN** viewing board cards
- **THEN** cards follow STYLE_GUIDE.md card standards (16px border radius, subtle shadow, 48px min touch target)

### Requirement: Navigate to board detail page
The system SHALL navigate to the board detail page when a board card is tapped.

#### Scenario: Tap board card
- **WHEN** the user taps a board card
- **THEN** the system slides in the board detail page from the right

#### Scenario: Back navigation from board detail
- **WHEN** the user taps the back button or uses Android back gesture
- **THEN** the system slides out the board detail page to the right, revealing the home page

### Requirement: Create new board from home page
The system SHALL allow users to create new boards from the home page.

#### Scenario: Create board button
- **WHEN** the user taps the "New Board" button on the home page
- **THEN** the system opens a modal overlay to enter the board name

#### Scenario: Create board and navigate
- **WHEN** the user creates a new board
- **THEN** the system creates the board and navigates to the board detail page
