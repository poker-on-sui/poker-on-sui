// Next.js i18n dictionaries following recommended structure
// This file contains all text content extracted from the project

export const dictionaries = {
  en: {
    // Page metadata
    metadata: {
      title: 'A Poker Game built on 💧',
      description: 'Play poker securely on the SUI blockchain',
    },

    // Header/Navigation
    header: {
      connectWallet: 'Connect Wallet',
      gameRules: 'Game Rules',
    },

    // Main page content
    home: {
      title: 'A Poker Game',
      subtitle: 'All-in-',
    },

    // Game lobby
    lobby: {
      host: 'Host',
      join: 'Join',
      enterGameAddress: 'Enter Game Address',
      pleaseEnterAddress: 'Please enter a game address',
      invalidSuiAddress:
        'Invalid SUI address format. Address must be 64 hex characters prefixed with 0x',
    },

    // Game rules dialog
    rules: {
      title: 'How to Play',
      close: 'Close',
      helpButton: '?',
      instructions: [
        'Host a new game or join an existing one using the game address.',
        'Connect your SUI wallet to participate.',
        'Each player receives two cards. Five community cards are dealt face up.',
        'Betting rounds: Pre-flop, Flop, Turn, River.',
        'Use actions: Check, Call, Raise, Fold, or All-in on your turn.',
        'Best five-card hand wins the pot at showdown.',
        'All game logic and funds are managed securely on the SUI blockchain.',
      ],
      moreDetails: 'For more details, see the full rules in the documentation.',
    },

    // ARIA labels and accessibility
    aria: {
      gameRules: 'Game Rules',
      close: 'Close',
      closeModal: '×',
    },
    errors: {
      missingGameAddress: 'Game address is required',
      invalidGameAddress: 'Invalid game address format',
      gameNotFound: 'Game not found or has ended',
      connectionError: 'Connection error. Please try again later.',
    },
  },
} as const

// Types for type safety
export type Locale = keyof typeof dictionaries
export type Dictionary = typeof dictionaries.en

// Helper function to get dictionary for a locale
export const getDictionary = (locale: Locale = 'en'): Dictionary => {
  return dictionaries[locale] ?? dictionaries.en
}

// Export individual sections for easier imports
export const { en } = dictionaries
