## ADDED Requirements

### Requirement: Export all data to JSON
The system SHALL allow users to export all boards and marks to a JSON file.

#### Scenario: Access export from side menu
- **WHEN** the user taps "Export Data" in the side menu
- **THEN** the system opens an export overlay

#### Scenario: Export data
- **WHEN** the user confirms the export
- **THEN** the system generates a JSON file containing all boards and marks

#### Scenario: Download exported file
- **WHEN** the export is complete
- **THEN** the system triggers a download of the JSON file with a timestamped filename

### Requirement: Export file format
The system SHALL use a specific JSON structure for exported data.

#### Scenario: Export structure
- **WHEN** exporting data
- **THEN** the JSON file contains: version, exportDate, and boards array with all mark data

### Requirement: Export overlay styling
The system SHALL style the export overlay according to STYLE_GUIDE.md specifications.

#### Scenario: Overlay appearance
- **WHEN** the export overlay is open
- **THEN** it follows STYLE_GUIDE.md overlay standards (backdrop blur, 16px border radius, slide-up animation)

#### Scenario: Close export overlay
- **WHEN** the user taps the close button or backdrop
- **THEN** the system closes the overlay

### Requirement: Export confirmation
The system SHALL show a confirmation after successful export.

#### Scenario: Export success
- **WHEN** the export completes successfully
- **THEN** the system displays a success message and closes the overlay
