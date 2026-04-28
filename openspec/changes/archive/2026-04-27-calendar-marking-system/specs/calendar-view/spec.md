## ADDED Requirements

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
