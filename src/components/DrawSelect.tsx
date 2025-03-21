import { useEffect, useState } from "react"
import { Modal } from "./Modal"
import NumberSlider from "./NumberSlider"
import {
  CardGroup,
  CardGroupPojo,
  CardGroupsPojo,
} from "../calculator/CardGroup"
import { ButtonInputString } from "./ButtonInputString"
import { PlayingCard } from "../calculator/PlayingCard"
import { DrawSeed } from "../calculator/DrawSeed"
import { Card } from "./Card"
import React from "react"
import CardCount from "./CardCount"
const types = Object.values(CardGroup.TYPE)
const ranks = Object.values(PlayingCard.RANK)
const suits = Object.values(PlayingCard.SUIT)

export function DrawSelect({ setDrawSeed }: { setDrawSeed: Function }) {
  const [isFirstModalOpen, setIsFirstModalOpen] = useState(false)
  const [isSecondModalOpen, setIsSecondModalOpen] = useState(false)

  // for current draw
  const [size, setSize] = useState<number>(5)
  const [drawType, setDrawType] = useState<string>("")
  const [groups, setGroups] = useState<CardGroupsPojo>({})
  const [occupiedSize, setOccupiedSize] = useState<number>(0)
  // for current card group
  const [groupSize, setGroupSize] = useState<number>(1)
  const [groupRank, setGroupRank] = useState<string>("")
  const [groupSuit, setGroupSuit] = useState<string>("")

  useEffect(() => {
    initialize()
  }, [])

  useEffect(() => {
    createDrawSeed()
  }, [groups])

  function shouldDisableAddCardGroup(): boolean {
    if (drawType === "" || occupiedSize === size) return true
    return false
  }

  function initialize() {
    resetCardGroup()
    resetDraw()
  }

  function resetDraw() {
    setSize(5)
    setDrawType("")
    setGroups({})
  }

  function resetCardGroup() {
    setGroupSize(1)
    setGroupRank("")
    setGroupSuit("")
  }

  function isValidCardGroup(): boolean {
    if (groupSize < 1) return false
    if (drawType === CardGroup.TYPE.CARD) {
      if (groupRank === "" || groupSuit === "") return false
    } else if (drawType === CardGroup.TYPE.RANK) {
      if (groupRank === "") return false
    } else if (drawType === CardGroup.TYPE.SUIT) {
      if (groupSuit === "") return false
    }
    return true
  }

  function addCardGroup() {
    const cardGroup: CardGroup = new CardGroup(drawType)
      .setSize(groupSize)
      .setRank(groupRank)
      .setSuit(groupSuit)
    const existingCardGroup = groups[cardGroup.countKey()]
    if (existingCardGroup) {
      cardGroup.setSize(existingCardGroup.size + cardGroup.size())
    }
    const cardGroupPojo: CardGroupPojo = cardGroup.toPOJO()

    setGroups((prevGroups) => {
      return { ...prevGroups, [cardGroup.countKey()]: cardGroupPojo }
    })
    setOccupiedSize((prevOccupiedSize) => prevOccupiedSize + cardGroup.size())

    resetCardGroup()
    setIsSecondModalOpen(false)
    setIsFirstModalOpen(true)
  }

  function createDraw() {
    initialize()
    setIsFirstModalOpen(true)
  }

  function createDrawSeed() {
    const seed = new DrawSeed(size).setType(drawType)
    const cardGroups: Map<string, CardGroup> = CardGroup.fromPojoGroups(groups)
    seed.setGroups(cardGroups).setOccupied(occupiedSize)
    setDrawSeed(seed)
  }

  return (
    <>
      <h2>Draw:</h2>
      {Object.values(groups).map((group, index) => {
        return (
          <React.Fragment key={index}>
            <Card rank={group.rank} suit={group.suit} />
            <CardCount count={group.size} />
          </React.Fragment>
        )
      })}
      <button onClick={createDraw}>Create Draw</button>
      {/* Modal 1/2: Select Type and Size of Draw */}
      <Modal
        isOpen={isFirstModalOpen}
        onClose={() => setIsFirstModalOpen(false)}
      >
        <button
          onClick={() => {
            setIsFirstModalOpen(false)
          }}
        >
          Close
        </button>
        <button onClick={() => initialize()}>Reset</button>
        <div>
          <h2>TYPE:</h2>
          {types.map((type) => {
            if (type === CardGroup.TYPE.NEGATIVE) return null
            return (
              <ButtonInputString
                disabled={occupiedSize > 0}
                key={type}
                value={type}
                setValue={setDrawType}
                selectedValue={drawType}
              />
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
      </Modal>
      {/* Modal 2/2: Add Card Group */}
      <Modal
        isOpen={isSecondModalOpen}
        onClose={() => setIsSecondModalOpen(false)}
      >
        {drawType === CardGroup.TYPE.CARD ||
        drawType === CardGroup.TYPE.RANK ? (
          <div>
            <h2>RANK:</h2>
            {ranks.map((rank) => (
              <ButtonInputString
                key={rank}
                value={rank}
                setValue={setGroupRank}
                selectedValue={groupRank}
              />
            ))}
          </div>
        ) : undefined}
        {drawType === CardGroup.TYPE.CARD ||
        drawType === CardGroup.TYPE.SUIT ? (
          <div>
            <h2>SUIT:</h2>
            {suits.map((suit) => (
              <ButtonInputString
                key={suit}
                value={suit}
                setValue={setGroupSuit}
                selectedValue={groupSuit}
              />
            ))}
          </div>
        ) : undefined}
        <div>
          <h2>SIZE:</h2>
          <NumberSlider
            min={1}
            max={size - occupiedSize}
            step={1}
            value={groupSize}
            setValue={setGroupSize}
          />
        </div>
        <button
          onClick={() => {
            if (isValidCardGroup()) {
              addCardGroup()
            } else {
              alert("Invalid Card Group; All fields must be filled out.")
            }
          }}
        >
          ADD
        </button>
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
