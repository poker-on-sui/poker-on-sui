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
    game: {
      noGameLoaded: 'No game loaded',
      loadingGame: 'Loading game status...',
      gameNotFound: 'Game not found or has ended',
      joinGame: 'Join Game',
      hostGame: 'Host Game',
      joinOrCreateGame: 'Join or create a game to see the table status',
      pot: 'Pot:',
      currentBet: 'Current Bet:',
      yourChips: 'Your Chips:',
      waitingFor: 'Waiting for',
      otherPlayer: 'other player',
      yourTurn: 'Your turn -',
      round: 'Round',
      playersJoined: 'players joined',
      startGame: 'Start Game',
      // Player labels
      dealer: 'Dealer',
      smallBlind: 'Small Blind',
      bigBlind: 'Big Blind',
      folded: 'Folded',
      address: 'Address:',
      chips: 'Chips:',
      position: 'Position:',
      currentBetLabel: 'Current Bet:',
      actions: {
        fold: 'Fold',
        check: 'Check',
        call: 'Call',
        bet: 'Bet',
        raise: 'Raise',
        allIn: 'All In',
      },
      status: {
        creating: 'Creating game...',
        joining: 'Joining game...',
        starting: 'Starting game...',
        processing: 'Processing action...',
        preFlop: 'Pre-Flop',
        flop: 'Flop',
        turn: 'Turn',
        river: 'River',
        showdown: 'Showdown',
        finished: 'Game Finished',
        waitingForPlayers: 'Waiting for players to join',
      },
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
      transactionFailed: 'Transaction failed',
      createGameFailed: 'Failed to create game',
      joinGameFailed: 'Failed to join game',
      startGameFailed: 'Failed to start game',
      actionFailed: 'Failed to execute action',
      insufficientFunds: 'Insufficient funds',
      notYourTurn: 'Not your turn',
      invalidAction: 'Invalid action',
      gameInProgress: 'Game is already in progress',
      walletNotConnected: 'Please connect your wallet',
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
