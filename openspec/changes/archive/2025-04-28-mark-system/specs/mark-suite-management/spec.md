## ADDED Requirements

### Requirement: Mark management page
The system SHALL provide a page for managing marks and mark suites.

#### Scenario: Access mark management
- **WHEN** the user opens the side menu
- **THEN** a "Manage Marks" option is visible

#### Scenario: Navigate to mark management
- **WHEN** the user taps "Manage Marks"
- **THEN** the mark management page is displayed

#### Scenario: View all suites
- **WHEN** the mark management page is displayed
- **THEN** all mark suites are listed (Mood, Recent, and custom suites)

### Requirement: Create mark suite
The system SHALL allow users to create new mark suites.

#### Scenario: Create suite with name
- **WHEN** the user creates a new suite with a name
- **THEN** a new empty suite is created with that name

#### Scenario: Suite name required
- **WHEN** the user attempts to create a suite without a name
- **THEN** an error is shown and the suite is not created

#### Scenario: Suite name uniqueness
- **WHEN** the user creates a suite with an existing name
- **THEN** an error is shown and the suite is not created

### Requirement: Edit mark suite
The system SHALL allow users to edit mark suite names.

#### Scenario: Rename suite
- **WHEN** the user edits a suite name
- **THEN** the suite name is updated

#### Scenario: Cannot rename built-in suites
- **WHEN** the user attempts to rename Mood or Recent suite
- **THEN** the action is prevented

### Requirement: Delete mark suite
The system SHALL allow users to delete custom mark suites.

#### Scenario: Delete custom suite
- **WHEN** the user deletes a custom suite
- **THEN** the suite is removed after confirmation

#### Scenario: Cannot delete built-in suites
- **WHEN** the user attempts to delete Mood or Recent suite
- **THEN** the action is prevented and an error is shown

### Requirement: Create mark in suite
The system SHALL allow users to create marks within a suite.

#### Scenario: Create mark with emoji
- **WHEN** the user creates a mark with emoji(s) and background color
- **THEN** the mark is added to the selected suite

#### Scenario: Mark requires at least one emoji
- **WHEN** the user attempts to create a mark without emojis
- **THEN** an error is shown

#### Scenario: Mark background color default
- **WHEN** the user creates a mark without specifying background color
- **THEN** a default transparent or neutral color is used

### Requirement: Edit mark
The system SHALL allow users to edit existing marks.

#### Scenario: Edit mark emojis
- **WHEN** the user changes the emojis of a mark
- **THEN** the mark is updated with new emojis

#### Scenario: Edit mark background color
- **WHEN** the user changes the background color of a mark
- **THEN** the mark is updated with the new color

#### Scenario: Edit mark name
- **WHEN** the user changes the name of a mark
- **THEN** the mark is updated with the new name

#### Scenario: Cannot edit marks in Recent suite
- **WHEN** the user attempts to edit a mark in the Recent suite
- **THEN** the action is prevented (Recent suite is read-only)

### Requirement: Delete mark
The system SHALL allow users to delete marks from suites.

#### Scenario: Delete mark from suite
- **WHEN** the user deletes a mark from a custom suite
- **THEN** the mark is removed from the suite

#### Scenario: Cannot delete from built-in suites
- **WHEN** the user attempts to delete a mark from Mood or Recent suite
- **THEN** the action is prevented

#### Scenario: Deleted mark remains on calendar
- **WHEN** a mark is deleted from a suite
- **THEN** any existing marks on calendar dates remain visible
