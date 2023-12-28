import type { Meta, StoryObj } from '@storybook/react';

import RechargeAmount from '.';

const meta: Meta<typeof RechargeAmount> = {
  component: RechargeAmount,
  tags: ['autodocs'],
  argTypes: {
    size: {
      options: ['small', 'large'],
      control: {
        type: 'radio',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof RechargeAmount>;

export const Primary: Story = {
  args: {
    amount: 384.1,
    fontSize: 14,
    fontWeight: 500,
    color: '#1A1A1A',
    size: 'small',
  },
};
