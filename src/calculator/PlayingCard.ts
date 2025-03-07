export const SUIT = Object.freeze({
  DIAMOND: "DIAMOND",
  HEART: "HEART",
  SPADE: "SPADE",
  CLUB: "CLUB",
})

const BASE_SCORE = Object.freeze({
  TWO: 2,
  THREE: 3,
  FOUR: 4,
  FIVE: 5,
  SIX: 6,
  SEVEN: 7,
  EIGHT: 8,
  NINE: 9,
  TEN: 10,
  JACK: 10,
  QUEEN: 10,
  KING: 10,
  ACE: 11,
})

export const RANK = Object.freeze({
  TWO: "2",
  THREE: "3",
  FOUR: "4",
  FIVE: "5",
  SIX: "6",
  SEVEN: "7",
  EIGHT: "8",
  NINE: "9",
  TEN: "10",
  JACK: "J",
  QUEEN: "Q",
  KING: "K",
  ACE: "A",
})

export class PlayingCard {
  #rank: string
  #suit: string

  constructor(rank: string, suit: string) {
    this.#rank = rank
    this.#suit = suit
  }

  rank(): string {
    return this.#rank
  }

  suit(): string {
    return this.#suit
  }

  toJSON(): string {
    return JSON.stringify({
      rank: this.#rank,
      suit: this.#suit,
    })
  }

  hash(): string {
    return this.#rank + this.#suit
  }
}
