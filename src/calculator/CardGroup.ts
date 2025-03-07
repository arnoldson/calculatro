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
