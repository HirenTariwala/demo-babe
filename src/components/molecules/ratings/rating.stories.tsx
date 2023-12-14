import type { Meta, StoryObj } from '@storybook/react';

import Rating from '.';

const meta: Meta<typeof Rating> = {
  component: Rating,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Rating>;


export const Primary: Story = {
    args: {
      value: 1,
      max: 6,
      ratingData: {
        rating: 4.5,
        count: 100
      }
    },
  };