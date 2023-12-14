import type { Meta, StoryObj } from "@storybook/react";

import Toast from ".";

const meta: Meta<typeof Toast> = {
  component: Toast,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Toast>;

export const Primary: Story = {
  args: {
    open: false,
    alertMessage:'Toast message' 
  },
};
