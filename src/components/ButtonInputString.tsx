interface ButtonInputStringProps {
  value: string
  setValue: (value: string) => void
}

export const ButtonInputString: React.FC<ButtonInputStringProps> = ({
  value,
  setValue,
}) => {
  return <button onClick={() => setValue(value)}>{value}</button>
}
