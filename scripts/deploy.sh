#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

REQUIRED_VARS=(
  NODE_ENV PORT
  COMPOSE_PROJECT_NAME APP_EXTERNAL_PORT DOCKER_BUILD_TARGET
  VITE_API_BASE_URL
)

for var in "${REQUIRED_VARS[@]}"; do
  if [ -z "${!var:-}" ]; then
    echo "Missing required environment variable: $var"
    exit 1
  fi
done

if [ "$NODE_ENV" != "production" ]; then
  echo "NODE_ENV must be production (got: $NODE_ENV)"
  exit 1
fi

if [ "$DOCKER_BUILD_TARGET" != "production" ]; then
  echo "DOCKER_BUILD_TARGET must be production (got: $DOCKER_BUILD_TARGET)"
  exit 1
fi

if ! command -v envsubst >/dev/null 2>&1; then
  echo "envsubst is required but not installed"
  exit 1
fi

if ! command -v docker >/dev/null 2>&1; then
  echo "docker is required but not installed"
  exit 1
fi

ENVSUBST_VARS='$NODE_ENV $PORT $COMPOSE_PROJECT_NAME $APP_EXTERNAL_PORT $DOCKER_BUILD_TARGET $VITE_API_BASE_URL'

envsubst "$ENVSUBST_VARS" < scripts/deploy.env.template > .env.production

export VITE_API_BASE_URL

NODE_ENV=production DOCKER_BUILD_TARGET=production \
  docker compose -f docker-compose.yml -f docker-compose.prod.yml \
    --env-file .env.production up -d --build --remove-orphans

echo "Waiting for health check..."
for _ in $(seq 1 30); do
  if curl -fsS "http://localhost:${APP_EXTERNAL_PORT}/health" >/dev/null; then
    echo "Health check passed"
    exit 0
  fi
  sleep 2
done

echo "Health check failed"
exit 1
