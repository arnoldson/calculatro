import React from "react"
import "../css/cardcount.css"

interface CardCountProps {
  count: number // The number of cards
}

const CardCount: React.FC<CardCountProps> = ({ count }) => {
  return <div className="card-count">x{count}</div>
}

export default CardCount
