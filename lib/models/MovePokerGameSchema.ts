import { z } from 'zod'

// Game states extracted from Move package
export enum PokerGameState {
  WAITING_FOR_PLAYERS = 0,
  PRE_FLOP = 2,
  FLOP = 3,
  TURN = 4,
  RIVER = 5,
  SHOWDOWN = 6,
  GAME_OVER = 7,
}

export const PokerCardSchema = z.object({
  fields: z.object({
    suit: z.coerce.number(),
    value: z.coerce.number(),
  }),
})

export const MovePokerGameSchema = z.object({
  big_blind: z.coerce.number(),
  buy_in: z.coerce.number(),
  community_cards: z.array(PokerCardSchema),
  current_bet: z.coerce.number(),
  current_player: z.coerce.number(),
  dealer_position: z.coerce.number(),
  deck: z.array(PokerCardSchema),
  id: z.object({ id: z.string() }),
  last_raise_position: z.coerce.number(),
  min_bet: z.coerce.number(),
  owner: z.string(),
  players: z.array(
    z.object({
      fields: z.object({
        addr: z.string(),
        balance: z.coerce.number(),
        cards: z.array(PokerCardSchema),
        current_bet: z.coerce.number(),
        is_all_in: z.boolean(),
        is_folded: z.boolean(),
        total_contributed: z.coerce.number(),
      }),
    })
  ),
  pot: z.coerce.number(),
  small_blind: z.coerce.number(),
  state: z.nativeEnum(PokerGameState),
})
export type MovePokerGameSchema = z.infer<typeof MovePokerGameSchema>
export type PokerCardSchema = z.infer<typeof PokerCardSchema>
