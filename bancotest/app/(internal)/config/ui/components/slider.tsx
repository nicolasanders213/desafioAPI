'use client';

import * as RadixSlider from '@radix-ui/react-slider';

interface SliderProps {
  value: number[];
  onValueChange: (value: number[]) => void;
  min?: number;
  max?: number;
  step?: number;
}

export function Slider({ value, onValueChange, min = 0, max = 100, step = 1 }: SliderProps) {
  return (
    <RadixSlider.Root
      className="relative flex items-center select-none touch-none w-full h-5"
      min={min}
      max={max}
      step={step}
      value={value}
      onValueChange={onValueChange}
    >
      <RadixSlider.Track className="bg-gray-200 relative grow rounded-full h-2">
        <RadixSlider.Range className="absolute bg-green-500 rounded-full h-full" />
      </RadixSlider.Track>
      <RadixSlider.Thumb className="block w-5 h-5 bg-green-600 rounded-full shadow" />
    </RadixSlider.Root>
  );
}