#!/bin/bash
set -euo pipefail

# ===============================
# SecureChat Installation Script
# Fixed & Production-Safe
# ===============================

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# App config
APP_NAME="securechat"
APP_ROOT="/opt/chatrooms"
APP_DIR="$APP_ROOT/chatroom"
SERVICE_USER="securechat"
SERVICE_PORT="3000"

NGINX_AVAILABLE="/etc/nginx/sites-available"
NGINX_ENABLED="/etc/nginx/sites-enabled"

echo -e "${BLUE}🚀 SecureChat Installation Script${NC}"
echo -e "${BLUE}================================${NC}"
echo ""

# ===============================
# Root / sudo handling
# ===============================
if [[ "$EUID" -eq 0 ]]; then
  SUDO=""
else
  if ! command -v sudo &>/dev/null; then
    echo -e "${RED}❌ sudo is required but not installed${NC}"
    exit 1
  fi
  SUDO="sudo"
fi

# Helper: run command as service user safely
run_as_service_user() {
  if [[ "$EUID" -eq 0 ]]; then
    su -s /bin/bash "$SERVICE_USER" -c "$*"
  else
    sudo -u "$SERVICE_USER" bash -c "$*"
  fi
}

# ===============================
# System checks
# ===============================
echo -e "${YELLOW}🔍 Checking system...${NC}"
if ! command -v lsb_release &>/dev/null || ! lsb_release -d | grep -qi ubuntu; then
  echo -e "${RED}❌ Ubuntu required${NC}"
  exit 1
fi
echo -e "${GREEN}✅ Ubuntu detected${NC}"

# ===============================
# Packages
# ===============================
echo -e "${YELLOW}📦 Updating system...${NC}"
$SUDO apt update

echo -e "${YELLOW}📦 Installing dependencies...${NC}"
$SUDO apt install -y curl wget gnupg2 software-properties-common nginx ufw ca-certificates

# ===============================
# Node.js
# ===============================
if ! command -v node &>/dev/null; then
  echo -e "${YELLOW}📦 Installing Node.js 20.x...${NC}"
  if [[ "$EUID" -eq 0 ]]; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
else
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
fi
  $SUDO apt install -y nodejs
fi

echo -e "${GREEN}✅ Node $(node -v) | npm $(npm -v)${NC}"

# ===============================
# Project validation
# ===============================
if [[ ! -d "./chatroom" || ! -f "./chatroom/package.json" ]]; then
  echo -e "${RED}❌ Run this script from repo root (./chatroom/package.json missing)${NC}"
  exit 1
fi

# ===============================
# Service user
# ===============================
echo -e "${YELLOW}👤 Creating service user...${NC}"
if ! id "$SERVICE_USER" &>/dev/null; then
  $SUDO useradd --system --shell /usr/sbin/nologin --home-dir "$APP_ROOT" --create-home "$SERVICE_USER"
fi

# ===============================
# Deploy files
# ===============================
echo -e "${YELLOW}📋 Deploying files...${NC}"
$SUDO mkdir -p "$APP_DIR"
$SUDO rm -rf "$APP_DIR"/*
$SUDO cp -r ./chatroom/* "$APP_DIR/"
$SUDO chown -R "$SERVICE_USER:$SERVICE_USER" "$APP_DIR"

# ===============================
# Build app
# ===============================
echo -e "${YELLOW}📦 Installing & building app...${NC}"
cd "$APP_DIR"

run_as_service_user "mkdir -p '$APP_ROOT/.npm'"
run_as_service_user "npm config set cache '$APP_ROOT/.npm' --global || true"
run_as_service_user "npm install"
run_as_service_user "npm run build"

# ===============================
# Detect run command
# ===============================
RUN_CMD=""
if node -e "const p=require('./package.json');process.exit(p.scripts?.start?0:1)"; then
  RUN_CMD="/usr/bin/npm run start"
elif node -e "const p=require('./package.json');process.exit(p.scripts?.serve?0:1)"; then
  RUN_CMD="/usr/bin/npm run serve"
elif node -e "const p=require('./package.json');process.exit(p.scripts?.preview?0:1)"; then
  RUN_CMD="/usr/bin/npm run preview -- --host 127.0.0.1 --port $SERVICE_PORT"
else
  echo -e "${RED}❌ No runnable script found in package.json${NC}"
  exit 1
fi

# ===============================
# systemd service
# ===============================
echo -e "${YELLOW}⚙️  Creating systemd service...${NC}"
$SUDO tee "/etc/systemd/system/$APP_NAME.service" >/dev/null <<EOF
[Unit]
Description=SecureChat
After=network.target

[Service]
Type=simple
User=$SERVICE_USER
WorkingDirectory=$APP_DIR
Environment=NODE_ENV=production
Environment=PORT=$SERVICE_PORT
ExecStart=$RUN_CMD
Restart=always
RestartSec=5

NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ProtectHome=true
ReadWritePaths=$APP_ROOT

[Install]
WantedBy=multi-user.target
EOF

# ===============================
# Nginx
# ===============================
echo -e "${YELLOW}🌐 Configuring Nginx...${NC}"
$SUDO tee "$NGINX_AVAILABLE/$APP_NAME" >/dev/null <<EOF
server {
    listen 80;
    server_name _;

    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private auth;
    gzip_types text/plain text/css application/json application/javascript;

    location / {
        proxy_pass http://127.0.0.1:$SERVICE_PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \$host;

        add_header Cache-Control "no-store" always;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|svg|woff2?)$ {
        proxy_pass http://127.0.0.1:$SERVICE_PORT;
        expires 1y;
        add_header Cache-Control "public, immutable" always;
    }
}
EOF

$SUDO rm -f "$NGINX_ENABLED/$APP_NAME"
$SUDO ln -s "$NGINX_AVAILABLE/$APP_NAME" "$NGINX_ENABLED/$APP_NAME"
$SUDO rm -f "$NGINX_ENABLED/default"

$SUDO nginx -t

# ===============================
# Firewall
# ===============================
echo -e "${YELLOW}🔥 Configuring firewall...${NC}"
$SUDO ufw --force enable
$SUDO ufw allow 22/tcp
$SUDO ufw allow 80/tcp
$SUDO ufw allow 443/tcp

# ===============================
# Start services
# ===============================
echo -e "${YELLOW}🚀 Starting services...${NC}"
$SUDO systemctl daemon-reload
$SUDO systemctl enable "$APP_NAME"
$SUDO systemctl restart "$APP_NAME"
$SUDO systemctl enable nginx
$SUDO systemctl restart nginx

sleep 2

# ===============================
# Status
# ===============================
if $SUDO systemctl is-active --quiet "$APP_NAME"; then
  echo -e "${GREEN}✅ SecureChat is running${NC}"
else
  echo -e "${RED}❌ SecureChat failed to start${NC}"
  $SUDO journalctl -u "$APP_NAME" -n 50 --no-pager
  exit 1
fi

echo ""
echo -e "${GREEN}🎉 Installation complete${NC}"
echo -e "🌐 Access: http://$(hostname -I | awk '{print $1}')"
