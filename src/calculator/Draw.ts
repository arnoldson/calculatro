import { CardGroup, CardGroupsPojo } from "./CardGroup"

export type DrawPojo = {
  readonly size: number
  readonly type: string
  readonly groups: CardGroupsPojo
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

  static fromPojo(pojo: DrawPojo): Draw {
    return new Draw(pojo.size, pojo.type, CardGroup.fromPojoGroups(pojo.groups))
  }

  toPOJO(): DrawPojo {
    return {
      size: this.#size,
      type: this.#type,
      groups: CardGroup.toPojoGroups(this.#groups),
    }
  }

  toString() {
    return JSON.stringify(this.toPOJO())
  }
}
