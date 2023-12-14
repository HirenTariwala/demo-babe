import type { Meta, StoryObj } from "@storybook/react";

import Typography from ".";

const meta: Meta<typeof Typography> = {
  component: Typography,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      options: [
        "h1",
        "h2",
        "h3",
        "h4",
        "cation",
        "subtitle1",
        "subtitle2",
        "body1",
        "body2",
      ],
      control: { type: "radio" },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Typography>;

export const Primary: Story = {
  args: {
    variant: "subtitle1",
    component: "span",
    children: "hello world",
    sx: {},
    color: "",
  },
};
