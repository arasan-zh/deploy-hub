.PHONY: setup dev test lint deploy

setup:
	npm install
	@test -f .env.local || cp .env.example .env.local

dev:
	npm run dev

test:
	@echo "no tests yet"

lint:
	npm run lint

deploy:
	@echo "deploy via the Coolify dashboard, or push to the connected git repo for auto-deploy"
