 Requirements Specification — *Return*

**Institution:** Tecnológico de Monterrey, Santa Fe Campus  
**Materia:** Software Construction and Decision Making  
**Estudio:** © 2026 OTHEA Games Studio  
**Delivery date:** May 06, 2026

**Authors:**

| Name | Tuition |
|---|---|
| Juan Pablo Briñez Corzo - España | A01782050 |
| Santiago Martin Vences - France | A01787450 |
| José Paulo Vélez Ortiz | A01787207 |

---

## Table of Contents

1. [Introduction](#1-Introduction)
2. [Functional Requirements](#2-functional-requirements)
   - [User Stories](#21-user-stories)
3. [Non-Functional Requirements](#3-Non-Functional Requirements)
   - [Performance](#31-performance)
   - [Compatibility](#32-compatibility)
   - [Security](#33-security)
   - [Usability & Accessibility](#34-usability-and-accessibility)
   - [Persistence & Data](#35-persistence-and-data)
   - [Location](#36-location)
   - [Maintainability](#37-maintainability)

---

## 1. Introduction

This Software Requirements Specification (SRS) document describes the functional and non-functional requirements of the game **Return**, a turn-based TCG roguelite developed by OTHEA Games Studio.

The document is based on:
- The gameplay flow defined by the team
- El Game Design Document (GDD) v2
- Clarifications made during the analysis process

Each requirement is expressed in **User Story** format  with validation criteria, priority and estimated development time.

---

## 2. Functional Requirements

### 2.1 User Stories

---

#### US-01 — Game Title Screen

| Field | Detail |
|---|---|
| **How** | User |
| **I want** | a main menu with five buttons: New Game, Continue, Options, Stats, and Credits |
| **For** | Access all sections of the game from a single entry point |
| **Priority** | 1 |
| **Estimated time** | 5h |

**Validation criteria:**
- The screen shows the title of the game, a background according to the aesthetics and the five buttons.
- **New Game** starts the saved game creation or selection flow.
- **Continue** redirects to the saved games menu if at least one is present; if not, the button is disabled or displays a message.
- **Options** opens the settings menu (music, SFX, language, clear progress).
- **Statistics** shows the user's accumulated statistics.
- **Credits** shows the game's credits.
- All buttons provide visual feedback when hovering.
- The user can return from any submenu to the title screen.

---

#### US-02 — Saves and Run Management

| Field | Detail |
|---|---|
| **How** | User |
| **I want** | View, create, and select saved games |
| **For** | Resume a previous game or start a new one without losing the history of previous runs |
| **Priority** | 2 |
| **Estimated time** | 8h |

**Validation criteria:**
- When selecting "New Game", the system displays the saved games menu.
- If there are no saved games, the option to create a new one is directly offered.
- The user can create up to three games simultaneously.
- Each entry displays: profile name, current level, floor reached, and date last session.
- When you select an existing game, the game continues from the save point.
- When creating a new one, a name is requested with a confirmation prompt.
- If all three slots are occupied, an existing slot is asked to overwrite.
- Each game is saved in the database linked to the authenticated user.

---

#### US-03 — Options Menu / Pause

| Field | Detail |
|---|---|
| **How** | User |
| **I want** | Be able to pause the game at any time and access the options menu |
| **For** | not losing my progress and being able to adjust the settings without leaving the game |
| **Priority** | 1 |
| **Estimated time** | 4h |

**Validation criteria:**
- There is a visible options button in the top right corner during gameplay.
- Pressing it pauses the game and opens the options menu.
- The menu contains: music volume control, SFX control, language selector, and option to clear progress.
- The clear progress option displays a confirmation prompt.
- The user can close the menu and return to the paused state.
- All buttons provide visual feedback.

---

#### US-04 — Game Story and Cinematics

| Field | Detail |
|---|---|
| **How** | User |
| **I want** | Game Has An Entertaining Story Presented In Cutscenes At Key Moments |
| **For** | Enjoying Edrick's Narrative and Remembering the Game in a More Meaningful Way |
| **Priority** | 1 |
| **Estimated time** | 8h |

**Validation criteria:**
- The game has at least three cinematics: after selecting the archetype, after completing the tutorial, and after defeating the final boss.
- Cinematics play in a linear fashion and have a skip button.
- Dialogues and flashbacks implemented at the right moments of the flow.
- At the end of each cinematic, the game continues to the correct screen.
- Cinematics only play during the first game; in subsequent runs they are automatically skipped.
- The story is validated with users.

---

#### US-05 — Database with multiple tables

| Field | Detail |
|---|---|
| **How** | Database Administrator |
| **I want** | A database with multiple well-structured tables |
| **For** | Store and access game and user information efficiently |
| **Priority** | 2 |
| **Estimated time** | 7h |

**Validation criteria:**
- Tables are created for: users, saved games, cards, game statistics, global user statistics, and administrative statistics.
- The website connects to the database via an API.
- Information is stored and retrieved correctly in all operations.
- CRUD operations do not return errors.

---

#### US-06 — Music and Sound Effects

| Field | Detail |
|---|---|
| **How** | User |
| **I want** | Surround Music and SFX to Complement the On-Screen Action |
| **For** | not getting bored during a game and remembering the game better |
| **Priority** | 3 |
| **Estimated time** | 3h |

**Validation criteria:**
- Music created for: main menu, tutorial (forest), regular battles, and boss fights.
- SFX for: Physical Attacks, Magic Attacks, Perfect/Normal/Bad Parry, Healing, XP, Card UI, and Dialogue.
- Music and SFX inserted at the right times.
- The volume is controlled independently from the options menu.
- Validated with users to ensure that they are attractive and not distracting.

---

#### US-07 — User-Visible Statistics

| Field | Detail |
|---|---|
| **How** | User |
| **I want** | View My Own Accumulated Game Stats |
| **For** | Know my performance throughout all my games |
| **Priority** | 3 |
| **Estimated time** | 5h |

**Validation criteria:**
- From "Statistics" the following are displayed: average completion time, percentage of parrys, total enemies/bosses defeated, games completed and maximum level reached.
- The data is retrieved from the database correctly.
- Data is presented with graphs or other visuals.
- Stats are updated at the end of each match.

---

#### US-08 — Color palette in environments and characters

| Field | Detail |
|---|---|
| **How** | User |
| **I want** | A consistent color palette that reduces eye strain |
| **For** | Not feeling overwhelmed after a gaming session |
| **Priority** | 2 |
| **Estimated time** | 6h |

**Validation criteria:**
- The color palette is defined following the watercolor style described in the GDD (section 5).
- Scenarios and characters created respecting the defined palette.
- Validated with users.

---

#### US-09 — Card Gameplay and Interactability

| Field | Detail |
|---|---|
| **How** | User |
| **I want** | Being able to play with multiple cards during combat |
| **For** | Enriching My Experience with TCG Mechanics in a Turn-Based Game |
| **Priority** | 1 |
| **Estimated time** | 8h |

**Validation criteria:**
- TCG cards are created with their attributes: Stamina Cost, Action Type, Damage/Effect Values, and Attribute Requirements.
- The cards are designed with the GDD's watercolor aesthetic.
- The player can select one card per turn during combat.
- When selecting a card, it flips showing its full attributes with "Use" and "Don't Use" buttons.
- Users understand the mechanics of TCG.

---

#### US-10 — Stamina Use and Recovery

| Field | Detail |
|---|---|
| **How** | User |
| **I want** | A Stamina system that is consumed by using cards and recovered by Parry |
| **For** | Adding Difficulty and Strategic Depth to Resource Management |
| **Priority** | 1 |
| **Estimated time** | 8h |

**Validation criteria:**
- The player has a visible stamina bar in the upper left corner.
- Each card has a stamina cost; the player cannot use it without enough stamina.
- Recovery according to type of parry: perfect → moderate stamine; normal → small stamine; bad → no recovery.
- Users understand the mechanics of use and retrieval.

---

#### US-11 — Floors, Bosses, and Enemies

| Field | Detail |
|---|---|
| **How** | User |
| **I want** | Multiple floors with varied enemies and one boss per floor |
| **For** | Have a variety of encounters that keep the game entertaining |
| **Priority** | 1 |
| **Estimated time** | 8h |

**Validation criteria:**
- A tutorial floor (forest) and three main floors, each with three rooms.
- Only the last quarter of each floor has a boss.
- Multiple types of enemies per floor, each with unique stats and special ability.
- Bosses have more health, more damage, and higher parry bar speed.
- Users understand and enjoy encounters.

---

#### US-12 — Game map with floors and rooms

| Field | Detail |
|---|---|
| **How** | User |
| **I want** | A map showing available floors and rooms |
| **For** | Visualize my progress and understand the structure of the game |
| **Priority** | 1 |
| **Estimated time** | 9am |

**Validation criteria:**
- The map shows all floors and rooms.
- Unlocked Rooms: Illuminated. Locked: Hidden in fog.
- The current or next available room has a visual indicator.
- Quarters are unlocked in order by defeating all enemies in the previous quarter.
- The boss room is only unlocked by completing the other rooms on the floor.
- Users understand progression and the map.

---

#### US-13 — Randomized Enemies in Regular Quarters

| Field | Detail |
|---|---|
| **How** | User |
| **I want** | Quarters have randomized enemies from a set corresponding to the floor |
| **For** | Make every run different and reinforce the roguelite element |
| **Priority** | 2 |
| **Estimated time** | 9am |

**Validation criteria:**
- Sets of enemies are created for each floor.
- When entering a regular room, enemies are randomly generated from the current floor set.
- The randomizer does not always repeat the same enemies.
- Encounters can include a single enemy or hordes of multiple enemies.

---

#### US-14 — Password Login

| Field | Detail |
|---|---|
| **How** | User |
| **I want** | requiring my password when logging in |
| **For** | Have a layer of security on my account |
| **Priority** | 2 |
| **Estimated time** | 9am |

**Validation criteria:**
- Login screen that asks for username (or email) and password.
- The system checks the credentials against the database.
- Clear message if credentials are incorrect.
- Redirect to the title screen when successfully authenticating.
- Maximum 5 failed attempts before temporary blocking.

---

#### US-15 — Battle Summary

| Field | Detail |
|---|---|
| **How** | User |
| **I want** | See a summary at the end of each battle |
| **For** | Know how well I did and what experience and rewards I gained |
| **Priority** | 2 |
| **Estimated time** | 7h |

**Validation criteria:**
- When defeating all enemies in a room, the battle summary screen is displayed.
- The summary includes: experience earned, card(s) obtained, and percentage of parrys.
- Against a boss, three reward cards are displayed for the player to choose one of.
- The player can continue to the map from this screen.

---

#### US-16 — Experience System

| Field | Detail |
|---|---|
| **How** | User |
| **I want** | An in-game experience system |
| **For** | Grow throughout the game and improve my stats |
| **Priority** | 1 |
| **Estimated time** | 9am |

**Validation criteria:**
- The XP thresholds for each level and the attribute points awarded when leveling up are defined.
- The player gains XP by defeating enemies; bosses grant more XP.
- The player levels up upon reaching the corresponding threshold.
- XP progress is visible in the Battle Lobby.
- Leveling up adds attribute points to the available counter.

---

#### US-17 — Attribute System

| Field | Detail |
|---|---|
| **How** | User |
| **I want** | An Attribute System That Can Be Upgraded with Attribute Points |
| **For** | Customize My Character And Boost Certain Cards In My Deck |
| **Priority** | 2 |
| **Estimated time** | 9am |

**Validation criteria:**
- The five attributes are implemented: **Strength, Vigor, Endurance, Intelligence, and Dexterity**.
- Scaling cards with attributes is defined (e.g. sword scales with Strength).
- If the player does not meet the attribute requirement of a card, they cannot include it in the Battle Deck.
- The player can spend Attribute Points from the Battle Lobby before each fight.
- When you level up an attribute, the stats of cards that scale with it are updated in real-time.
- The base attribute values are different depending on the chosen archetype.

---

#### US-18 — Enemy and Boss Bounty Cards

| Field | Detail |
|---|---|
| **How** | User |
| **I want** | Get Reward Cards for Defeating Enemies and Bosses |
| **For** | Expand my variety of cards and try different strategies in each run |
| **Priority** | 1 |
| **Estimated time** | 9am |

**Validation criteria:**
- Regular enemies have a pool of cards; the reward depends on the weapon the enemy was using.
- Each boss offers exactly three cards to the player to choose from.
- Reward cards are saved in the player's inventory.
- When receiving the card, the game displays the message "You have gotten:" before continuing.

---

#### US-19 — The game is hosted on a website

| Field | Detail |
|---|---|
| **How** | User |
| **I want** | Make the game available on a website |
| **For** | Access it from a browser without installation |
| **Priority** | 2 |
| **Estimated time** | 8h |

**Validation criteria:**
- The website contains additional sections: history, credits and statistics.
- The game is embedded in a section of the page.
- The page and game load without errors.
- The game is functional in a regular browser with no plugins or downloads.
- The page has no performance issues.

---

#### US-20 — Tutorial with Text Boxes and Arrows

| Field | Detail |
|---|---|
| **How** | User |
| **I want** | Have the tutorial explain the mechanics using text boxes with arrows |
| **For** | Learning to play progressively and intuitively |
| **Priority** | 1 |
| **Estimated time** | 10am |

**Validation criteria:**
- The tutorial occurs during the first quarter of the game (forest/tutorial stage).
- Text boxes with arrows in the following sequence: life bars and stamina → player sprite → action cards → enemy spawn → attack mechanics → parry bar → defensive cards and healing potion → hordes and area cards → boss spawn.
- The game pauses completely when each text box is displayed.
- The arrows point to the exact UI element being explained.
- The boxes disappear when you click on them or click on a continue button.
- The text boxes of the tutorial **DON'T** appear in runs after the first one.
- The "first game" flag is saved in the database by user profile.

---

#### US-21 — Parry Mechanics

| Field | Detail |
|---|---|
| **How** | User |
| **I want** | that the game has a parry mechanic with a timing bar |
| **For** | Keep Combat Active and Add More Strategy |
| **Priority** | 1 |
| **Estimated time** | 7h |

**Validation criteria:**
- The parry bar appears when an enemy attacks the player.
- The bar has three zones: 🔴 red (parry bad), 🟡 yellow (parry normal), 🟢 green (parry perfect).
- The player stops the indicator by pressing the **space bar**.
- Results: perfect → no loss of life + moderate stamina; normal → low life + little stamina; bad → a lot of lost life and stamina.
- Gauge speed is higher in boss fights.
- The size of the gauge varies with the player's current stamina
- Users understand the three types of parry and their consequences.

---

#### US-22 — Deck Card Management and Removal

| Field | Detail |
|---|---|
| **How** | User |
| **I want** | A screen where I can see my full deck and manage my cards |
| **For** | Keeping My Deck Efficient and Maximizing My Chances in Combat |
| **Priority** | 1 |
| **Estimated time** | 7h |

**Validation criteria:**
- The Battle Lobby displays the "My Deck" section with all the cards in the inventory and "Battle Deck" with 5 slots.
- Selecting a card from My Deck flips it over and shows its attributes; clicking again moves it to the Battle Deck.
- The player can only have 5 cards in the Battle Deck.
- If a card does not meet the attribute requirements, it cannot be added to the Battle Deck.
- The deck is updated in real-time in the database.
- UI provides clear feedback when attempting to add an incompatible letter.

---

#### US-23 — Game Over Screen

| Field | Detail |
|---|---|
| **How** | User |
| **I want** | A Game Over screen when I lose my whole life |
| **For** | Knowing that my run is over and having the option to choose a card to keep |
| **Priority** | 1 |
| **Estimated time** | 6h |

**Validation criteria:**
- The Game Over screen is activated when the player's health reaches zero.
- Sample: Game Over message and run's summary (floors completed, enemies defeated, final level).
- **All** run progress is removed: unsaved health, stamina, cards, and XP.
- The player returns to the archetype selection screen.
- The player can choose a card from those obtained to keep it in their permanent inventory (see US-25).
- Permanent progress (cards from previous runs) is **not** lost upon death.

---

#### US-24 — Database Normalization

| Field | Detail |
|---|---|
| **How** | Database Administrator |
| **I want** | that the database complies with the normalization rules |
| **For** | Minimize redundancy and avoid errors in CRUD operations |
| **Priority** | 2 |
| **Estimated time** | 8h |

**Validation criteria:**
- All tables comply with the three normal shapes.
- Each table has a primary key defined.
- Foreign keys are used to relate the tables.
- Query performance is not degraded.
- Data integrity rules are enforced.
- CRUD operations do not return errors.

---

#### US-25 — Saving a Letter When Losing

| Field | Detail |
|---|---|
| **How** | User |
| **I want** | being able to save one of the cards obtained in a run when losing |
| **For** | Have permanent progression between runs |
| **Priority** | 2 |
| **Estimated time** | 8h |

**Validation criteria:**
- When you reach the Game Over, all the cards obtained during the run are displayed.
- The user can select a card to keep it permanently.
- The game handles the case in which the user does not select any cards.
- The selected card is saved in the player's permanent inventory in the database.
- Unselected cards are removed from the inventory.

---

#### US-26 — Game Safety

| Field | Detail |
|---|---|
| **How** | Security Manager |
| **I want** | Make the game as safe as possible |
| **For** | Prevent Data Breaches and Cyberattacks |
| **Priority** | 3 |
| **Estimated time** | 10am |

**Validation criteria:**
- Passwords are hashed before being stored in the database.
- SQL injection attacks are prevented.
- Excessive traffic is handled to prevent DoS attacks.
- Environment variables are not stored in the repository.
- MFA is used to strengthen security.
- Maximum 5 failed attempts before temporary blocking.
- Sessions expire automatically after 30 minutes of inactivity.

---

#### US-27 — Database Query Optimization

| Field | Detail |
|---|---|
| **How** | Database Administrator |
| **I want** | Make database queries as optimized as possible |
| **For** | Reduce Loading Times and Deliver a Better User Experience |
| **Priority** | 3 |
| **Estimated time** | 7h |

**Validation criteria:**
- The most frequent queries (progress saving, card loading, statistics update) are identified and optimized.
- Indexes are used where appropriate.
- Response times meet an acceptable threshold.
- Performance does not degrade with multiple concurrent users.

---

#### US-28 — User Registration

| Field | Detail |
|---|---|
| **How** | New User |
| **I want** | To be able to register with email, username and password |
| **For** | Create a personal account that saves my progress and stats |
| **Priority** | 1 |
| **Estimated time** | 6h |

**Validation criteria:**
- Registration screen accessible from the login screen.
- The form requests: email, username and password.
- The system validates the email format in real time.
- It is verified that username and email are not already registered; if they are, it shows a specific error.
- The password must meet minimum security criteria.
- Upon successful registration, the user is redirected to the title screen.
- Email confirmation is not required.

---

#### US-29 — Archetype Selection

| Field | Detail |
|---|---|
| **How** | User |
| **I want** | Choose from three archetypes when starting a new game |
| **For** | Having a character identity and a starter card set that shapes my strategy |
| **Priority** | 1 |
| **Estimated time** | 8h |

**Validation criteria:**
- The three archetypes are shown: **Soldier, Archer, and Mage**.
- Hovering over an archetype flips the card flip over and displays the five base attributes and five starting cards.

| Archetype | Initial Letters |
|---|---|
| **Soldier** | Sword, Shield, Spear, Potion of Strength, Potion of Healing |
| **Goalkeeper** | Bow, Dagger, Small Shield, Crossbow, Healing Potion |
| **Magician** | Staff, Fireball, Flamethrower, Earth Shield, Healing Potion |

- Each archetype has different base attribute values according to its role.
- Selecting an archetype starts the first cinematic and then the tutorial.

---

#### US-30 — Battle Lobby (Battle Prep Menu)

| Field | Detail |
|---|---|
| **How** | User |
| **I want** | A prep menu before each battle where you can select cards and spend Attribute Points |
| **For** | Going into each fight with the strategy that best suits my needs |
| **Priority** | 1 |
| **Estimated time** | 9am |

**Validation criteria:**
- The Battle Lobby displays: player name, character photo, Battle Deck (5 slots), My Deck (full inventory), current level with XP bar, and attribute section with available points.
- The player can select up to 5 cards for the Battle Deck from My Deck.
- The player can spend attribute points by pressing the "+" button of the desired attribute.
- When you upload an attribute, the stats of related cards are updated in real-time.
- Cards with unfulfilled requirements are disabled.
- On the first visit, text boxes appear with arrows explaining each section.
- The "Continue" button takes the player into battle.

---

#### US-31 — Area Card Mechanics (AoE)

| Field | Detail |
|---|---|
| **How** | User |
| **I want** | Certain cards attacking all enemies simultaneously |
| **For** | Be able to manage hordes strategically |
| **Priority** | 1 |
| **Estimated time** | 6h |

**Validation criteria:**
- AoE cards (Spear, Crossbow, Flamethrower) are identified as AoE in their description.
- When using an AoE card, damage is applied to all enemies present on screen.
- AoE cards have less damage than equivalent single-target cards.
- The animation reflects that the attack encompasses multiple enemies.
- The health bars of all affected enemies are updated correctly.

---

#### US-32 — Defensive Card Mechanics

| Field | Detail |
|---|---|
| **How** | User |
| **I want** | that by using a defensive card I sacrifice my attack turn in exchange for guaranteeing a perfect parry |
| **For** | Be able to make tactical defensive decisions when the situation requires it |
| **Priority** | 2 |
| **Estimated time** | 5h |

**Validation criteria:**
- Defensive cards (Shield, Small Shield, Earth Shield) do not deal damage when used.
- When used, the system marks the player in guard status for that turn.
- The enemy's next attack automatically forces parry's result to "perfect".
- Stamina recovers as in a perfect parry.
- UI shows visual feedback of defensive posture.
- The guard state is consumed when attacked and does not persist for more than one turn.

---

#### US-33 — Hordes (multi-enemy encounters)

| Field | Detail |
|---|---|
| **How** | User |
| **I want** | Some encounters include multiple enemies at the same time |
| **For** | Add tactical variety and make the game not always 1 vs 1 |
| **Priority** | 2 |
| **Estimated time** | 8h |

**Validation criteria:**
- Horde encounters can include 2 or more simultaneous enemies.
- Each enemy in the horde has its own independent health bar.
- The player can choose which enemy to attack with single-target cards.
- Enemy turns are resolved sequentially, allowing each attack to be parry individually.
- The screen correctly displays all active enemies with no performance issues.

---

#### US-34 — Game End Screen

| Field | Detail |
|---|---|
| **How** | User |
| **I want** | View a screen with the stats of my entire game when defeating the final boss |
| **For** | Know my total performance and feel the satisfaction of having completed the game |
| **Priority** | 1 |
| **Estimated time** | 5h |

**Validation criteria:**
- The screen appears after the final cinematic.
- Sample: congratulations message, total completion time, parrys percentage, total enemies defeated, cards obtained, final level, final attributes, and total XP.
- The player can continue to the permanent card selection (New Game+).

---

#### US-35 — New Game+ (Permanent Card Reset)

| Field | Detail |
|---|---|
| **How** | User |
| **I want** | Be able to restart the game while keeping a card from my previous game |
| **For** | Feel progression between runs and approach the game with an early advantage |
| **Priority** | 1 |
| **Estimated time** | 7h |

**Validation criteria:**
- Upon completion of the game, a card selection menu is displayed to keep a card from the deck.
- The game resets from archetype selection with the permanent card available.
- In runs after the first run, the tutorial text boxes do not appear.
- All other inventory and previous progress are removed when you start New Game+.
- The Permanent Card survives kills during the New Game+.

---

#### US-36 — Statistics for Administrators

| Field | Detail |
|---|---|
| **How-to** | Administrator |
| **I want** | Access to aggregated stats for all players |
| **For** | Identify Difficult Sections and Make Swing Adjustments |
| **Priority** | 3 |
| **Estimated time** | 6h |

**Validation criteria:**
- Administrative statistics are stored in a separate table.
- They include: parry success rate per floor, average completion time, abandonment rate per floor, enemies/bosses with the highest defeat rate, and archetype distribution.
- Available in a separate admin panel from the user interface.
- Data is updated after each completed or failed match.
- Data is **not** accessible to regular users.

---

#### US-37 — Loading Screen

| Field | Detail |
|---|---|
| **How** | User |
| **I want** | View a loading screen while the game prepares data |
| **For** | Don't let the experience feel like a bug or blank screen |
| **Priority** | 3 |
| **Estimated time** | 2h |

**Validation criteria:**
- The loading screen appears when launching the game and between heavy transitions.
- Display the logo or name of the game and a progress indicator.
- Automatically disappears when content is ready.
- There are no blank screens visible to the user at any point in the flow.

---

## 3. Non-Functional Requirements

### 3.1 Performance

| ID | Request |
|---|---|
| **RNF01** | The game must load completely in less than **5 seconds** on a standard broadband connection (10 Mbps). |
| **RNF02** | The game engine must maintain a stable framerate (minimum **30 FPS**) by simultaneously rendering up to 5 enemies with their animations and life bars. |
| **RNF03** | Sound effects (SFX) must be played at a maximum of **100 ms** after the event that triggers them. |
| **RNF04** | The parry system should register the player's input (space bar) with a maximum latency of **50 ms** to make the mechanics feel fair and responsive. |

### 3.2 Compatibility

| ID | Request |
|---|---|
| **RNF05** | The game must run error-free on the **last two stable versions** of Chrome, Firefox, Safari and Edge. |
| **RNF06** | The game must be fully functional from the browser **without requiring plugins, extensions or additional downloads**. |
| **RNF07** | The interface must adapt to screen resolutions of at least **1280×720** without any element being left out of the viewport or overlapping. |

### 3.3 Security

| ID | Request |
|---|---|
| **RNF08** | User passwords must be stored using a secure hashing algorithm (**bcrypt or equivalent**). |
| **RNF09** | User sessions should automatically expire after **30 minutes of inactivity**. |
| **RNF10** | Environment variables (API keys, database credentials) should **not** be stored in the code repository. |
| **RNF11** | The system must prevent **SQL injection** attacks  by means of parameterized queries or an ORM. |

### 3.4 Usability and Accessibility

| ID | Request |
|---|---|
| **RNF12** | The parry bar must include a **visual alternative** (pattern or text label) in addition to the red/yellow/green color code, for users with color blindness. |
| **RNF13** | The tutorial text boxes should **disappear in subsequent runs** to the first one without any user action. |
| **RNF14** | All buttons and interactive elements must provide **visual feedback** when hovering over them. |

### 3.5 Persistence and Data

| ID | Request |
|---|---|
| **RNF15** | The player's progress (cards, XP, attributes) must be **automatically** saved  in the database at the end of each battle, without manual user action. |
| **RNF16** | Administrative statistics and user-visible statistics shall be stored in **separate tables** in the database. |

### 3.6 Location

| ID | Request |
|---|---|
| **RNF17** | All game texts must be **externalized in separate language files** to facilitate the addition of new languages without modifying the source code. |
| **RNF18** | The language change from the options menu must be applied **immediately**, without requiring a game restart. |

### 3.7 Maintainability

| ID | Request |
|---|---|
| **RNF19** | The source code shall follow the **class architecture defined in the GDD** (section 4): base classes ('GameObject', 'Character'), derived classes ('Player', 'Enemy', 'NPC') and support classes ('Action', 'ItemCard', 'User'). |
| **RNF20** | Graphic assets must follow the **watercolor style** defined in section 5 of the GDD without exceptions to maintain visual consistency. |

---

*Document generated from SRS_Return_v2.docx — OTHEA Games Studio © 2026*

