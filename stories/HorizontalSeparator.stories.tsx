import { ComponentStory, ComponentMeta } from '@storybook/react';
import React from 'react';
import { HorizontalSeparator } from '../components-ui/horizontal-separator';

export default {
  title: 'Separator/Horizontal',
  component: HorizontalSeparator,
  argTypes: {},
} as ComponentMeta<typeof HorizontalSeparator>;

const Template: ComponentStory<typeof HorizontalSeparator> = () => (
  <div style={{ marginRight: 128 }}>
    <HorizontalSeparator />
  </div>
);

export const Primary = Template.bind({});

Primary.args = {};
