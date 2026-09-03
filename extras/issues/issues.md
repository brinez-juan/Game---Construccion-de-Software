# Completed Issues — *Return* (OTHEA Games Studio)

This is a clean record of the GitHub Project issues that reached **Done**, exported from the
repository's GitHub Project board. Each issue maps to a User Story in
[`Documents/SRS_Return_V2.md`](../../Documents/SRS_Return_V2.md).

## Summary

| Issue | User Story | Layer | Title | Assignee | Estimate |
|---|---|---|---|---|---|
| #33 | US-10 | Logic | Stamina system (costs, constraints and recovery) | Santiago Martin Vences | 4h |
| #28 | US-17 | Logic | Attribute system and card scaling | Santiago Martin Vences | 5h |
| #27 | US-30 | Logic | Attribute point system in the Battle Lobby | Juan Pablo Briñez Corzo | 2h |
| #26 | US-30 | Logic | Battle Deck selection and attribute restrictions | Santiago Martin Vences | 3h |
| #25 | US-30 | Frontend | Battle Lobby UI | Santiago Martin Vences | 4h |
| #24 | US-03 | Logic | Game pause and options menu actions | Juan Pablo Briñez Corzo | 2h |
| #23 | US-03 | Frontend | UI of the options menu and pause | José Paulo Vélez Ortiz | 2h |
| #22 | US-02 | Logic | Flow of creating, loading and overwriting saves | Santiago Martin Vences | 3h |
| #21 | US-02 | Frontend | Game selection and creation menu UI | José Paulo Vélez Ortiz | 3h |
| #19 | US-29 | Logic | Assignment of base attributes and initial cards | Juan Pablo Briñez Corzo | 2h |
| #16 | US-24 | Database | Constraints and referential integrity | Juan Pablo Briñez Corzo | 4h |
| #15 | US-24 | Database | Verification of the three normal forms | Juan Pablo Briñez Corzo | 4h |
| #14 | US-05 | Testing | CRUD operations validation | Juan Pablo Briñez Corzo | 1h |
| #13 | US-05 | Database | Web-to-DB connection / API configuration | Juan Pablo Briñez Corzo | 2h |
| #12 | US-05 | Database | Schema design and table creation | Juan Pablo Briñez Corzo | 4h |
| #11 | US-01 | Logic | Button status and main menu navigation | Santiago Martin Vences | 2h |
| #10 | US-01 | Frontend | Main menu design and implementation | José Paulo Vélez Ortiz | 3h |
| #08 | US-37 | Frontend | Loading screen design and implementation | Santiago Martin Vences | 1h |
| #07 | US-14 | Frontend | Login screen UI | Santiago Martin Vences | 2h |
| #06 | US-14 | Backend | Authentication endpoint with JWT | Juan Pablo Briñez Corzo | 4h |
| #05 | US-28 | Testing | Validation of the complete registration flow | Juan Pablo Briñez Corzo | 1h |
| #04 | US-28 | Frontend | Registration screen UI | José Paulo Vélez Ortiz | — |

> Tech stack for every issue: **JavaScript / HTML** with **MySQL** for persistence.
> Visual style: dark-fantasy watercolor aesthetic (see the GDD).

---

## Detail

### #33 — Logic: Stamina system (costs, constraints and recovery) · US-10
- [x] Define the player's maximum stamina and starting value per run
- [x] Deduct the stamina cost when a card is used
- [x] Block card use if stamina is insufficient
- [x] Perfect parry recovers moderate stamina; normal = little; poor = none
- [x] Recover stamina when using a defensive card (guaranteed parry)
- [x] Tests completed · [x] Team review

### #28 — Logic: Attribute system and card scaling · US-17
- [x] Implement the 5 attributes: Strength, Vigor, Endurance, Intelligence, Dexterity
- [x] Define which cards scale with which attribute and the scaling formula
- [x] Define the attribute requirements for each card
- [x] On attribute increase: recalculate damage/effect of cards that scale with it
- [x] Tests completed · [x] Team review

### #27 — Logic: Attribute point system in the Battle Lobby · US-30
- [x] Display available attribute points in the counter
- [x] On '+' press: decrement the counter and increase the attribute by 1
- [x] Update in real time the stats of cards that scale with the raised attribute
- [x] Save attribute changes to DB on 'Continue' press
- [x] Tests completed · [x] Team review

### #26 — Logic: Battle Deck selection and attribute restrictions · US-30
- [x] On My Deck card click: flip and show attributes; second click adds it to the Battle Deck
- [x] Limit the Battle Deck to a maximum of 5 cards
- [x] Disable cards whose attribute requirement is not met
- [x] 'Continue' button disabled if the Battle Deck is empty
- [x] Tests completed · [x] Team review

### #25 — Frontend: Battle Lobby UI · US-30
- [x] Layout: character portrait, name, Battle Deck (5 slots), My Deck, level + XP bar, attributes section
- [x] My Deck view displaying all cards in the inventory
- [x] Battle Deck area with 5 card slots
- [x] '+' button next to each attribute with available points
- [x] Tests completed · [x] Team review

### #24 — Logic: Game pause and options menu actions · US-03
- [x] Pause all timers and enemy AI when the menu is opened
- [x] Resume the game when the menu is closed
- [x] Control music and SFX volume in real time
- [x] Exit to main menu when pressing the exit button
- [x] Tests completed · [x] Team review

