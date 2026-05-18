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

app.use('/styles', express.static(path.join(webPageDir, 'styles')));
app.use('/Assets', express.static(path.join(webPageDir, 'Assets')));
app.use('/pages', express.static(path.join(webPageDir, 'pages')));
app.use('/login.js', express.static(path.join(videojuegoDir, 'login.js')));

app.get('/', (req, res) => {
  res.sendFile(path.join(webPageDir, 'pages', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
