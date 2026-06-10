# Return

## Project layout

```
Videojuego/
  Game/                     Game folder
    screens/
      menu/                 All screen and menu classes
    libs/                   Entity classes and shared objects
    extras/                 Managers and data utilities
  WebPage/
    pages/                  HTML entry points (game.html is the prototype)
    Assets/
      Audio/                Game's music for all game scenes
      Sprites/              Card art, UI icons, character sprites
        /cards              Card assets for the TCG element
        /characters         Main character and enemy assets for the game
      backgrounds/          Scene backgrounds
    styles/                 CSS for the HTML pages
  Backend/
    Auth/                   Register, login and JWT middleware
    DB/                     MySQL connection pool and smoke test
    SavedGames/             Slot, attribute, card and statistics REST routes
Database/                   Contains scripts and information related to the 
                            modelling and creation of the database
```

## How to run the game

The prototype is the **battle scene**, and it must be opened **directly from the filesystem** (not through the dev server).

1. Clone/Download the repository with the next command: `git clone https://github.com/brinez-juan/Game---Construccion-de-Software.git`
2. Run the sql schema file `return_game_schema.sql` stored at `insert directory` inside mysql, if you don't have mysql installed follow the next guide:  
`https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=&cad=rja&uact=8&ved=2ahUKEwiSzLyOifmUAxV1IEQIHRWpJYAQFnoECA0QAQ&url=https%3A%2F%2Fdev.mysql.com%2Fdoc%2Fmysql-installation-excerpt%2F5.7%2Fen%2F&usg=AOvVaw1ffvZJna0p6sAUod4w9u3E&opi=89978449`
3. Configure your .env file as specificated in the .env configuration section, all the data you have to fill will be in mysql when you create the database. Be careful in here, as if you set a password and then forget it you will not be able to access the database
4. Run the setup.sh on the terminal:
  - In the case of macOS/Linux use: `bash setup.sh`
  - In the case of windows opne Git Bash, navigate to the project folder and run: `bash setup.sh`
5. Run the game using `npm start` or `node Videojuego/Backend/server.js` in your terminal
6. Access the main page going to `localhost:3000` or typing localhost followed by the port chosen to run the game (if you don't know it it will appear on the terminal/powershell when running the server.js file)

> The Express server in `Videojuego/Backend/server.js` already renders all the webpage and the game

### .env configuration

The backend expects a `.env` file inside `Videojuego/Backend/` with:

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
