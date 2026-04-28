## ADDED Requirements

### Requirement: Import data from JSON file
The system SHALL allow users to import boards and marks from a JSON file.

#### Scenario: Access import from side menu
- **WHEN** the user taps "Import Data" in the side menu
- **THEN** the system opens an import overlay

#### Scenario: Select file to import
- **WHEN** the user selects a JSON file
- **THEN** the system validates the file format and displays a preview

#### Scenario: Import valid data
- **WHEN** the user confirms the import with valid data
- **THEN** the system adds the imported boards and marks to existing data

#### Scenario: Import file with duplicate board names
- **WHEN** importing a board with a name that already exists
- **THEN** the system appends "(imported)" suffix to the board name

### Requirement: Validate import file
The system SHALL validate the import file structure before importing.

#### Scenario: Invalid file format
- **WHEN** the user selects a non-JSON file
- **THEN** the system displays an error message

#### Scenario: Invalid JSON structure
- **WHEN** the JSON structure is invalid or missing required fields
- **THEN** the system displays an error message with details

#### Scenario: Valid file preview
- **WHEN** the file is valid
- **THEN** the system displays a preview showing number of boards and marks to be imported

### Requirement: Import overlay styling
The system SHALL style the import overlay according to STYLE_GUIDE.md specifications.

#### Scenario: Overlay appearance
- **WHEN** the import overlay is open
- **THEN** it follows STYLE_GUIDE.md overlay standards (backdrop blur, 16px border radius, slide-up animation)

#### Scenario: Close import overlay
- **WHEN** the user taps the close button or backdrop
- **THEN** the system closes the overlay without importing

### Requirement: Import confirmation
The system SHALL require confirmation before importing data.

#### Scenario: Confirm import
- **WHEN** the user reviews the preview and taps "Import"
- **THEN** the system imports the data and displays a success message

#### Scenario: Cancel import
- **WHEN** the user taps "Cancel"
- **THEN** the system closes the overlay without importing
