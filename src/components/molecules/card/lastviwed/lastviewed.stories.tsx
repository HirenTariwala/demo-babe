import type { Meta, StoryObj } from '@storybook/react';

import LastViewdCard from '.';

const meta: Meta<typeof LastViewdCard> = {
  component: LastViewdCard,
  tags: ['autodocs'],
  argTypes: {
    size: {
      options: ['small', 'large'],
      control: {
        type: 'radio',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof LastViewdCard>;

export const Primary: Story = {
  args: {
    viewedData: {
      name: 'blake',
      profilepic:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      time: 10,
    },
    size: 'small',
  },
};