### #23 — Frontend: UI of the options menu and pause · US-03
- [x] Button to return to the previous screen
- [x] Options menu with: music toggle, SFX toggle, and exit button (when used as a pause menu)
- [x] Make the options menu accessible from the title screen
- [x] Add a `type` variable to differentiate between options and pause screens
- [x] Tests completed · [x] Team review

### #22 — Logic: Flow of creating, loading and overwriting saves · US-02
- [x] On 'New Game' selection: navigate to archetype selection
- [x] On existing game selection: load its state and navigate to the map
- [x] On overwrite: show confirmation, delete previous data, and create new game
- [x] Store the active save slot in the global session context
- [x] Tests completed · [x] Team review

### #21 — Frontend: Game selection and creation menu UI · US-02
- [x] Display up to 3 save slots showing: name, level, floor, and last session date
- [x] Show empty slots with 'Empty' text
- [x] Confirmation prompt when creating or overwriting a saved game
- [x] Disable creation if all 3 slots are occupied (or prompt to overwrite)
- [x] Tests completed · [x] Team review

### #19 — Logic: Assignment of base attributes and initial cards · US-29
- [x] Define base attribute values for each archetype in `GlobalVariables.js`
- [x] On archetype selection: assign base attributes to the Player object
- [x] On archetype selection: add the 5 starting cards to inventory in the DB
- [x] Save the chosen archetype to the save slot
- [x] Trigger the first cinematic after confirming the selection
- [x] Tests completed · [x] Team review

### #16 — Database: Constraints and referential integrity · US-24
- [x] Define PRIMARY KEY constraints on all tables
- [x] Define FOREIGN KEY constraints with ON DELETE CASCADE where applicable
- [x] Add NOT NULL constraints to required fields
- [x] Add UNIQUE constraints where applicable (email, username)
- [x] Verify that CRUD operations return no integrity errors
- [x] Tests completed · [x] Team review

### #15 — Database: Verification of the three normal forms · US-24
- [x] Verify all tables comply with 1NF (no repeating groups, primary key defined)
- [x] Verify all tables comply with 2NF (no partial dependencies)
- [x] Verify all tables comply with 3NF (no transitive dependencies)
- [x] Document primary and foreign keys for each table
- [x] Tests completed · [x] Team review

### #14 — Testing: CRUD operations validation · US-05
- [x] Test CREATE on each table
- [x] Test READ with filters (by user_id, by game_id)
- [x] Test UPDATE on the saved_games table
- [x] Test DELETE with referential integrity
- [x] Verify constraints (foreign keys, NOT NULL) work correctly
- [x] Tests completed · [x] Team review

### #13 — Database: Web-to-DB connection / API configuration · US-05
- [x] Configure the connection between the web page and the database
- [x] Create configuration file with environment variables (`.env`)
- [x] Add `.env` to `.gitignore` and create `.env.example`
- [x] Configure a connection pool for multiple concurrent users
- [x] Test the connection with a sample query
- [x] Tests completed · [x] Team review

### #12 — Database: Schema design and table creation · US-05
- [x] Create the entity-relationship diagram (ERD)
- [x] Create `users` table (id, email, username, password_hash, created_at)
- [x] Create `saved_games` table (id, user_id, name, level, floor, inventory, attributes, date)
- [x] Create `cards` table (id, name, type, stamina_cost, damage, scaled_attribute, rarity)
- [x] Create `permanent_inventory` table (id, user_id, card_id)
- [x] Document the purpose of each table
- [x] Tests completed · [x] Team review

### #11 — Logic: Button status and main menu navigation · US-01
- [x] Disable the Continue button if there are no saved games
- [x] Connect each button to its corresponding screen/flow
- [x] Verify active session on screen load (redirect to login if no session)
- [x] Allow returning to the title screen from any submenu
- [x] Tests completed · [x] Team review

### #10 — Frontend: Main menu design and implementation · US-01
- [x] Design and implement the title screen with the game logo
- [x] Create the buttons: New Game, Continue, Options, Statistics, Credits
- [x] Implement button hover animations
- [x] Tests completed · [x] Team review

### #08 — Frontend: Loading screen design and implementation · US-37
- [x] Design the loading screen with the game logo
- [x] Add a progress indicator (bar or animation)
- [x] Apply the game's watercolor aesthetic
- [x] Ensure no blank screens are visible
- [x] Tests completed · [x] Team review

### #07 — Frontend: Login screen UI · US-14
- [x] Create login screen with fields: username/email and password
- [x] Show error message if credentials are incorrect
- [x] Show account-locked message if applicable
- [x] Button to access the registration screen for new users
- [x] Redirect to the title screen after successful login
- [x] Tests completed · [x] Team review

### #06 — Backend: Authentication endpoint with JWT · US-14
- [x] Create the `POST /auth/login` endpoint
- [x] Search user by username or email in the database
- [x] Compare password against the stored hash
- [x] Generate a session token with expiration (30 min)
- [x] Implement failed-attempts counter (max. 5)
- [x] Temporarily lock the account after 5 failed attempts
- [x] Tests completed · [x] Team review

### #05 — Testing: Validation of the complete registration flow · US-28
- [x] Test successful registration with valid data
- [x] Test error with an already registered email
- [x] Test error with an already registered username
- [x] Test error with a weak password
- [x] Verify the password is NOT stored in plain text in the database
- [x] Tests completed · [x] Team review

### #04 — Frontend: Registration screen UI · US-28
Registration screen (email, username, password) with real-time validation feedback.
See US-28 in the SRS for the full acceptance criteria.
