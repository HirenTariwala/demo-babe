import type { Meta, StoryObj } from "@storybook/react";

import TransactionAmount from ".";

const meta: Meta<typeof TransactionAmount> = {
  component: TransactionAmount,
  tags: ['autodocs'],
  argTypes: {

}
};

export default meta;
type Story = StoryObj<typeof TransactionAmount>;

export const Primary: Story = {
  args: {
   
  },
};
