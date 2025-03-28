import { useEffect, useState } from "react"
import { DrawSelect } from "./components/DrawSelect"
import { DrawSeed } from "./calculator/DrawSeed"
import { Deck } from "./calculator/Deck"
import { Calculator } from "./calculator/Calculator"
import "./styles.css"

function App() {
  const [activeModalId, setActiveModalId] = useState<string>("")
  const [drawSeed, setDrawSeed] = useState<DrawSeed | null>(null)
  const [deck, setDeck] = useState<Deck>(Deck.createStandardDeck())
  // for results
  const [drawProbability, setDrawProbability] = useState<number>(-1)

  function initialize() {
    setDrawSeed(null)
    setDeck(Deck.createStandardDeck())
    setDrawProbability(-1)
  }

  useEffect(() => {
    initialize()
  }, [])

  function formatProbabilityForDisplay(): string {
    return (drawProbability * 100).toFixed(2) + "%"
  }

  function calculateDrawProbability() {
    if (drawSeed != null) {
      setDrawProbability(
        Calculator.calculateDrawSeedProbability(drawSeed, deck)
      )
    } else {
      console.log("Draw seed is null")
    }
  }

  function shouldDisableCalculateButton(): boolean {
    if (drawSeed == null) return true
    return false
  }

  return (
    <>
      <h1>Calculatro</h1>
      {drawProbability > -1 ? (
        <h2>Draw Probability: {formatProbabilityForDisplay()}</h2>
      ) : undefined}
      <button
        disabled={shouldDisableCalculateButton()}
        onClick={calculateDrawProbability}
      >
        Calculate
      </button>
      <DrawSelect
        setDrawSeed={setDrawSeed}
        activeModalId={activeModalId}
        setActiveModalId={setActiveModalId}
      />
    </>
  )
}

export default App
