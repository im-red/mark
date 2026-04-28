## ADDED Requirements

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
