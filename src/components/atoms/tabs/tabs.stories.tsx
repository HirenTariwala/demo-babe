import type { Meta, StoryObj } from "@storybook/react";

import Tabs from ".";

const meta: Meta<typeof Tabs> = {
  component: Tabs,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Tabs>;

const data = [
    {
      lable: 'table',
      content: 'Content1'
    },
    {
      lable: 'chair',
      content: 'Content2',
    },
    {
      lable: 'sofa',
      content: 'Content3'
    },
    {
      lable: 'light',
      content: 'Content4'
    },
    {
      lable: 'table',
      content: 'Content5'
    },
    {
      lable: 'table',
      content: 'Content6'
    },
    {
      lable: 'table',
      content: 'Content7'
    },
    {
      lable: 'table',
      content: 'Content8'
    },
  ]

export const Primary: Story = {
  args: {
   tabsData: data
  },
};
