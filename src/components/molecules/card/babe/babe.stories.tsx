import type { Meta, StoryObj } from "@storybook/react";

import BabeCard from ".";
import { avatarData } from "@/common/utils/data";

const meta: Meta<typeof BabeCard> = {
  component: BabeCard,
  tags: ['autodocs'],
  argTypes: {
size:{
    options: ['small','medium'],
    control: {
      type: 'radio',
    },
  },
}
};

export default meta;
type Story = StoryObj<typeof BabeCard>;

export const Primary: Story = {
  args: {
   babeData : {
    name: 'Zynx',
    status: true,
    verfied: true,
    social: 'https://instagram.com/',
    profilePic:
      'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?cs=srgb&dl=pexels-pixabay-220453.jpg&fm=jpg',
    activity: avatarData,
    voiceTag: '',
    rating: {
      rating: 4.9,
      count: 100,
    },
    priceLabel: { min: 110, max: 250, hr: 1 },
  }
  },
};
