import type { Meta, StoryObj } from '@storybook/react';

import StatusTag from '.';



const meta: Meta<typeof StatusTag> = {
  component: StatusTag,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof StatusTag>;


export const Primary: Story = {
    args: {
        label:'Spent',
        sx: {padding: '8px 12px',borderRadius: '12px'},
        style: {
            backgroundColor: "#FEF7ED",
            color: "#DD8700"
          }
    },
  };