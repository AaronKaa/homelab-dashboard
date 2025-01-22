#!/usr/bin/env bash

run_compose() {
  if command -v docker compose >/dev/null 2>&1; then
    echo "Using docker compose"
    docker compose up -d
  elif command -v docker-compose >/dev/null 2>&1; then
    echo "Using docker-compose (legacy)"
    docker-compose up -d
  else
    echo "Error: Neither docker compose nor docker-compose found. Please install one of them."
    exit 1
  fi
}

# Give user feedback and run compose
echo "Bringing up containers..."
run_compose
