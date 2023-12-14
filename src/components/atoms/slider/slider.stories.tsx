import type { Meta, StoryObj } from '@storybook/react';

import Slider from '.';

const meta: Meta<typeof Slider> = {
  component: Slider,
  tags: ['autodocs'],
  argTypes: {
    color: {
        options: ["primary", "secondary", "success", "error", "warning", "info"],
        control: { type: "radio" },
      }
  }
};

const marks = [
    {
      value: 0,
      label: '0',
    },
    {
      value: 20,
      label: '20',
    },
    {
      value: 37,
      label: '37',
    },
    {
      value: 100,
      label: '100',
    },
  ];

export default meta;
type Story = StoryObj<typeof Slider>;


export const Primary: Story = {
    args: {
        sliderData: marks,
        color: 'primary'
    },
  }
