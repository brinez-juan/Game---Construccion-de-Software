# Return

## Project layout

```
Videojuego/
  Game/                     Canvas game client
    Return.js               Entry point: canvas, render loop and screen state machine
    screens/menu/           All screen and menu classes
    libs/                   Entity classes and shared objects
    extras/                 Managers and data utilities
  WebPage/
    pages/                  HTML entry points (index, login, game, statistics, tutorial, madeby)
    Assets/
      Audio/                Game's music for all game scenes
      Sprites/              Card art, UI icons, character sprites
        /cards              Card assets for the TCG element
        /characters         Main character and enemy assets for the game
      backgrounds/          Scene backgrounds
      cinematics/           Cutscene images
    styles/                 CSS for the HTML pages
    Backend/
      server.js             Express bootstrap (serves the website + game)
      Auth/                 Register, login and JWT/admin middleware
      DB/                   MySQL connection pool and smoke test
      SavedGames/           Slot, attribute, card, rooms, catalog and statistics REST routes
  Database/                 Scripts to recreate the MySQL database (schema, seed, dump, dbml)
  login.js                  Login/sign-up page logic
  savedGamesApi.js          Browser REST adapter over the /api/* endpoints
  statistics.js             Statistics page logic
```

## How to run the game

The game is served by the Express backend and persists everything in MySQL, so you log in through the
website and play in the browser.

1. Clone/Download the repository: `git clone https://github.com/brinez-juan/Game---Construccion-de-Software.git`
2. Create the database. From a terminal with the `mysql` client, run the schema (it creates the
   `return_game` database, tables, triggers and procedures) and then the seed data:
   ```bash
   mysql -u root -p < Videojuego/Database/schema_structure.sql
   mysql -u root -p < Videojuego/Database/seed_data.sql
   ```
   The seed includes the grading account used below, so loading `seed_data.sql` is required for the
   demo login to work. If you don't have MySQL installed, follow the official guide:
   `https://dev.mysql.com/doc/refman/8.0/en/installing.html`
3. Run the setup script (installs dependencies and creates the `.env` template):
   - macOS/Linux: `bash setup.sh`
   - Windows: open Git Bash, navigate to the project folder and run `bash setup.sh`
4. Configure your `.env` as described in the **.env configuration** section below. The values must match
   the MySQL database you created. Be careful here: if you set a password and then forget it, you will
   not be able to access the database.
5. Start the game with `npm start` (or `node Videojuego/WebPage/Backend/server.js`).
6. Open `localhost:3000` (or `localhost` followed by the port you chose). If you don't know the port,
   it is printed in the terminal when the server starts.

> The Express server in `Videojuego/WebPage/Backend/server.js` already renders all the webpage and the game.

### 🔑 Grading login — God Card enabled

To review the whole game quickly, from the **Game** section log in with the demo account:

```
Email:    juanbrinez1111@gmail.com
Password: J429220082p
```

This account (username **OMEGA**, included in the seed data) unlocks a developer-only **God Card** in
every battle: a black card that deals 10 000 damage for 0 stamina, ignores enemy defense and is never
consumed, so you can clear any room — including both stages of the final boss — and see the entire game
in a few minutes. The God Card only appears for this exact account and never affects normal play. The
account is also an administrator, so the **Statistics** page shows the admin panel with all-player
statistics.

### .env configuration

The backend expects a `.env` file inside `Videojuego/WebPage/Backend/` with:

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
| Left click on parry bar spawn | Lock in the parry timing during enemy attacks |

## Entry scene of the game

The game loads directly into the main menu with the next four options: 
- New game
- Continue
- Options
- Credits

When creating a new account you will not be able to access the continue menu, however you can create a game profile by going to new game, selecting a slot and selecting a class. Upon doing this you will be sent to a tutorial screen and will already be able to access the continue menu, where you will be able to continue previous game sessions. 

## Webpage sections

Upon entering the webpage you will be prompted with the next sections

- Home: Page that sumarizes all main aspects of the game and story
- Game: Game page, you will be prompted to login/sign in to access the game
- Statistics: You will be able to see global statistics and a leaderboard, in case you are an admin you will be able to see the administrator panel statistics
- Tutorial: Tutorial page in case a user wants to go deep into how game mechanics work
- Made by: Small section indicating our names and github profiles

## Game features
- Each user can create different player profiles in their game
- The player can earn many different cards after each floor and battle
- The player can choose a card upon death to use it in future runs
- Every card scales differently, requiring certain attributes and having a scaling factor 
- The player can parry attacks, making the turn based mechanics more engaging 
- The enemy quantity and types are randomized, enriching the roguelite mechanics of the game
