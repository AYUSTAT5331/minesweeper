# Makefile Usage Guide

This project includes a Makefile to simplify common development tasks. The Makefile provides easy-to-remember commands for building, testing, deploying, and managing the project.

## 📋 Quick Reference

```bash
make help          # Show all available commands
make setup         # Initial project setup
make dev           # Start development server
make test          # Run tests
make build         # Build for production
make deploy-prod   # Deploy to production
```

## 🎯 All Available Commands

### General

| Command | Description |
|---------|-------------|
| `make help` | Display all available commands with descriptions |

### Development

| Command | Description |
|---------|-------------|
| `make install` | Install npm dependencies |
| `make dev` | Start development server (http://localhost:5173) |
| `make build` | Build for production |
| `make preview` | Preview production build locally |
| `make clean` | Remove build artifacts and dependencies |

### Testing

| Command | Description |
|---------|-------------|
| `make test` | Run tests in watch mode |
| `make test-ui` | Open Vitest UI for interactive testing |
| `make test-coverage` | Generate and display test coverage report |

### Code Quality

| Command | Description |
|---------|-------------|
| `make lint` | Run ESLint to check code quality |
| `make lint-fix` | Run ESLint and automatically fix issues |
| `make format` | Format code with Prettier |
| `make check` | Run both lint and coverage checks |

### Git Operations

| Command | Description | Example |
|---------|-------------|---------|
| `make git-status` | Show git status | `make git-status` |
| `make git-add` | Stage all changes | `make git-add` |
| `make git-commit MSG="..."` | Create a commit with message | `make git-commit MSG="Add feature"` |
| `make git-push` | Push to remote repository | `make git-push` |
| `make git-sync MSG="..."` | Stage, commit, and push | `make git-sync MSG="Update styles"` |

### Deployment

| Command | Description |
|---------|-------------|
| `make deploy` | Deploy to Vercel (preview environment) |
| `make deploy-prod` | Deploy to Vercel (production) |

### Workflows (Combined Commands)

| Command | Description |
|---------|-------------|
| `make setup` | Initial setup: install dependencies + build |
| `make ci` | CI checks: lint + test + build |
| `make release` | Full release: check + build + sync + deploy |

## 📖 Detailed Usage

### Initial Setup

When you first clone the repository:

```bash
make setup
```

This will:
1. Install all npm dependencies
2. Build the project
3. Display next steps

### Development Workflow

Start the development server:

```bash
make dev
```

The app will be available at http://localhost:5173

### Testing

Run tests in watch mode (automatically reruns on file changes):

```bash
make test
```

Open the interactive test UI:

```bash
make test-ui
```

Generate coverage report:

```bash
make test-coverage
```

### Code Quality

Check code quality:

```bash
make lint
```

Auto-fix linting issues:

```bash
make lint-fix
```

Format all code:

```bash
make format
```

Run all quality checks:

```bash
make check
```

### Git Workflow

#### Basic Git Operations

Check status:
```bash
make git-status
```

Stage changes:
```bash
make git-add
```

Commit with message:
```bash
make git-commit MSG="Add new feature"
```

Push to remote:
```bash
make git-push
```

#### Quick Sync

Stage, commit, and push in one command:
```bash
make git-sync MSG="Update documentation"
```

This is equivalent to:
```bash
git add .
git commit -m "Update documentation"
git push
```

**Note:** All commits automatically include the Claude Code attribution footer.

### Deployment

Deploy to preview environment:
```bash
make deploy
```

Deploy to production:
```bash
make deploy-prod
```

### Complete Release Workflow

For a complete release (checks + deploy):
```bash
make release
```

This will:
1. Run linting checks
2. Generate test coverage
3. Build the project
4. Sync with Git (commit and push)
5. Deploy to production

**Note:** You'll need to provide a commit message when prompted.

## 🔧 Advanced Usage

### Chaining Commands

You can run multiple commands sequentially:

```bash
make clean install build
```

### Custom Git Messages

When using git commands, always provide descriptive messages:

```bash
# Good
make git-commit MSG="Add timer functionality to game header"
make git-sync MSG="Fix bug in mine placement algorithm"

# Bad
make git-commit MSG="update"
make git-sync MSG="fix"
```

### CI/CD Integration

The `make ci` command is perfect for CI/CD pipelines:

```yaml
# Example GitHub Actions workflow
- name: Run CI checks
  run: make ci
```

## 🎨 Color-Coded Output

The Makefile uses color-coded output for better readability:

- 🔵 **Blue**: Information messages
- 🟢 **Green**: Success messages
- 🟡 **Yellow**: Warnings or next steps
- 🔴 **Red**: Errors

## 🚨 Troubleshooting

### "make: command not found"

If you see this error, you need to install `make`:

**macOS:**
```bash
xcode-select --install
```

**Ubuntu/Debian:**
```bash
sudo apt-get install build-essential
```

**Windows:**
- Use WSL (Windows Subsystem for Linux)
- Or install via Chocolatey: `choco install make`

### "Permission denied"

If you get permission errors:

```bash
chmod +x Makefile
```

### Git commit fails

Make sure you provide a commit message:

```bash
# Wrong
make git-commit

# Correct
make git-commit MSG="Your message here"
```

## 💡 Tips & Best Practices

### 1. Use `make help` Frequently

Forgot a command? Just run:
```bash
make help
```

### 2. Start with `make setup`

On a new machine or fresh clone:
```bash
make setup
make dev
```

### 3. Run Checks Before Committing

Before creating a pull request:
```bash
make check
```

### 4. Use Workflows for Common Tasks

Instead of remembering multiple commands, use workflows:
```bash
# Development workflow
make dev

# Release workflow
make release
```

### 5. Clean When Switching Branches

If you encounter issues after switching branches:
```bash
make clean
make setup
```

## 📚 Comparison with npm Scripts

| npm command | make command | Notes |
|-------------|--------------|-------|
| `npm install` | `make install` | Shorter |
| `npm run dev` | `make dev` | Shorter |
| `npm run build` | `make build` | Shorter |
| `npm test` | `make test` | Shorter |
| `npm run lint` | `make lint` | Shorter |
| N/A | `make setup` | Combined workflow |
| N/A | `make ci` | Combined workflow |
| N/A | `make release` | Combined workflow |
| N/A | `make git-sync MSG="..."` | Git convenience |

## 🔗 Integration with Other Tools

### Pre-commit Hooks

You can use Makefile commands in Git hooks:

```bash
# .git/hooks/pre-commit
#!/bin/sh
make lint
```

### VS Code Tasks

Add to `.vscode/tasks.json`:

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Dev Server",
      "type": "shell",
      "command": "make dev"
    },
    {
      "label": "Run Tests",
      "type": "shell",
      "command": "make test"
    }
  ]
}
```

## 📖 Learning Resources

- [GNU Make Documentation](https://www.gnu.org/software/make/manual/)
- [Makefile Tutorial](https://makefiletutorial.com/)
- [Make Cheat Sheet](https://devhints.io/makefile)

## 🤝 Contributing

When adding new commands to the Makefile:

1. Add a descriptive comment with `##`
2. Use color-coded output
3. Group related commands under `##@` sections
4. Update this documentation
5. Test the command thoroughly

Example:

```makefile
##@ New Category

new-command: ## Description of what this does
	@echo "$(BLUE)Running new command...$(NC)"
	# command logic here
	@echo "$(GREEN)✓ Complete$(NC)"
```

---

**Need help?** Run `make help` or open an issue on GitHub.
