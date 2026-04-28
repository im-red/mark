## ADDED Requirements

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
- **THEN** a message indicates the suite is empty

#### Scenario: Mark visual display
- **WHEN** a mark is displayed in the grid
- **THEN** the mark shows its emoji(s) on its background color

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

### Requirement: Clear mark option
The system SHALL allow users to remove marks from dates.

#### Scenario: Clear mark option visible
- **WHEN** the mark selector opens for a marked date
- **THEN** a "Clear" option is visible

#### Scenario: Clear mark
- **WHEN** the user taps "Clear"
- **THEN** the mark is removed from the selected date
