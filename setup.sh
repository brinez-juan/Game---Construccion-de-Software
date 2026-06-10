#!/usr/bin/env bash
# setup.sh — installs all project dependencies
# Mac/Linux: run with   bash setup.sh
# Windows:   run with   Git Bash → bash setup.sh

set -e

echo "=== Return — Project Setup ==="
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed."
    echo "Download it from https://nodejs.org (LTS version recommended)."
    exit 1
fi

NODE_VERSION=$(node -v)
echo "Node.js $NODE_VERSION found."

# Check npm
if ! command -v npm &> /dev/null; then
    echo "ERROR: npm is not installed. It normally comes with Node.js."
    exit 1
fi

NPM_VERSION=$(npm -v)
echo "npm $NPM_VERSION found."
echo ""

# Install dependencies
echo "Installing dependencies..."
npm install
echo ""
echo "Dependencies installed successfully."
echo ""

# Check for .env file
ENV_PATH="Videojuego/WebPage/Backend/.env"

if [ -f "$ENV_PATH" ]; then
    echo ".env file already exists at $ENV_PATH — skipping."
else
    echo "No .env file found. Creating a template at $ENV_PATH..."
    cat > "$ENV_PATH" <<'EOF'
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=return_game
DB_PORT=3306
JWT_SECRET=change_this_secret
PORT=3000
EOF
    echo "Template created. Fill in your database credentials before starting the server."
fi

echo ""
echo "=== Setup complete ==="
echo "Start the server with:  npm start"
echo "Then open:              http://localhost:3000"
