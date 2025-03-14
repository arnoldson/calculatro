// const BASE_SCORE = Object.freeze({
//   TWO: 2,
//   THREE: 3,
//   FOUR: 4,
//   FIVE: 5,
//   SIX: 6,
//   SEVEN: 7,
//   EIGHT: 8,
//   NINE: 9,
//   TEN: 10,
//   JACK: 10,
//   QUEEN: 10,
//   KING: 10,
//   ACE: 11,
// })

export type PlayingCardPojo = {
  readonly rank: string
  readonly suit: string
}

export class PlayingCard {
  static SUIT = Object.freeze({
    DIAMOND: "DIAMOND",
    HEART: "HEART",
    SPADE: "SPADE",
    CLUB: "CLUB",
  })

  static RANK = Object.freeze({
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

  static fromPojo(pojo: PlayingCardPojo): PlayingCard {
    return new PlayingCard(pojo.rank, pojo.suit)
  }

  static fromPojoCards(pojo: PlayingCardPojo[]): PlayingCard[] {
    const cards: PlayingCard[] = []
    for (const pojoCard of pojo) {
      cards.push(PlayingCard.fromPojo(pojoCard))
    }
    return cards
  }

  static toPojoCards(cards: PlayingCard[]): PlayingCardPojo[] {
    const pojo: PlayingCardPojo[] = []
    for (const card of cards) {
      pojo.push(card.toPojo())
    }
    return pojo
  }

  toPojo(): PlayingCardPojo {
    return {
      rank: this.#rank,
      suit: this.#suit,
    }
  }
}
