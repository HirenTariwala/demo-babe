import type { Meta, StoryObj } from "@storybook/react";

import Toggle from ".";

const meta: Meta<typeof Toggle> = {
  component: Toggle,
  tags: ['autodocs'],
  argTypes: {
    color: {
      options: ['primary', 'secondary'],
      control: { type: "radio" },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Toggle>;

export const Primary: Story = {
  args: {
    sx: {},
  },
};