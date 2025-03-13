import { useState } from "react"
import { Modal } from "./Modal"
import NumberSlider from "./NumberSlider"

export function DrawSelect() {
  const [drawSeed, setDrawSeed] = useState(null)
  const [isFirstModalOpen, setIsFirstModalOpen] = useState(false)
  const [isSecondModalOpen, setIsSecondModalOpen] = useState(false)

  return (
    <>
      <button onClick={() => setIsFirstModalOpen(true)}>Create Draw</button>
      {/* Modal 1/2: Select Type and Size of Draw */}
      <Modal
        isOpen={isFirstModalOpen}
        onClose={() => setIsFirstModalOpen(false)}
      >
        <button onClick={() => setIsFirstModalOpen(false)}>Close</button>
        <div>
          <h2>TYPE:</h2>
          <button>SUIT</button>
          <button>RANK</button>
          <button>CARD</button>
        </div>
        <div>
          <h2>SIZE:</h2>
          <NumberSlider min={1} max={10} step={1} defaultValue={5} />
        </div>
        <button
          onClick={() => {
            setIsFirstModalOpen(false)
            setIsSecondModalOpen(true)
          }}
        >
          Add Card Group
        </button>
      </Modal>
      {/* Modal 2/2: Add Card Group */}
      <Modal
        isOpen={isSecondModalOpen}
        onClose={() => setIsSecondModalOpen(false)}
      >
        <div>
          <h2>SUIT or RANK</h2>
          <button>BUTTONS GO HERE</button>
        </div>
        <div>
          <h2>SIZE:</h2>
          <NumberSlider min={1} max={10} step={1} defaultValue={5} />
        </div>
        <button>ADD</button>
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
