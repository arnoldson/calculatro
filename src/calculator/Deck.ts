import { CardGroup } from "./CardGroup"
import { PlayingCard, RANK, SUIT } from "./PlayingCard"

export class Deck {
  #cards: PlayingCard[]
  #counts: Map<string, number>

  constructor() {
    this.#cards = []
    this.#counts = new Map<string, number>()
    // set default counts
    for (const suit of Object.values(SUIT)) {
      this.#counts.set(suit, 0)
    }
    for (const rank of Object.values(RANK)) {
      this.#counts.set(rank, 0)
    }
    for (const suit of Object.values(SUIT)) {
      for (const rank of Object.values(RANK)) {
        this.#counts.set(rank + suit, 0)
      }
    }
  }

  addCard(card: PlayingCard): Deck {
    this.#cards.push(card)
    // add to counts
    this.#counts.set(card.suit(), (this.#counts.get(card.suit()) ?? 0) + 1)
    this.#counts.set(card.rank(), (this.#counts.get(card.rank()) ?? 0) + 1)
    this.#counts.set(
      card.rank() + card.suit(),
      (this.#counts.get(card.rank() + card.suit()) ?? 0) + 1
    )
    return this
  }

  addCards(cards: PlayingCard[]): Deck {
    for (const card of cards) {
      this.addCard(card)
    }
    return this
  }

  countCard(card: PlayingCard): number {
    return this.#countCard(card.rank(), card.suit())
  }

  #countCard(rank: string, suit: string) {
    return this.#counts.get(rank + suit) ?? 0
  }

  countRank(rank: string): number {
    return this.#counts.get(rank) ?? 0
  }

  countSuit(suit: string): number {
    return this.#counts.get(suit) ?? 0
  }

  size(): number {
    return this.#cards.length
  }

  countCardGroup(group: CardGroup) {
    switch (group.type()) {
      case CardGroup.TYPE.CARD:
        return this.#countCard(group.rank(), group.suit())
      case CardGroup.TYPE.RANK:
        return this.countRank(group.rank())
      case CardGroup.TYPE.SUIT:
        return this.countSuit(group.suit())
      case CardGroup.TYPE.NEGATIVE:
        let count = this.size()
        for (const exclusion of group.exclusions()) {
          count -= this.#counts.get(exclusion) ?? 0
        }
        return count
      default:
        throw Error(`Invalid CardGroup. TYPE ${group.type()} does not exist.`)
    }
  }

  static createStandardDeck(): Deck {
    const deck = new Deck()
    for (const suit of Object.values(SUIT)) {
      for (const rank of Object.values(RANK)) {
        deck.addCard(new PlayingCard(rank, suit))
      }
    }
    return deck
  }

  toJSON(): string {
    return "[" + this.#cards.join(",") + "]"
  }
}
