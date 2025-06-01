export const POKER_PACKAGE_ID_DEVNET = '0xUNKNOWN'
export const POKER_PACKAGE_ID_TESTNET =
  '0xeb756e390420257ce600f3934cf2faa357bd9c5d7f0a782b8236f15989bdb48a'
export const POKER_PACKAGE_ID_MAINNET = '0xUNKNOWN'

/**
 * Maps for player positions around the table and community cards.
 * The positions are in percentage coordinates relative to the table size.
 *
 * Format: [x, y, rotation]
 */
export const PLAYERS_POSITION_MAPS = [
  [59.669, 77.812, 0],
  [39.252, 77.812, 0],
  [21.323, 75.392, 35],
  [14.45, 50.408, 90],
  [21.423, 24.324, 125],
  [77.83, 24.976, 214],
  [84.615, 50.0, -90],
  [77.851, 76.256, 304],
] as const

/**
 * Maps for community card positions on the table.
 * The positions are in percentage coordinates relative to the table size.
 */
export const COMMUNITY_CARDS_POSITION_MAPS = [
  [39.18, 19.757],
  [44.285, 19.757],
  [49.317, 19.757],
  [54.277, 19.757],
  [59.454, 19.757],
] as const

/**
 * Size of the poker table in percentage coordinates.
 * The size is defined as a ratio of the table width and height.
 */
export const CARDS_SIZE = [4.098, 12.614] as const
