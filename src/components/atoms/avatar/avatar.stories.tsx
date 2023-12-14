import type { Meta, StoryObj } from "@storybook/react";

import Avatar from ".";

const avatarData = [
    { alt: "H", src: "H" },
    { alt: "V", src: "V" },
    { alt: "A", src: "A" },
    { alt: "C", src: "C" },
    { alt: "X", src: "X" },
    { alt: "E", src: "E" },
    { alt: "B", src: "B" },
    { alt: "Z", src: "Z" },
  ];

const meta: Meta<typeof Avatar> = {
  component: Avatar,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Avatar>;

export const Primary: Story = {
  args: {
    avatars: avatarData,
    total: avatarData.length,
    max: 4
  },
};