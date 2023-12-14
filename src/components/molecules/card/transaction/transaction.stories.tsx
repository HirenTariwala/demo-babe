import type { Meta, StoryObj } from "@storybook/react";

import TransactionCard from ".";

const meta: Meta<typeof TransactionCard> = {
  component: TransactionCard,
  tags: ['autodocs'],
  argTypes: {

}
};

export default meta;
type Story = StoryObj<typeof TransactionCard>;

export const Primary: Story = {
  args: {
    transactionData: {
      time: '2021-01-01 12:00:00',
      transactionID: 1,
      amount: 100,
      status: 'Pending'
    }
  },
};
