import type { Meta, StoryObj } from '@storybook/react';

import Input from '.';

const meta: Meta<typeof Input> = {
  component: Input,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Input>;


export const Primary: Story = {
    args: {
    type: 'text',
    placeholder: 'Enter the name',
    helperText: 'The verification code is incorrect. Please try again.',
    name: 'name',
    value: '',
    error: false,
    },
  };