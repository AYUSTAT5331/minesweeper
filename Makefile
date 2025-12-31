.PHONY: help install dev build preview test test-ui test-coverage lint lint-fix format clean deploy deploy-prod git-status git-commit git-push

# Default target
.DEFAULT_GOAL := help

# Colors for output
BLUE := \033[0;34m
GREEN := \033[0;32m
YELLOW := \033[0;33m
RED := \033[0;31m
NC := \033[0m # No Color

##@ General

help: ## Display this help message
	@echo "$(BLUE)Minesweeper - Available Commands$(NC)"
	@echo ""
	@awk 'BEGIN {FS = ":.*##"; printf "Usage:\n  make $(YELLOW)<target>$(NC)\n\nTargets:\n"} /^[a-zA-Z_-]+:.*?##/ { printf "  $(GREEN)%-20s$(NC) %s\n", $$1, $$2 } /^##@/ { printf "\n$(BLUE)%s$(NC)\n", substr($$0, 5) } ' $(MAKEFILE_LIST)

##@ Development

install: ## Install dependencies
	@echo "$(BLUE)Installing dependencies...$(NC)"
	npm install
	@echo "$(GREEN)✓ Dependencies installed$(NC)"

dev: ## Start development server
	@echo "$(BLUE)Starting development server...$(NC)"
	npm run dev

build: ## Build for production
	@echo "$(BLUE)Building for production...$(NC)"
	npm run build
	@echo "$(GREEN)✓ Build complete$(NC)"

preview: ## Preview production build locally
	@echo "$(BLUE)Starting preview server...$(NC)"
	npm run preview

clean: ## Clean build artifacts and dependencies
	@echo "$(RED)Cleaning build artifacts...$(NC)"
	rm -rf dist
	rm -rf coverage
	rm -rf node_modules
	rm -rf .vercel
	@echo "$(GREEN)✓ Clean complete$(NC)"

##@ Testing

test: ## Run tests in watch mode
	@echo "$(BLUE)Running tests...$(NC)"
	npm test

test-ui: ## Open Vitest UI
	@echo "$(BLUE)Opening Vitest UI...$(NC)"
	npm run test:ui

test-coverage: ## Generate test coverage report
	@echo "$(BLUE)Generating coverage report...$(NC)"
	npm run test:coverage
	@echo "$(GREEN)✓ Coverage report generated$(NC)"

##@ Code Quality

lint: ## Run ESLint
	@echo "$(BLUE)Running ESLint...$(NC)"
	npm run lint
	@echo "$(GREEN)✓ Linting complete$(NC)"

lint-fix: ## Run ESLint with auto-fix
	@echo "$(BLUE)Running ESLint with auto-fix...$(NC)"
	npm run lint:fix
	@echo "$(GREEN)✓ Linting complete$(NC)"

format: ## Format code with Prettier
	@echo "$(BLUE)Formatting code...$(NC)"
	npm run format
	@echo "$(GREEN)✓ Formatting complete$(NC)"

check: lint test-coverage ## Run all checks (lint + coverage)
	@echo "$(GREEN)✓ All checks passed$(NC)"

##@ Git Operations

git-status: ## Show git status
	@git status

git-add: ## Stage all changes
	@echo "$(BLUE)Staging changes...$(NC)"
	git add .
	@echo "$(GREEN)✓ Changes staged$(NC)"

git-commit: ## Create a commit (use MSG="your message")
	@if [ -z "$(MSG)" ]; then \
		echo "$(RED)Error: Please provide a commit message$(NC)"; \
		echo "Usage: make git-commit MSG=\"your message\""; \
		exit 1; \
	fi
	@echo "$(BLUE)Creating commit...$(NC)"
	@git commit -m "$(MSG)" -m "🤖 Generated with [Claude Code](https://claude.com/claude-code)" -m "Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
	@echo "$(GREEN)✓ Commit created$(NC)"

git-push: ## Push to remote repository
	@echo "$(BLUE)Pushing to remote...$(NC)"
	git push
	@echo "$(GREEN)✓ Pushed to remote$(NC)"

git-sync: git-add git-commit git-push ## Stage, commit, and push (use MSG="your message")
	@echo "$(GREEN)✓ Git sync complete$(NC)"

##@ Deployment

deploy: build ## Deploy to Vercel (preview)
	@echo "$(BLUE)Deploying to Vercel (preview)...$(NC)"
	vercel
	@echo "$(GREEN)✓ Deployed to preview$(NC)"

deploy-prod: build ## Deploy to Vercel (production)
	@echo "$(BLUE)Deploying to Vercel (production)...$(NC)"
	vercel --prod
	@echo "$(GREEN)✓ Deployed to production$(NC)"

##@ Workflows

setup: install ## Initial setup (install + build)
	@echo "$(BLUE)Running initial setup...$(NC)"
	$(MAKE) build
	@echo "$(GREEN)✓ Setup complete$(NC)"
	@echo ""
	@echo "$(YELLOW)Next steps:$(NC)"
	@echo "  1. Run $(GREEN)make dev$(NC) to start development server"
	@echo "  2. Open http://localhost:5173 in your browser"

ci: lint test-coverage build ## Run CI checks (lint + test + build)
	@echo "$(GREEN)✓ CI checks passed$(NC)"

release: check build git-sync deploy-prod ## Full release workflow
	@echo "$(GREEN)✓ Release complete$(NC)"
	@echo ""
	@echo "$(YELLOW)App deployed to:$(NC)"
	@echo "  https://minesweeper-puce-nine.vercel.app"
