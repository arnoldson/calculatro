import { useState } from "react"
import { test } from "./calculator/test"
import { DrawSelect } from "./components/DrawSelect"

function App() {
  test()
  return (
    <>
      <h1>Calculatro</h1>
      <DrawSelect />
    </>
  )
}

export default App
