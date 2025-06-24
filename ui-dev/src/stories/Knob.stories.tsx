import type { Meta, StoryObj } from '@storybook/react';

import Knob from '../../plugin/Source/UI/common/Knob';

const meta = {
  title: 'RHYTHM/Knob',
  component: Knob,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    value: { control: 'number', min: 0, max: 1, step: 0.01 },
    label: { control: 'text' },
  },
} satisfies Meta<typeof Knob>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: 0.5,
    onChange: () => {},
    label: 'Volume',
  },
};
