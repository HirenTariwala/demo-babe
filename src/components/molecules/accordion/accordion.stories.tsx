import type { Meta, StoryObj } from "@storybook/react";

import Accordion from ".";

const meta: Meta<typeof Accordion> = {
  component: Accordion,
  tags: ['autodocs'],
  argTypes: {
  },
};

export default meta;
type Story = StoryObj<typeof Accordion>;

export const Primary: Story = {
  args: {
   accordionData : {
    label: 'Lorem ipsum dolor met 23ndfvsn?',
    summary: 'SummaryLorem ipsum dolor sit amet consectetur. Nisi sit adipiscing morbi eget a velit faucibus. Turpis maecenas facilisis blandit et lectus urna ut. Senectus rhoncus egestas duis integer quis quis pellentesque pulvinar. Volutpat viverra tempor commodo ante laoreet aliquam elit convallis urna. Luctus dui sed blandit porttitor. Elementum auctor orci ac tempor quisque neque mauris faucibus semper. Porttitor id ac fusce pretium.',
  },
   disableGutters: true,
   square: true,
  },
};
