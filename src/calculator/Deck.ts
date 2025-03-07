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

export class CardGroup {
  static TYPE = Object.freeze({
    SUIT: "SUIT",
    RANK: "RANK",
    CARD: "CARD",
    NEGATIVE: "NEGATIVE",
  })
  #type: string
  #rank: string
  #suit: string
  #size: number

  #exclusions: string[]

  constructor(type: string) {
    this.#type = type
    this.#rank = ""
    this.#suit = ""
    this.#size = 0
    this.#exclusions = []
  }

  type(): string {
    return this.#type
  }

  // returns a string to search deck.counts with
  countKey(): string {
    switch (this.#type) {
      case CardGroup.TYPE.CARD:
        return this.#rank + this.#suit
      case CardGroup.TYPE.RANK:
        return this.#rank
      case CardGroup.TYPE.SUIT:
        return this.#suit
      default:
        throw Error("No countkey for current type.")
    }
  }

  addExclusion(exclusion: string): CardGroup {
    this.#exclusions.push(exclusion)
    return this
  }

  setExclusions(exclusions: string[]): CardGroup {
    this.#exclusions = exclusions
    return this
  }

  exclusions(): string[] {
    return this.#exclusions
  }

  setRank(rank: string): CardGroup {
    this.#rank = rank
    return this
  }

  rank() {
    return this.#rank
  }

  setSuit(suit: string) {
    this.#suit = suit
    return this
  }

  suit() {
    return this.#suit
  }

  setSize(size: number) {
    this.#size = size
    return this
  }

  size() {
    return this.#size
  }

  incrementSize() {
    this.#size++
    return this
  }

  incrementSizeBy(n: number) {
    this.#size += n
    return this
  }

  toPOJO() {
    return {
      type: this.#type,
      rank: this.#rank,
      suit: this.#suit,
      size: this.#size,
    }
  }

  toString() {
    return JSON.stringify(this.toPOJO())
  }

  clone(): CardGroup {
    return new CardGroup(this.#type)
      .setExclusions(this.#exclusions)
      .setRank(this.#rank)
      .setSize(this.#size)
      .setSuit(this.#suit)
  }
}

export class DrawSeed {
  static UNITIALIZED_TYPE = ""
  #size: number
  #type: string
  #groups: Map<string, CardGroup>
  #occupied: number

  constructor(size: number) {
    this.#size = size
    this.#type = ""
    this.#groups = new Map<string, CardGroup>()
    this.#occupied = 0
  }

  isComplete() {
    return this.#occupied === this.#size
  }

  setType(type: string): DrawSeed {
    this.#type = type
    return this
  }

  setGroups(cardGroups: Map<string, CardGroup>): DrawSeed {
    this.#groups = cardGroups
    return this
  }

  setOccupied(occupied: number): DrawSeed {
    this.#occupied = occupied
    return this
  }

  addGroup(cardGroup: CardGroup): DrawSeed {
    if (
      this.#type === DrawSeed.UNITIALIZED_TYPE &&
      cardGroup.type() !== CardGroup.TYPE.NEGATIVE
    ) {
      this.#type = cardGroup.type()
    }
    if (
      cardGroup.type() !== CardGroup.TYPE.NEGATIVE &&
      this.#type !== cardGroup.type()
    ) {
      throw Error("CANNOT accept cardGroup of different types.")
    }
    if (cardGroup.size() + this.#occupied > this.#size) {
      throw Error("CANNOT exceed draw size.")
    }
    this.#occupied += cardGroup.size()
    if (cardGroup.type() === CardGroup.TYPE.NEGATIVE) {
      this.#groups.set(CardGroup.TYPE.NEGATIVE, cardGroup)
    } else {
      this.#groups.set(cardGroup.countKey(), cardGroup)
    }
    return this
  }

  #cloneGroups(): Map<string, CardGroup> {
    const copy = new Map<string, CardGroup>()
    for (const [key, value] of this.#groups.entries()) {
      copy.set(key, value.clone())
    }
    return copy
  }

  incrementGroup(key: string, n: number) {
    if (!this.#groups.has(key)) throw Error(`Group with ${key} does not exist.`)
    if (this.isComplete()) throw Error("Seed is already full/complete.")
    if (n > this.freeSpace())
      throw Error("Not enough space to increment group.")
    this.#groups.get(key)?.incrementSizeBy(n)
    this.#occupied += n
    return this
  }

  clone(): DrawSeed {
    return new DrawSeed(this.#size)
      .setType(this.#type)
      .setGroups(this.#cloneGroups())
      .setOccupied(this.#occupied)
  }

  #createNegativeGroup() {
    const negative = new CardGroup(CardGroup.TYPE.NEGATIVE)
    for (const key of this.#groups.keys()) {
      negative.addExclusion(key)
    }
    this.addGroup(negative)
  }

  createDraw(): Draw {
    return new Draw(this.#size, this.#type, this.#groups)
  }

  freeSpace(): number {
    return this.#size - this.#occupied
  }

  generateDraws(): Draw[] {
    // create last CardGroup as a negative
    // which is a "negative" of the existing groups
    // i.e., a card group of cards excluding
    // card types in the existing groups
    this.#createNegativeGroup()
    let seeds: DrawSeed[] = [this]
    const draws: Draw[] = []
    for (const key of this.#groups.keys()) {
      if (key === CardGroup.TYPE.NEGATIVE) continue
      const nextSeeds: DrawSeed[] = []
      while (seeds.length > 0) {
        const seed = seeds.pop()
        if (seed == null) continue
        if (seed.isComplete()) {
          draws.push(seed.createDraw())
          continue
        }
        nextSeeds.push(seed)
        for (let i = 1; i <= seed.freeSpace(); i++) {
          nextSeeds.push(seed.clone().incrementGroup(key, i))
        }
      }
      seeds = nextSeeds
    }
    // fill any remaining seeds with negative card group
    while (seeds.length > 0) {
      const seed = seeds.pop()
      if (seed == null) continue
      if (!seed.isComplete()) {
        seed.incrementGroup(CardGroup.TYPE.NEGATIVE, seed.freeSpace())
      }
      draws.push(seed.createDraw())
    }
    return draws
  }
}

export class Draw {
  #size: number
  #type: string
  #groups: Map<string, CardGroup>

  constructor(size: number, type: string, groups: Map<string, CardGroup>) {
    this.#size = size
    this.#type = type
    this.#groups = groups
  }

  size(): number {
    return this.#size
  }

  groups(): MapIterator<CardGroup> {
    return this.#groups.values()
  }

  #groupsAsPOJO() {
    const pojo: PojoWithUnknownKeys = {}
    for (const [key, group] of this.#groups.entries()) {
      pojo[key] = group.toPOJO()
    }
    return pojo
  }

  toPOJO() {
    return {
      size: this.#size,
      type: this.#type,
      groups: this.#groupsAsPOJO(),
    }
  }

  toString() {
    return JSON.stringify(this.toPOJO())
  }
}

type PojoWithUnknownKeys = {
  [key: string]: any
}
