.PHONY: install up down test

install:
	bash scripts/run.sh up-build

up:
	bash scripts/run.sh up

down:
	bash scripts/run.sh down
