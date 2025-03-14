import { useState } from "react"
import { Modal } from "./Modal"
import NumberSlider from "./NumberSlider"
import { CardGroup, CardGroupPojo } from "../calculator/CardGroup"
import { ButtonInputString } from "./ButtonInputString"
import { PlayingCard } from "../calculator/PlayingCard"
import { Deck } from "../calculator/Deck"
import { DrawSeed } from "../calculator/DrawSeed"
import { Calculator } from "../calculator/Calculator"
const types = Object.values(CardGroup.TYPE)
const ranks = Object.values(PlayingCard.RANK)
const suits = Object.values(PlayingCard.SUIT)

export function DrawSelect() {
  const [isFirstModalOpen, setIsFirstModalOpen] = useState(false)
  const [isSecondModalOpen, setIsSecondModalOpen] = useState(false)

  // for current deck
  const [deck, setDeck] = useState<Deck>(Deck.createStandardDeck())
  // for current draw
  const [size, setSize] = useState<number>(5)
  const [type, setType] = useState<string>("")
  const [groups, setGroups] = useState<CardGroupPojo[]>([])
  // for current card group
  const [groupSize, setGroupSize] = useState<number>(1)
  const [rank, setRank] = useState<string>("")
  const [suit, setSuit] = useState<string>("")
  // for results
  const [drawProbability, setDrawProbability] = useState<number>(-1)

  function shouldDisableAddCardGroup(): boolean {
    if (type === "" || groups.length === size) return true
    return false
  }

  function shouldDisableCalculateButton(): boolean {
    if (groups.length < 1) return true
    return false
  }

  function resetDraw() {
    setSize(5)
    setType("")
    setGroups([])
  }

  function resetCardGroup() {
    setGroupSize(1)
    setRank("")
    setSuit("")
  }

  function addCardGroup() {
    const cardGroup: CardGroupPojo = new CardGroup(type)
      .setSize(groupSize)
      .setRank(rank)
      .setSuit(suit)
      .toPOJO()
    setGroups((prevGroups) => {
      return [...prevGroups, cardGroup]
    })
    resetCardGroup()
    setIsSecondModalOpen(false)
    setIsFirstModalOpen(true)
  }

  function formatProbabilityForDisplay(): string {
    return (drawProbability * 100).toFixed(2) + "%"
  }

  function calculateDrawProbability() {
    const seed = new DrawSeed(size).setType(type)
    for (const pojoGroup of groups) {
      seed.addGroup(CardGroup.fromPojo(pojoGroup))
    }
    setDrawProbability(Calculator.calculateDrawSeedProbability(seed, deck))
    resetDraw()
  }

  return (
    <>
      {drawProbability > -1 ? (
        <h2>Draw Probability: {formatProbabilityForDisplay()}</h2>
      ) : undefined}
      <button onClick={() => setIsFirstModalOpen(true)}>Create Draw</button>
      {/* Modal 1/2: Select Type and Size of Draw */}
      <Modal
        isOpen={isFirstModalOpen}
        onClose={() => setIsFirstModalOpen(false)}
      >
        <button onClick={() => setIsFirstModalOpen(false)}>Close</button>
        <div>
          <h2>TYPE:</h2>
          {types.map((type) => {
            if (type === CardGroup.TYPE.NEGATIVE) return null
            return (
              <ButtonInputString key={type} value={type} setValue={setType} />
            )
          })}
        </div>
        <div>
          <h2>SIZE:</h2>
          <NumberSlider
            min={1}
            max={10}
            step={1}
            value={size}
            setValue={setSize}
          />
        </div>

        <button
          disabled={shouldDisableAddCardGroup()}
          onClick={() => {
            setIsFirstModalOpen(false)
            setIsSecondModalOpen(true)
          }}
        >
          Add Cards
        </button>
        <button
          disabled={shouldDisableCalculateButton()}
          onClick={calculateDrawProbability}
        >
          Calculate
        </button>
      </Modal>
      {/* Modal 2/2: Add Card Group */}
      <Modal
        isOpen={isSecondModalOpen}
        onClose={() => setIsSecondModalOpen(false)}
      >
        {type === CardGroup.TYPE.CARD || type === CardGroup.TYPE.RANK ? (
          <div>
            <h2>RANK:</h2>
            {ranks.map((rank) => (
              <ButtonInputString key={rank} value={rank} setValue={setRank} />
            ))}
          </div>
        ) : undefined}
        {type === CardGroup.TYPE.CARD || type === CardGroup.TYPE.SUIT ? (
          <div>
            <h2>SUIT:</h2>
            {suits.map((suit) => (
              <ButtonInputString key={suit} value={suit} setValue={setSuit} />
            ))}
          </div>
        ) : undefined}
        <div>
          <h2>SIZE:</h2>
          <NumberSlider
            min={1}
            max={size}
            step={1}
            value={groupSize}
            setValue={setGroupSize}
          />
        </div>
        <button onClick={addCardGroup}>ADD</button>
        <button
          onClick={() => {
            setIsSecondModalOpen(false)
            setIsFirstModalOpen(true)
          }}
        >
          CANCEL
        </button>
      </Modal>
    </>
  )
}
