# Project Overview: Texas Hold'em Poker Game on SUI Blockchain

This project is a frontend implementation of a Texas Hold'em poker game that interfaces with
a SUI blockchain smart contract. The game supports 2-10 players in a session.

## Technical Requirements

- React 19+ with TypeScript
- SUI SDK for blockchain interaction
- Responsive design for different screen sizes
- ShadCN UI components for consistent styling
- Tailwind CSS for custom styling

## Code Style

- Use TypeScript for type safety
- Follow React best practices
- Avoid bracket if statement is a single line
- Use import alias "~/" for local imports whenever possible
- In React components, always create a Props interface to define the props for that component, instead of using inline types
- React components should only be used to render UI, all logic should be handled in hooks or utility functions
- Use (and update if needed) lib/dictionaries.ts for all text content
