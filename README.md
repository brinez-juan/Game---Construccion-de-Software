# Return

## How to run the playable prototype

The prototype is the **battle scene**, and it must be opened **directly from the filesystem** (not through the dev server).

1. Clone or download the repository.
2. Open `Videojuego/WebPage/pages/game.html` in any modern browser. Double-click the file or paste its `file://` path into the address bar.
3. The battle scene loads as the entry screen — no login, no menu navigation required.

> The Express server in `Videojuego/Backend/server.js` is wired but is **not** used by the prototype. The server version of the game currently only renders the login page because of asset-path issues that are scheduled for a later sprint.

### Optional — running the backend

The backend is required for account management and persistence but **not** for the prototype.

```
npm install
node Videojuego/Backend/server.js
```

It expects a `.env` file inside `Videojuego/Backend/` with:

```
DB_HOST=...
DB_USER=...
DB_PASSWORD=...
DB_NAME=...
DB_PORT=...
JWT_SECRET=...
PORT=3000
```

## Controls

| Input | Action |
| --- | --- |
| Mouse hover | Highlight cards, enemies and menu buttons |
| Left click on a card | Pick the card to play this turn |
| Left click on an enemy | Confirm the chosen card on that target |
| Left click on a defensive card | Apply guard and end the turn |
| `Space` | Lock in the parry timing during enemy attacks |

## Entry scene of the prototype

`game.html` boots straight into `battleScreen` with:

- Mock player loaded with five starter cards (`fireball`, `vicious_sword`, `knight_shield`, `battle_axe`, `hunter_bow`)
- Three `corrupt_knight` enemies
- Player and enemy health and stamina bars
- A `ParryBar` that activates during enemy turns

When player health reaches zero, the scene transitions to `gameOverScreen`. When every enemy is defeated, the scene transitions to `successScreen`.

## What is finished

- Battle loop: turn order, card selection, targeting and stamina cost handling
- Enemy AI in `NonPlayableCharacter.js` that picks attacks or defenses from health ratio plus the player damage profile
- Parry minigame with three timing windows (`perfect`, `normal`, `miss`) and corresponding stamina rewards or penalties
- HUD bars (`Bar`, `parryBar`) that animate health, stamina and parry indicator
- Menu navigation skeleton: `mainMenu`, `selectionMenu`, `optionsMenu`, `creditScreen`
- Login and registration pages with backend JWT issuance, bcrypt hashing and rate-limited lockout
- Backend persistence layer: saved-game slots, archetype profiles, attribute spending and card inventory endpoints (`Videojuego/Backend/SavedGames`)

## What is still in development

- Wiring the backend persistence layer into the gameplay flow (currently the prototype runs entirely with mock data)
- Fixing asset and import paths so the game can be served from the Express server instead of the filesystem
- Archetype selection screen and pre-battle deck-building lobby (`BattleLobbyUI` is implemented but not yet hooked into navigation)
- Loading screen (`loadingScreen.js` is a stub)
- Map and floor progression between battles
- Audio engine behind the music and SFX toggles in `optionsMenu`
- Run and roguelite persistence on the client (server endpoints are ready, the client adapter `savedGamesApi.js` is also ready, but the screens that consume them are pending)
- Boss encounters and card rewards drop screen

## Project layout

```
Videojuego/
  Game/                   ES module classes used by the canvas prototype
  WebPage/
    pages/                HTML entry points (game.html is the prototype)
    Assets/
      Sprites/            Card art, UI icons, character sprites
      backgrounds/        Scene backgrounds
    styles/               CSS for the HTML pages
  Backend/
    Auth/                 Register, login and JWT middleware
    DB/                   MySQL connection pool and smoke test
    SavedGames/           Slot, attribute and card REST routes
    server.js             Express bootstrap
  ArchetypeManager.js     Pre-battle systems built on top of the backend
  AttributeSystem.js
  AttributePointSystem.js
  BattleDeckManager.js
  BattleLobbyUI.js
  GameSession.js
  GameStateManager.js
  SaveManager.js
  StaminaSystem.js
  savedGamesApi.js        Browser adapter for the REST endpoints
Database/
  DB modeling.svg        UML diagram of the database 
```
