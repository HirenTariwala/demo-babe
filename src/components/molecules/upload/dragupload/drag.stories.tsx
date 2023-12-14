import type { Meta, StoryObj } from '@storybook/react';

import DragUpload from '.';

const meta: Meta<typeof DragUpload> = {
  component: DragUpload,
  tags: ['autodocs'],
  argTypes: {
  }
};

export default meta;
type Story = StoryObj<typeof DragUpload>;


export const Primary: Story = {
    args: {
    },
  };