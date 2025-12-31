# Minesweeper 💣

A modern, feature-rich Minesweeper game built with React, TypeScript, and Vite. Created as a personal learning project to practice modern web development and Test-Driven Development (TDD).

![React](https://img.shields.io/badge/React-18+-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7+-646CFF?logo=vite&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-Tested-6E9F18?logo=vitest&logoColor=white)

## 🎮 Live Demo

**Play now:** [https://minesweeper-puce-nine.vercel.app](https://minesweeper-puce-nine.vercel.app)

Deployed on Vercel with automatic CI/CD from GitHub.

## ✨ Features

### Core Gameplay
- 🎮 **Classic Minesweeper mechanics**
  - Left-click to reveal cells
  - Right-click to place/remove flags
  - Number cells show adjacent mine count
  - Game over on mine click
- ⏱️ **Timer** - Starts on first click, tracks completion time
- 🚩 **Mine counter** - Shows remaining mines (total mines - flags placed)
- 🎯 **Win condition** - Reveal all non-mine cells to win

### Difficulty Levels
- 🟢 **Beginner**: 9×9 grid, 10 mines
- 🟡 **Intermediate**: 16×16 grid, 40 mines
- 🔴 **Expert**: 16×30 grid, 99 mines

### Records & Achievements
- 📊 **Best time records** - Saved locally for each difficulty
- 🏆 **Records screen** - View and manage your best times
- 💾 **LocalStorage persistence** - Records survive browser restarts

### User Experience
- 🎨 **Modern UI** - Clean design with gradients and smooth animations
- 📱 **Responsive design** - Works on desktop (mobile optimization: future)
- ♿ **Accessible** - Semantic HTML and ARIA labels
- 🖱️ **Hover effects** - Visual feedback on all interactive elements

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm 9+

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd minesweeper

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173/`

## 📜 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run test         # Run tests in watch mode
npm run test:ui      # Open Vitest UI
npm run test:coverage # Generate coverage report
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
```

## 🎮 How to Play

1. **Select difficulty** - Choose from Beginner, Intermediate, or Expert
2. **Click a cell** - Timer starts on your first click
3. **Reveal cells** - Left-click to open cells
   - Numbers show how many mines are adjacent
   - Empty cells have no adjacent mines
4. **Flag mines** - Right-click cells you suspect contain mines
5. **Win** - Reveal all non-mine cells without clicking a mine
6. **View records** - Click "📊 View Records" to see your best times

## 🏗️ Tech Stack

### Core
- **React 18+** - UI library
- **TypeScript 5+** - Type safety
- **Vite 7+** - Build tool and dev server

### Styling
- **CSS Modules** - Scoped component styles
- **CSS Variables** - Design system tokens

### Testing
- **Vitest** - Test runner (Jest-compatible)
- **React Testing Library** - Component testing
- **@vitest/coverage-v8** - Coverage reporting

### Code Quality
- **ESLint** - Linting (with TypeScript & React rules)
- **Prettier** - Code formatting

## 📁 Project Structure

```
minesweeper/
├── src/
│   ├── components/          # React components
│   │   ├── Cell/           # Individual cell component
│   │   ├── GameBoard/      # Main game board
│   │   ├── GameHeader/     # Timer and mine counter
│   │   ├── DifficultySelector/  # Difficulty selection
│   │   └── RecordsScreen/  # Best times display
│   ├── hooks/              # Custom React hooks
│   │   ├── useGame.ts      # Game logic and state
│   │   ├── useTimer.ts     # Timer functionality
│   │   └── useRecords.ts   # Records management
│   ├── utils/              # Utility functions
│   │   ├── gameLogic.ts    # Core game algorithms
│   │   └── storage.ts      # LocalStorage operations
│   ├── types/              # TypeScript type definitions
│   │   └── game.ts         # Game-related types
│   ├── constants/          # Constants and configuration
│   │   └── difficulty.ts   # Difficulty presets
│   ├── styles/             # Global styles
│   │   ├── variables.css   # Design tokens
│   │   └── global.css      # Reset and base styles
│   ├── App.tsx             # Root component
│   └── main.tsx            # Application entry point
├── tests/                  # Test files (co-located with source)
└── public/                 # Static assets
```

## 🧪 Testing

This project follows **Test-Driven Development (TDD)** principles:

- **180 tests** with **97.8% passing rate**
- **Unit tests** for utilities and hooks
- **Component tests** for UI elements
- **Integration tests** for complete workflows

Run tests:
```bash
npm test                # Watch mode
npm run test:coverage   # With coverage report
npm run test:ui        # Visual test runner
```

## 🎨 Design System

The project uses a comprehensive design system with:
- **Color palette** - Primary, secondary, danger, success colors
- **Typography** - System font stack with consistent sizing
- **Spacing** - 4px base unit with consistent scale
- **Shadows** - Multiple elevation levels
- **Transitions** - Smooth animations

See `src/styles/variables.css` for all design tokens.

## 🔮 Future Enhancements

Potential features for future versions:

- ⭕ **Chain reveal** - Auto-reveal adjacent empty cells
- ⭕ **Pause functionality**
- ⭕ **Animations** - Cell reveal effects
- ⭕ **Dark mode**
- ⭕ **Sound effects**
- ⭕ **Custom difficulty** - User-defined grid size and mine count
- ⭕ **Statistics** - Total games played, win rate, etc.
- ⭕ **Online leaderboard** - Compare times with other players

## 📄 License

This is a personal learning project. Feel free to use it for educational purposes.

## 🙏 Acknowledgments

- Classic Minesweeper game by Microsoft
- React and TypeScript communities
- Vitest and Testing Library teams

---

**Developed as a learning project** | React + TypeScript + TDD | 2025
