import type { Meta, StoryObj } from '@storybook/react';

import CheckBox from '.';

const meta: Meta<typeof CheckBox> = {
  component: CheckBox,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof CheckBox>;


export const Primary: Story = {
    args: {
     checked: false,
     label: 'This is a common checkbox',
    },
  };