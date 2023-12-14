import type { Meta, StoryObj } from '@storybook/react';

import OrderCard from '.';

const meta: Meta<typeof OrderCard> = {
  component: OrderCard,
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
type Story = StoryObj<typeof OrderCard>;

export const Primary: Story = {
  args: {
    emeetData:  {
        rating: {
          rating: 4.9,
          count: 100,
        },
      
        priceLabel: { min: 110, max: 250, hr: 1 },
      },
    size: 'small',
    buttonLabel: 'Request an Order',
  },
};
