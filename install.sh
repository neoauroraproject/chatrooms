#!/bin/bash
set -e

# ===============================
# SecureChat Installation Script
# Fixed (Original logic preserved)
# ===============================

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

APP_NAME="securechat"
APP_DIR="/opt/chatrooms"
SERVICE_USER="securechat"
SERVICE_PORT="3000"

NGINX_AVAILABLE="/etc/nginx/sites-available"
NGINX_ENABLED="/etc/nginx/sites-enabled"

echo -e "${BLUE}🚀 SecureChat Installation Script${NC}"
echo -e "${BLUE}===================================${NC}"
echo ""

# -------------------------------
# Root / sudo handling (FIXED)
# -------------------------------
if [[ "$EUID" -eq 0 ]]; then
  SUDO=""
else
  command -v sudo &>/dev/null || {
    echo -e "${RED}❌ sudo is required${NC}"
    exit 1
  }
  SUDO="sudo"
fi

run_as_service_user() {
  if [[ "$EUID" -eq 0 ]]; then
    su -s /bin/bash "$SERVICE_USER" -c "$*"
  else
    sudo -u "$SERVICE_USER" bash -c "$*"
  fi
}

# -------------------------------
# System checks
# -------------------------------
if ! lsb_release -d | grep -qi ubuntu; then
  echo -e "${RED}❌ Ubuntu required${NC}"
  exit 1
fi
echo -e "${GREEN}✅ Ubuntu detected${NC}"

# -------------------------------
# Packages
# -------------------------------
$SUDO apt update
$SUDO apt install -y curl wget gnupg2 software-properties-common nginx ufw git ca-certificates

# -------------------------------
# Node.js 20 LTS (FIXED)
# -------------------------------
if ! command -v node &>/dev/null; then
  echo -e "${YELLOW}📦 Installing Node.js 20 LTS...${NC}"
  if [[ "$EUID" -eq 0 ]]; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  else
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  fi
  $SUDO apt install -y nodejs
fi

echo -e "${GREEN}✅ Node $(node -v) | npm $(npm -v)${NC}"

# -------------------------------
# Project validation (FIXED)
# -------------------------------
if [[ ! -f "./package.json" ]]; then
  echo -e "${RED}❌ package.json not found${NC}"
  echo -e "${YELLOW}Run script from repo root${NC}"
  exit 1
fi

# -------------------------------
# Service user
# -------------------------------
if ! id "$SERVICE_USER" &>/dev/null; then
  $SUDO useradd --system --shell /usr/sbin/nologin --home-dir "$APP_DIR" --create-home "$SERVICE_USER"
fi

# -------------------------------
# Deploy files (FIXED)
# -------------------------------
$SUDO mkdir -p "$APP_DIR"
$SUDO rsync -a --delete --exclude install.sh ./ "$APP_DIR/"
$SUDO chown -R "$SERVICE_USER:$SERVICE_USER" "$APP_DIR"

# -------------------------------
# Install dependencies
# -------------------------------
cd "$APP_DIR"
run_as_service_user "npm install"
run_as_service_user "npm run build"

# -------------------------------
# 🔐 Master Password Configuration (PRESERVED)
# -------------------------------
echo ""
echo -e "${BLUE}🔐 Master Password Configuration${NC}"
echo ""

while true; do
  echo "1) Set master password now"
  echo "2) Use default password (SecureChat2024)"
  echo "3) Configure on first run"
  read -p "Enter your choice (1-3): " choice

  case $choice in
    1)
      while true; do
        read -s -p "Enter master password (min 8 chars): " master_password
        echo ""
        [[ ${#master_password} -ge 8 ]] || { echo "Too short"; continue; }
        read -s -p "Confirm master password: " confirm
        echo ""
        [[ "$master_password" == "$confirm" ]] || { echo "Mismatch"; continue; }
        break
      done

      sed -i "s|const MASTER_PASSWORD = '.*';|const MASTER_PASSWORD = '$master_password';|" \
        "$APP_DIR/src/utils/auth.ts"

      run_as_service_user "npm run build"
      echo -e "${GREEN}✅ Master password configured${NC}"
      break
      ;;
    2)
      echo -e "${GREEN}Using default master password${NC}"
      break
      ;;
    3)
      echo -e "${GREEN}Configure on first run${NC}"
      break
      ;;
    *)
      echo "Invalid choice"
      ;;
  esac
done

# -------------------------------
# systemd service
# -------------------------------
$SUDO tee /etc/systemd/system/$APP_NAME.service >/dev/null <<EOF
[Unit]
Description=SecureChat
After=network.target

[Service]
Type=simple
User=$SERVICE_USER
WorkingDirectory=$APP_DIR
Environment=NODE_ENV=production
Environment=PORT=$SERVICE_PORT
ExecStart=/usr/bin/npm run preview -- --host 127.0.0.1 --port $SERVICE_PORT
Restart=always
RestartSec=5

NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ProtectHome=true
ReadWritePaths=$APP_DIR

[Install]
WantedBy=multi-user.target
EOF

# -------------------------------
# Nginx (FIXED)
# -------------------------------
$SUDO tee $NGINX_AVAILABLE/$APP_NAME >/dev/null <<EOF
server {
  listen 80;
  server_name _;

  gzip on;
  gzip_vary on;
  gzip_min_length 1024;
  gzip_proxied expired no-cache no-store private auth;

  location / {
    proxy_pass http://127.0.0.1:$SERVICE_PORT;
    proxy_http_version 1.1;
    proxy_set_header Upgrade \$http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host \$host;
    add_header Cache-Control "no-store" always;
  }
}
EOF

$SUDO ln -sf $NGINX_AVAILABLE/$APP_NAME $NGINX_ENABLED/$APP_NAME
$SUDO rm -f $NGINX_ENABLED/default
$SUDO nginx -t

# -------------------------------
# Firewall
# -------------------------------
$SUDO ufw --force enable
$SUDO ufw allow 22/tcp
$SUDO ufw allow 80/tcp
$SUDO ufw allow 443/tcp

# -------------------------------
# Start services
# -------------------------------
$SUDO systemctl daemon-reload
$SUDO systemctl enable securechat
$SUDO systemctl restart securechat
$SUDO systemctl enable nginx
$SUDO systemctl restart nginx

echo ""
echo -e "${GREEN}🎉 SecureChat installed successfully${NC}"
echo -e "🌐 http://$(hostname -I | awk '{print $1}')"
