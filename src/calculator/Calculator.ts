import { Deck } from "./Deck"
import { Draw } from "./Draw"
import { DrawSeed } from "./DrawSeed"

export class Calculator {
  static #factorialCache = new Map<number, number>()
  static #factorial(n: number): number {
    if (n <= 1) return 1
    if (!Calculator.#factorialCache.has(n)) {
      Calculator.#factorialCache.set(n, n * Calculator.#factorial(n - 1))
    }
    return Calculator.#factorialCache.get(n) ?? -1
  }

  static #nChooseK(n: number, k: number): number {
    return (
      Calculator.#factorial(n) /
      (Calculator.#factorial(k) * Calculator.#factorial(n - k))
    )
  }

  static calculateDrawSeedProbability(seed: DrawSeed, deck: Deck): number {
    const draws: Draw[] = seed.generateDraws()
    let totalProbability = 0
    for (const draw of draws) {
      totalProbability += this.calculateDrawProbability(draw, deck)
    }
    return totalProbability
  }

  static #numWaysToDraw(draw: Draw, deck: Deck): number {
    let numWays = 1
    for (const group of draw.groups()) {
      const numCardsToDraw = group.size()
      const numCardsInDeck = deck.countCardGroup(group)
      if (numCardsInDeck < numCardsToDraw) return 0
      const numWaysToDrawGroup = Calculator.#nChooseK(
        numCardsInDeck,
        numCardsToDraw
      )
      numWays *= numWaysToDrawGroup
    }
    return numWays
  }

  static calculateDrawProbability(draw: Draw, deck: Deck): number {
    const waysToDrawNCards = Calculator.#nChooseK(deck.size(), draw.size())
    return Calculator.#numWaysToDraw(draw, deck) / waysToDrawNCards
  }
}
