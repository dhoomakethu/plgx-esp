#!/bin/bash
set -e
OS=$(echo `uname`|tr '[:upper:]' '[:lower:]')
if [[ "$OS" == "darwin" ]]; then
    APP_PORT=5002
    if which gsed > /dev/null; then
        SED="gsed"
    else
        echo "gsed not installed. Install gsed with 'brew install gsed'"
        exit 1
    fi

else
    APP_PORT=5000
    SED="sed"
fi
cp .env .env.dev
$SED -i 's/APP_PORT=5000/APP_PORT=5002/g' .env.dev
docker-compose -p "plgx-esp" --env-file ./.env.dev up -d
echo
echo "plgx-esp-ui: https://localhost:$APP_PORT"
