## ADDED Requirements

### Requirement: Unified Mark structure
The system SHALL use a unified Mark type containing an emoji sequence and background color.

#### Scenario: Create mark with emojis and color
- **WHEN** a mark is created
- **THEN** the mark contains an array of emojis (1-2 typically) and a background color

#### Scenario: Mark has unique identifier
- **WHEN** a mark is created
- **THEN** the mark has a unique ID for reference

#### Scenario: Mark has optional name
- **WHEN** a mark is created with a name
- **THEN** the mark stores the name for display purposes

### Requirement: Built-in Mood mark suite
The system SHALL provide a built-in Mood suite with 5 mood marks.

#### Scenario: Mood suite contains 5 levels
- **WHEN** the app initializes
- **THEN** a Mood suite exists with 5 marks: very sad, sad, neutral, happy, very happy

#### Scenario: Mood suite cannot be deleted
- **WHEN** the user attempts to delete the Mood suite
- **THEN** the system prevents deletion and shows an error

#### Scenario: Mood marks have appropriate emojis
- **WHEN** the Mood suite is displayed
- **THEN** each mood level shows the corresponding emoji (😢, 😔, 😐, 😊, 😄)

### Requirement: Recent mark suite
The system SHALL provide a dynamic Recent suite containing the last 5 used marks per board.

#### Scenario: Recent suite is default
- **WHEN** the mark selector opens
- **THEN** the Recent suite is selected by default

#### Scenario: Recent suite shows last 5 marks
- **WHEN** the user views the Recent suite
- **THEN** the last 5 unique marks used in the current board are displayed

#### Scenario: Using mark adds to recent
- **WHEN** the user applies a mark to a date
- **THEN** the mark is added to the Recent suite (if not already present)

#### Scenario: Recent suite limited to 5 marks
- **WHEN** the user applies a 6th different mark
- **THEN** the oldest mark is removed from the Recent suite

#### Scenario: Recent suite is per-board
- **WHEN** the user switches boards
- **THEN** the Recent suite shows marks from the current board only

### Requirement: Custom mark suites
The system SHALL allow users to create custom mark suites.

#### Scenario: Create new suite
- **WHEN** the user creates a new suite with a name
- **THEN** a new empty suite is created with that name

#### Scenario: Add marks to custom suite
- **WHEN** the user adds a mark to a custom suite
- **THEN** the mark is stored in that suite

#### Scenario: Delete custom suite
- **WHEN** the user deletes a custom suite
- **THEN** the suite and all its marks are removed

#### Scenario: Marks in deleted suite remain in calendar
- **WHEN** a suite is deleted
- **THEN** marks already applied to dates remain visible

## REMOVED Requirements

### Requirement: Provide mood mark types
**Reason**: Replaced by unified Mark type in Mood suite
**Migration**: Mood marks are now part of the built-in Mood suite with emoji sequences

### Requirement: Provide checkmark mark types
**Reason**: Replaced by unified Mark type
**Migration**: Checkmark and cross are now custom marks with ✓ and ✗ emojis

### Requirement: Provide number mark type
**Reason**: Replaced by unified Mark type
**Migration**: Number marks are now custom marks with number emojis (0️⃣-9️⃣)
