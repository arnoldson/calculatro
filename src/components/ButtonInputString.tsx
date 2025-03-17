import "../css/button.css"

interface ButtonInputStringProps {
  value: string
  setValue: (value: string) => void
  selectedValue: string
}

export const ButtonInputString: React.FC<ButtonInputStringProps> = ({
  value,
  setValue,
  selectedValue,
}) => {
  return (
    <button
      className={`${value === selectedValue ? "selected" : ""}`}
      onClick={() => setValue(value)}
    >
      {value}
    </button>
  )
}
