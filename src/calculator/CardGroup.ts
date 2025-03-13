export type CardGroupPojo = {
  readonly type: string
  readonly rank: string
  readonly suit: string
  readonly size: number
  readonly exclusions: string[]
}

export type CardGroupsPojo = {
  [key: string]: CardGroupPojo
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

  static fromPojo(pojo: CardGroupPojo): CardGroup {
    return new CardGroup(pojo.type)
      .setRank(pojo.rank)
      .setSuit(pojo.suit)
      .setSize(pojo.size)
      .setExclusions(pojo.exclusions)
  }

  static fromPojoGroups(pojo: CardGroupsPojo): Map<string, CardGroup> {
    const res = new Map<string, CardGroup>()
    Object.entries(pojo).forEach(([key, value]) => {
      res.set(key, CardGroup.fromPojo(value))
    })
    return res
  }

  static toPojoGroups(groups: Map<string, CardGroup>): CardGroupsPojo {
    const pojo: CardGroupsPojo = {}
    for (const [key, value] of groups.entries()) {
      pojo[key] = value.toPOJO()
    }
    return pojo
  }

  toPOJO(): CardGroupPojo {
    return {
      type: this.#type,
      rank: this.#rank,
      suit: this.#suit,
      size: this.#size,
      exclusions: this.#exclusions,
    }
  }

  toString(): string {
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
