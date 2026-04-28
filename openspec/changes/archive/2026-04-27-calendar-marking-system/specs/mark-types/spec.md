## ADDED Requirements

### Requirement: Provide mood mark types
The system SHALL provide 5 mood mark types ranging from very sad to very happy.

#### Scenario: Select mood mark
- **WHEN** the user opens the mark selector
- **THEN** the system displays 5 mood options: very sad, sad, neutral, happy, very happy

#### Scenario: Apply mood mark
- **WHEN** the user selects a mood mark
- **THEN** the system saves the mood mark to the selected date

### Requirement: Provide checkmark mark types
The system SHALL provide checkmark (✓) and cross (✗) mark types.

#### Scenario: Select checkmark
- **WHEN** the user opens the mark selector
- **THEN** the system displays checkmark (✓) and cross (✗) options

#### Scenario: Apply checkmark mark
- **WHEN** the user selects a checkmark or cross
- **THEN** the system saves the mark to the selected date

### Requirement: Provide number mark type
The system SHALL allow users to enter a numeric value (0-99) as a mark.

#### Scenario: Enter number mark
- **WHEN** the user selects the number mark type
- **THEN** the system displays a numeric input field

#### Scenario: Apply number mark
- **WHEN** the user enters a number and confirms
- **THEN** the system saves the number to the selected date

#### Scenario: Validate number input
- **WHEN** the user enters a number outside the valid range
- **THEN** the system shows an error and does not save

### Requirement: Remove mark
The system SHALL allow users to remove an existing mark from a date.

#### Scenario: Clear mark
- **WHEN** the user selects "Clear" or "Remove" option in the mark selector
- **THEN** the system removes the mark from the selected date

### Requirement: Display mark icons
The system SHALL display appropriate icons or symbols for each mark type in the calendar view.

#### Scenario: View mood icon
- **WHEN** a date has a mood mark
- **THEN** the system displays the corresponding emoji or icon for that mood level

#### Scenario: View checkmark icon
- **WHEN** a date has a checkmark or cross mark
- **THEN** the system displays the ✓ or ✗ symbol

#### Scenario: View number
- **WHEN** a date has a number mark
- **THEN** the system displays the numeric value
