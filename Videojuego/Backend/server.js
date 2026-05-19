import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '.env') });

const { default: registerRouter } = await import('./Auth/register.js');
const { default: loginRouter } = await import('./Auth/loginLogic.js');

const webPageDir = path.resolve(__dirname, '..', 'WebPage');
const videojuegoDir = path.resolve(__dirname, '..');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(registerRouter);
app.use(loginRouter);

// Keep .env, dbconfig and auth source out of the public surface.
app.use('/Backend', (req, res) => res.status(404).send('Not found'));

app.use('/styles', express.static(path.join(webPageDir, 'styles')));
app.use('/Assets', express.static(path.join(webPageDir, 'Assets')));
app.use('/pages', express.static(path.join(webPageDir, 'pages')));

// Serve every ES module under Videojuego/ (Return.js, Menus.js, Player.js, …)
// so the browser can resolve the import graph used by game.html.
app.use(express.static(videojuegoDir, { index: false }));

// Redirect so the browser URL becomes /pages/index.html — this keeps the
// relative <a href="game.html"> links in the nav resolving to /pages/game.html.
app.get('/', (req, res) => {
  res.redirect('/pages/index.html');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
