import type { Meta, StoryObj } from '@storybook/react';

import ImageUpload from '.';

const meta: Meta<typeof ImageUpload> = {
  component: ImageUpload,
  tags: ['autodocs'],
  argTypes: {
  }
};

export default meta;
type Story = StoryObj<typeof ImageUpload>;


export const Primary: Story = {
    args: {
    },
  };