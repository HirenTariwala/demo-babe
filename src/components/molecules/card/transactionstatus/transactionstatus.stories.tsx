import type { Meta, StoryObj } from "@storybook/react";

import TransactionStatusCard from ".";
import { transactionStatusInfo } from "@/common/utils/data";

const meta: Meta<typeof TransactionStatusCard> = {
  component: TransactionStatusCard,
  tags: ['autodocs'],
  argTypes: {
}
};

export default meta;
type Story = StoryObj<typeof TransactionStatusCard>;

export const Primary: Story = {
  args: {
   transactionStatusData: transactionStatusInfo,
  },
};
