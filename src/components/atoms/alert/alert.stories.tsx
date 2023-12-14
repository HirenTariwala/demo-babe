import type { Meta, StoryObj } from "@storybook/react";

import Alert from ".";

const meta: Meta<typeof Alert> = {
  component: Alert,
  tags: ['autodocs'],
  argTypes: {
    color: {
      options: ["success", "error", "warning", "info"],
      control: { type: "radio" },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Alert>;

export const Primary: Story = {
  args: {
    severity: "warning",
    children:
      "Lorem ipsum dolor sit amet consectetur. Nisl at ac vitae nunc amet sitnunc. Sagittis cum at facilisis ut eget sem semper. Feugiat quam proin",
    sx: {},
    onClose: () => {},
    color: "error",
    icon: false
  },
};
