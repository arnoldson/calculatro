import { Calculator } from "./Calculator"
import { CardGroup } from "./CardGroup"
import { Deck } from "./Deck"
import { DrawSeed } from "./DrawSeed"

import { PlayingCard } from "./PlayingCard"

export function test() {
  const deck = Deck.createStandardDeck()
  const group1 = new CardGroup(CardGroup.TYPE.RANK)
    .setRank(PlayingCard.RANK.ACE)
    .setSize(1)
  const group2 = new CardGroup(CardGroup.TYPE.RANK)
    .setRank(PlayingCard.RANK.EIGHT)
    .setSize(1)
  // console.log("group1: ", group2.toString())

  const seed = new DrawSeed(5)
    .setType(CardGroup.TYPE.RANK)
    .addGroup(group1)
    .addGroup(group2)

  // const draws = seed.generateDraws()
  // console.log("draws:")
  // for (const draw of draws) {
  //   console.log(draw.toString())
  // }
  // console.log(`There are ${draws.length} exact draws.`)
  const probability = Calculator.calculateDrawSeedProbability(seed, deck)
  console.log("Probability: ", probability)
}
