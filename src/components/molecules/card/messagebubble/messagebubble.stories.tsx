import type { Meta, StoryObj } from '@storybook/react';

import MessageBubble from '.';

const meta: Meta<typeof MessageBubble> = {
  component: MessageBubble,
  tags: ['autodocs'],
  argTypes: {
  },
};

export default meta;
type Story = StoryObj<typeof MessageBubble>;

export const Primary: Story = {
  args: {
   messageData: { status: 'completed', data: '', time: '', price: '' },
   services: 'E-meet',
   rate: '450/10min',
  },
};
