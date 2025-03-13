import React, { useState } from "react"
import "../css/numberslider.css"

interface SliderProps {
  min?: number
  max?: number
  step?: number
  defaultValue?: number
  onChange?: (value: number) => void
}

const NumberSlider: React.FC<SliderProps> = ({
  min = 0,
  max = 100,
  step = 1,
  defaultValue = 50,
  onChange,
}) => {
  const [value, setValue] = useState<number>(defaultValue)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(event.target.value)
    setValue(newValue)
    if (onChange) onChange(newValue)
  }

  return (
    <div className="slider-container">
      <label className="slider-label">Value: {value}</label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
        className="slider"
      />
    </div>
  )
}

export default NumberSlider
