import type { Meta, StoryObj } from '@storybook/react';

import { Led } from '../utils/led';

const meta = {
  title: 'RHYTHM/Led',
  component: Led,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    on: { control: 'boolean' },
  },
} satisfies Meta<typeof Led>;

export default meta;
type Story = StoryObj<typeof meta>;

export const On: Story = {
  args: {
    on: true,
  },
};

export const Off: Story = {
  args: {
    on: false,
  },
};
