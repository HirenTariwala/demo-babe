import type { Meta, StoryObj } from '@storybook/react';

import Wallet from '.';

const meta: Meta<typeof Wallet> = {
  component: Wallet,
  tags: ['autodocs'],
  argTypes: {
  },
};

export default meta;
type Story = StoryObj<typeof Wallet>;

export const Primary: Story = {
  args: {
    amount: 4000,
    tooltipTitle: 'Credit Balance',
    position: 'bottom'
  },
};
