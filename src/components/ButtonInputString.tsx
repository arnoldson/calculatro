import "../css/button.css"

interface ButtonInputStringProps {
  disabled?: boolean
  value: string
  setValue: (value: string) => void
  selectedValue: string
}

export const ButtonInputString: React.FC<ButtonInputStringProps> = ({
  disabled = false,
  value,
  setValue,
  selectedValue,
}) => {
  return (
    <button
      disabled={disabled}
      className={`${value === selectedValue ? "selected" : ""}`}
      onClick={() => setValue(value)}
    >
      {value}
    </button>
  )
}
