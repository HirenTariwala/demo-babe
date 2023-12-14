import type { Meta, StoryObj } from "@storybook/react";

import Button from ".";

const meta: Meta<typeof Button> = {
  component: Button,
  argTypes: {
    variant: {
      options: ["outlined", "contained", "text"],
      control: { type: "radio" },
    },
    color: {
      options: ["primary", "secondary", "success", "error", "warning", "info"],
      control: { type: "radio" },
    },
    size: {
      options: ["small", "medium", "large"],
      control: { type: "radio" },
    }
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  tags: ['autodocs'],
  args: {
    variant: "outlined",
    children: "Button",
    sx: {
      textTransform: "none",
      padding: "12px 20px",
      fontSize: "16px",
      fontWeight: 700,
      borderRadius: 50,
    },
    onClick: () => {},
    startIcon: null,
    disabled: true,
    color: "error",
    size:'medium'
  },
};
