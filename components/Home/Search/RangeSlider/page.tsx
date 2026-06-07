import { Slider } from "@/components/ui/slider";
import { RangeSliderProps } from "@/lib/types";

export default function RangeSlider({
  priceRange,
  setPriceRange,
}: RangeSliderProps) {
  return (
    <div className="mt-6 pt-6 border-t border-gray-100 animate-in slide-in-from-top-3">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <label className="font-semibold text-gray-700">Price Range ($)</label>
          <span className="text-sm text-gray-500">
            ${priceRange[0]} - ${priceRange[1]}
          </span>
        </div>

        <Slider
          min={0}
          max={1000}
          step={10}
          value={priceRange}
          onValueChange={setPriceRange}
          className="py-4"
        />

        <div className="flex justify-between text-sm text-gray-500">
          <span>Free</span>
          <span>$500</span>
          <span>$1000+</span>
        </div>
      </div>
    </div>
  );
}
