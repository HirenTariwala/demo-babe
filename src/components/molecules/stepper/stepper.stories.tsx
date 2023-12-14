import type { Meta, StoryObj } from '@storybook/react';

import Stepper from '.';

const meta: Meta<typeof Stepper> = {
  component: Stepper,
  tags: ['autodocs'],
  argTypes: {
    size:{
        options: ['small', 'large'],
        control: { type: 'radio' }
    }
  }
};

export default meta;
type Story = StoryObj<typeof Stepper>;


export const Primary: Story = {
    args: {
    size: 'small',
    text: 'minimum units'
    },
  };