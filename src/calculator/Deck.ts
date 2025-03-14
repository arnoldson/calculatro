import { CardGroup } from "./CardGroup"
import { PlayingCard, PlayingCardPojo } from "./PlayingCard"

export type DeckPojo = {
  readonly cards: PlayingCardPojo[]
  readonly counts: {
    [key: string]: number
  }
}

export class Deck {
  #cards: PlayingCard[]
  #counts: Map<string, number>

  constructor(cards: PlayingCard[], counts: Map<string, number>) {
    this.#cards = cards
    this.#counts = counts
  }

  static createEmptyDeck(): Deck {
    const cards: PlayingCard[] = []
    const counts = new Map<string, number>()
    // set default counts
    for (const suit of Object.values(PlayingCard.SUIT)) {
      counts.set(suit, 0)
    }
    for (const rank of Object.values(PlayingCard.RANK)) {
      counts.set(rank, 0)
    }
    for (const suit of Object.values(PlayingCard.SUIT)) {
      for (const rank of Object.values(PlayingCard.RANK)) {
        counts.set(rank + suit, 0)
      }
    }
    return new Deck(cards, counts)
  }

  static createStandardDeck(): Deck {
    const deck = Deck.createEmptyDeck()
    for (const suit of Object.values(PlayingCard.SUIT)) {
      for (const rank of Object.values(PlayingCard.RANK)) {
        deck.addCard(new PlayingCard(rank, suit))
      }
    }
    return deck
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

  static fromPojo(pojo: DeckPojo): Deck {
    const cards: PlayingCard[] = PlayingCard.fromPojoCards(pojo.cards)
    const counts = new Map<string, number>(Object.entries(pojo.counts))
    return new Deck(cards, counts)
  }

  toPojo(): DeckPojo {
    return {
      cards: PlayingCard.toPojoCards(this.#cards),
      counts: Object.fromEntries(this.#counts),
    }
  }

  toJSON(): string {
    return "[" + this.#cards.join(",") + "]"
  }
}
