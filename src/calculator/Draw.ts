import { CardGroup } from "./CardGroup"

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
