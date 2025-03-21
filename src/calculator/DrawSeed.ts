import { CardGroup, CardGroupsPojo } from "./CardGroup"
import { Draw } from "./Draw"

export type DrawSeedPojo = {
  readonly size: number
  readonly type: string
  readonly groups: CardGroupsPojo
  readonly occupied: number
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
    } else if (this.#groups.has(cardGroup.countKey())) {
      this.#groups.get(cardGroup.countKey())?.incrementSizeBy(cardGroup.size())
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

  static fromPojo(pojo: DrawSeedPojo): DrawSeed {
    return new DrawSeed(pojo.size)
      .setType(pojo.type)
      .setGroups(CardGroup.fromPojoGroups(pojo.groups))
      .setOccupied(pojo.occupied)
  }

  toPojo(): DrawSeedPojo {
    return {
      size: this.#size,
      type: this.#type,
      groups: CardGroup.toPojoGroups(this.#groups),
      occupied: this.#occupied,
    }
  }

  toString(): string {
    return JSON.stringify(this.toPojo())
  }
}
