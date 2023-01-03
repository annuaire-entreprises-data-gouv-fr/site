import { ComponentStory, ComponentMeta } from '@storybook/react';
import React from 'react';
import { SimpleSeparator } from '#components-ui/horizontal-separator';

export default {
  title: 'Separator/Simple',
  component: SimpleSeparator,
  argTypes: {},
} as ComponentMeta<typeof SimpleSeparator>;

const Template: ComponentStory<typeof SimpleSeparator> = () => (
  <div style={{ marginTop: 128 }}>
    <SimpleSeparator />
  </div>
);

export const Primary = Template.bind({});

Primary.args = {};
