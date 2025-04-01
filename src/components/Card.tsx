import "../css/card.css"

interface CardProps {
  rank: string
  suit: string
}

function suitColor(suit: string): string {
  switch (suit) {
    case "SPADE":
      return "black"
    case "HEART":
      return "red"
    case "DIAMOND":
      return "red"
    case "CLUB":
      return "black"
    default:
      return ""
  }
}

function suitSymbol(suit: string): string {
  switch (suit) {
    case "SPADE":
      return "♠"
    case "HEART":
      return "♥"
    case "DIAMOND":
      return "♦"
    case "CLUB":
      return "♣"
    default:
      return ""
  }
}

// TODO: Rename to something less ambiguous; Difference between Card and
// PlayingCard is Card may or may not contain a suit and rank
export const Card: React.FC<CardProps> = ({ rank, suit }) => {
  return (
    <div className="card">
      <div className={`corner top-left ${suitColor(suit)}`}>
        {rank} {suitSymbol(suit)}
      </div>
      <div className={`suit ${suitColor(suit)}`}>{suitSymbol(suit)}</div>
      <div className={`corner bottom-right ${suitColor(suit)}`}>
        {rank} {suitSymbol(suit)}
      </div>
    </div>
  )
}
