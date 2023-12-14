import type { Meta, StoryObj } from '@storybook/react';

import Header from '.';

const meta: Meta<typeof Header> = {
  component: Header,
  tags: ['autodocs'],
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
};

export default meta;
type Story = StoryObj<typeof Header>;


export const Primary: Story = {
    args: {
    isLogin: true
    },
  }
