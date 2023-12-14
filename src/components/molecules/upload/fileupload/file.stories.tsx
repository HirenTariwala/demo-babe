import type { Meta, StoryObj } from '@storybook/react';

import FileUpload from '.';

const meta: Meta<typeof FileUpload> = {
  component: FileUpload,
  tags: ['autodocs'],
  argTypes: {
  }
};

export default meta;
type Story = StoryObj<typeof FileUpload>;


export const Primary: Story = {
    args: {
    },
  };