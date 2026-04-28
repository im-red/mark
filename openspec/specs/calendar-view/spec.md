## Purpose

Define the calendar view and mark selection behavior.

## Requirements

### Requirement: Display monthly calendar
The system SHALL display a monthly calendar view showing all days of the current month in a grid layout.

#### Scenario: View current month on app load
- **WHEN** the user opens the app
- **THEN** the system displays the current month's calendar with today's date highlighted

#### Scenario: Navigate to previous month
- **WHEN** the user taps the previous month navigation button
- **THEN** the system displays the previous month's calendar

#### Scenario: Navigate to next month
- **WHEN** the user taps the next month navigation button
- **THEN** the system displays the next month's calendar

#### Scenario: Return to today
- **WHEN** the user taps the "Today" button
- **THEN** the system navigates to the current month and highlights today's date

### Requirement: Display marks on calendar dates
The system SHALL display marks on calendar dates that have been marked by the user.

#### Scenario: View marked date
- **WHEN** a date has a mark
- **THEN** the system displays the mark symbol on that date in the calendar grid

#### Scenario: View unmarked date
- **WHEN** a date has no mark
- **THEN** the system displays the date number without any mark symbol

#### Scenario: Today highlighted with border
- **WHEN** viewing the calendar
- **THEN** today's date is highlighted with a border (not by changing day number style)

### Requirement: Select date for marking
The system SHALL allow users to select a date to view or edit its mark.

#### Scenario: Select unmarked date
- **WHEN** the user taps an unmarked date
- **THEN** the system opens the mark selector interface

#### Scenario: Select marked date
- **WHEN** the user taps a marked date
- **THEN** the system opens the mark selector interface showing the current mark

### Requirement: Display month and year header
The system SHALL display the current month and year in the calendar header.

#### Scenario: View month header
- **WHEN** viewing any month
- **THEN** the system displays the full month name and year (e.g., "January 2026")

### Requirement: Mark suite selection dropdown
The system SHALL provide a dropdown to select mark suites in the mark selector.

#### Scenario: Display suite dropdown
- **WHEN** the mark selector opens
- **THEN** a dropdown showing all available suites is displayed

#### Scenario: Default suite selection
- **WHEN** the mark selector opens
- **THEN** the Recent suite is selected by default

#### Scenario: Switch suite
- **WHEN** the user selects a different suite from the dropdown
- **THEN** the mark grid updates to show marks from the selected suite

#### Scenario: Suite dropdown order
- **WHEN** the suite dropdown is displayed
- **THEN** suites are ordered: Recent, Mood, then custom suites alphabetically

### Requirement: Mark grid display
The system SHALL display marks from the selected suite in a grid layout.

#### Scenario: Display marks in grid
- **WHEN** a suite is selected
- **THEN** all marks in that suite are displayed in a grid

#### Scenario: Empty suite message
- **WHEN** a suite has no marks
- **THEN** a message indicates the suite is empty (centered in the panel)

#### Scenario: Mark visual display
- **WHEN** a mark is displayed in the grid
- **THEN** the mark shows its emoji(s) on its background color

#### Scenario: Numeric marks use compact display
- **WHEN** a numeric mark (00-99) is displayed
- **THEN** it uses compact text styling instead of wide emoji digits

### Requirement: Apply mark from selector
The system SHALL allow users to apply a mark from the selected suite.

#### Scenario: Select mark to apply
- **WHEN** the user taps a mark in the grid
- **THEN** the mark is applied to the selected date

#### Scenario: Mark added to recent
- **WHEN** a mark is applied to a date
- **THEN** the mark is added to the Recent suite for the current board

#### Scenario: Close selector after marking
- **WHEN** a mark is successfully applied
- **THEN** the mark selector closes

### Requirement: Create mark inline
The system SHALL allow users to create new marks when marking a board.

#### Scenario: Create mark option visible
- **WHEN** the mark selector is open
- **THEN** a "Create New Mark" option is available

#### Scenario: Create mark in selector
- **WHEN** the user creates a mark in the selector
- **THEN** the mark is added to the selected suite and can be immediately used
