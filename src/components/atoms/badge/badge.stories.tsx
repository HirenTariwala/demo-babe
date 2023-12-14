import type { Meta, StoryObj } from "@storybook/react";

import Badge from ".";

const meta: Meta<typeof Badge> = {
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    color: {
      options: ["primary", "secondary", "success", "error", "warning", "info"],
      control: { type: "radio" },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Primary: Story = {
  args: {
   badgeContent: 5
  },
};
