# champion-trader

A React TypeScript trading application built with modern technologies and best practices.

## Technologies

- React 18
- TypeScript
- TailwindCSS for styling
- Zustand for state management
- Axios for API communication
- Jest and React Testing Library for testing

## Getting Started

> **Prerequisites:**
> The following steps require [NodeJS](https://nodejs.org/en/) to be installed on your system, so please
> install it beforehand if you haven't already.

To get started with your project, you'll first need to install the dependencies with:

```bash
npm install
```

Then, you'll be able to run a development version of the project with:

```bash
npm run dev
```

After a few seconds, your project should be accessible at the address
[http://localhost:5173/](http://localhost:5173/)

## Testing

Run all tests with:

```bash
npm test
```

Run tests in watch mode during development:

```bash
npm test -- --watch
```

### Testing Guidelines

- Follow Test-Driven Development (TDD) methodology
- Write tests before implementing functionality
- Maintain at least 90% test coverage
- Mock external dependencies (Axios, Zustand stores)
- Test edge cases explicitly

## Development Guidelines

### Component Design

- Follow Atomic Component Design principles
- Components should be self-contained and independent
- Use TailwindCSS for styling
- Implement lazy loading for components

### State Management

- Use local state for component-specific logic
- Use Zustand for shared/global state
- Avoid prop drilling

### API Integration

- Use Axios for HTTP requests
- Wrap API calls in service layers
- Handle errors gracefully

### Import Paths

Use path aliases for better maintainability:

```typescript
// Instead of
import { TradeButton } from "../../components/TradeButton";

// Use
import { TradeButton } from "@/components/TradeButton";
```

### Version Control

Commit messages should follow the pattern:
```
<type>: concise description

- Detailed bullet points
- Additional context
```

Allowed types:
- feat: New features
- fix: Bug fixes
- refactor: Code changes that neither fix bugs nor add features
- docs: Documentation changes
- test: Test-related changes
- chore: Build process or auxiliary tool changes

## Building for Production

Build the project for release with:

```bash
npm run build
```

This will create an optimized production build in the `dist` directory.
