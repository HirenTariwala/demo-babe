import { Slider as MuiSlider, SliderProps } from "@mui/material";
import { sliderData } from "./types";

interface ISlider extends SliderProps {
    sliderData: sliderData[];
}

const valuetext = (value: number) => {
  return `${value}°C`;
};


const Slider = ({sliderData, ...props }: ISlider) => {
  return (
    <MuiSlider
      {...props}
      valueLabelFormat={(value)=> sliderData.findIndex((item: sliderData) => item.value === value) + 1}
      getAriaValueText={valuetext}
      step={null}
      marks={sliderData}
    />
  );
};

export default Slider;
