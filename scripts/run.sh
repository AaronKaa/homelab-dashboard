#!/usr/bin/env bash
.
compose_cmd () {
  if command -v docker compose >/dev/null 2>&1; then
    docker compose "$@"
  elif command -v docker-compose >/dev/null 2>&1; then
    docker-compose "$@"
  else
    echo "Error: Neither docker compose nor docker-compose found. Please install one of them."
    exit 1
  fi
}

case "$1" in
  up-build)
    echo "Bringing up containers with --build..."
    compose_cmd up --build -d
    ;;
  up)
    echo "Bringing up containers..."
    compose_cmd up -d
    ;;
  down)
    echo "Shutting down containers..."
    compose_cmd down
    ;;
  *)
    echo "Usage: $0 {up|up-build|down}"
    exit 1
    ;;
esac
