## ADDED Requirements

### Requirement: Persist mark suites locally
The system SHALL persist all mark suites to local storage.

#### Scenario: Suites persist across sessions
- **WHEN** the user creates, edits, or deletes mark suites
- **THEN** the changes are saved to local storage immediately

#### Scenario: Suites load on app start
- **WHEN** the user opens the app
- **THEN** the system loads all previously saved mark suites

#### Scenario: Built-in suites always available
- **WHEN** the app initializes
- **THEN** the Mood suite is available even if not in storage

### Requirement: Migrate legacy mark data
The system SHALL migrate existing mark data to the new unified format.

#### Scenario: Detect legacy data
- **WHEN** the app loads data with the old schema version
- **THEN** the system triggers migration

#### Scenario: Migrate mood marks
- **WHEN** migration encounters a mood mark
- **THEN** it is converted to a unified mark with the corresponding mood emoji

#### Scenario: Migrate checkmark marks
- **WHEN** migration encounters a checkmark mark
- **THEN** it is converted to a unified mark with ✓ emoji and green background

#### Scenario: Migrate cross marks
- **WHEN** migration encounters a cross mark
- **THEN** it is converted to a unified mark with ✗ emoji and red background

#### Scenario: Migrate number marks
- **WHEN** migration encounters a number mark
- **THEN** it is converted to a unified mark with the corresponding number emoji

#### Scenario: Migration preserves data
- **WHEN** migration completes
- **THEN** all previously marked dates remain marked with equivalent marks

### Requirement: Schema versioning
The system SHALL track the data schema version for migration purposes.

#### Scenario: Store schema version
- **WHEN** data is saved
- **THEN** the schema version is stored with the data

#### Scenario: Default schema version
- **WHEN** new data is created
- **THEN** it uses the current schema version
