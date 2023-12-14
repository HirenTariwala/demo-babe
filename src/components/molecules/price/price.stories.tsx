import type { Meta, StoryObj } from "@storybook/react";

import Price from ".";

const meta: Meta<typeof Price> = {
  component: Price,
  tags: ['autodocs'],
  argTypes: {
size:{
    options: ['small','medium'],
    control: {
      type: 'radio',
    },
  },
}
};

export default meta;
type Story = StoryObj<typeof Price>;

export const Primary: Story = {
  args: {
    priceData: { price: 100, min: 110, max: 250, hr: "1" },
    size: 'small',
  },
};
