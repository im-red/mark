## ADDED Requirements

### Requirement: Display board calendar
The system SHALL display the calendar view for the selected board on the board detail page.

#### Scenario: View board calendar
- **WHEN** the user navigates to a board detail page
- **THEN** the system displays the calendar for that board with all its marks

#### Scenario: Board name in header
- **WHEN** viewing a board detail page
- **THEN** the header displays the board name as the title

### Requirement: Back button navigation
The system SHALL provide a back button in the header to return to the home page.

#### Scenario: Back button visible
- **WHEN** viewing a board detail page
- **THEN** the header displays a back button (←) on the left side

#### Scenario: Tap back button
- **WHEN** the user taps the back button
- **THEN** the system navigates back to the home page with a slide-out animation

### Requirement: Mark dates on board detail
The system SHALL allow users to mark dates on the board detail page.

#### Scenario: Select date to mark
- **WHEN** the user taps a date on the calendar
- **THEN** the system opens the mark selector overlay

#### Scenario: Apply mark
- **WHEN** the user selects a mark type
- **THEN** the system saves the mark to the board and displays it on the calendar

### Requirement: Board actions on detail page
The system SHALL provide board management actions on the board detail page.

#### Scenario: Access board actions
- **WHEN** the user taps the context menu button in the header
- **THEN** the system displays options to rename or delete the board

#### Scenario: Rename board from detail page
- **WHEN** the user selects rename and enters a new name
- **THEN** the system updates the board name and refreshes the header title

#### Scenario: Delete board from detail page
- **WHEN** the user selects delete and confirms
- **THEN** the system deletes the board and navigates back to the home page
