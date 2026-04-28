## Purpose

Define board creation, management, and mark tracking functionality.

## Requirements

### Requirement: Create new board
The system SHALL allow users to create new boards with custom names.

#### Scenario: Create board
- **WHEN** the user taps "New Board" and enters a name
- **THEN** the system creates a new board with an empty calendar

#### Scenario: Board name validation
- **WHEN** the user enters an empty or whitespace-only name
- **THEN** the system shows an error and does not create the board

### Requirement: Switch between boards
The system SHALL allow users to switch between different boards.

#### Scenario: Switch board
- **WHEN** the user selects a different board from the board list
- **THEN** the system displays the selected board's calendar with its marks

#### Scenario: Remember last board
- **WHEN** the user reopens the app
- **THEN** the system displays the last viewed board

### Requirement: Rename board
The system SHALL allow users to rename existing boards.

#### Scenario: Rename board
- **WHEN** the user edits a board's name
- **THEN** the system updates the board name while preserving all marks

### Requirement: Delete board
The system SHALL allow users to delete boards.

#### Scenario: Delete board with confirmation
- **WHEN** the user requests to delete a board and confirms
- **THEN** the system removes the board and all its marks

#### Scenario: Cancel board deletion
- **WHEN** the user requests to delete a board but cancels
- **THEN** the system preserves the board and its marks

#### Scenario: Delete last board
- **WHEN** the user deletes the last remaining board
- **THEN** the system creates a new default board named "My Board"

### Requirement: Display board list
The system SHALL provide access to view all available boards.

#### Scenario: View board list
- **WHEN** the user opens the board selector
- **THEN** the system displays all board names with the current board highlighted

### Requirement: Independent calendar per board
The system SHALL maintain separate calendars and marks for each board.

#### Scenario: Marks are board-specific
- **WHEN** the user marks a date on Board A
- **THEN** the mark does not appear on Board B's calendar

#### Scenario: Switching boards preserves marks
- **WHEN** the user marks dates on Board A, switches to Board B, then returns to Board A
- **THEN** all marks from Board A are preserved

### Requirement: Store recent marks per board
The system SHALL track the last 5 used marks for each board.

#### Scenario: Initialize recent marks
- **WHEN** a new board is created
- **THEN** the board has an empty recent marks list

#### Scenario: Add mark to recent
- **WHEN** the user applies a mark to a date in a board
- **THEN** the mark ID is added to the board's recent marks list

#### Scenario: Recent marks limited to 5
- **WHEN** the board's recent marks list has 5 items and a new mark is used
- **THEN** the oldest mark ID is removed and the new one is added

#### Scenario: Duplicate mark not re-added
- **WHEN** the user applies a mark that is already in the recent list
- **THEN** the mark moves to the front of the list without duplication

#### Scenario: Recent marks persist per board
- **WHEN** the user switches boards
- **THEN** each board maintains its own recent marks list
