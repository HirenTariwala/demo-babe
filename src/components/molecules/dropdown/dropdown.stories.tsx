import type { Meta, StoryObj } from '@storybook/react';

import Dropdown from '.';

const meta: Meta<typeof Dropdown> = {
  component: Dropdown,
  tags: ['autodocs'],
  argTypes: {
    size: {
        options: ["small", "medium"],
        control: { type: "radio" },
      }
  }
};

export default meta;
type Story = StoryObj<typeof Dropdown>;


export const Primary: Story = {
    args: {
     listData: [],
     labelText: 'Label',
     size:'medium',
     background: false,
    },
  }
