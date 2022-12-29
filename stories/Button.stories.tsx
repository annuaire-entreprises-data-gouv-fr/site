import { ComponentStory, ComponentMeta } from '@storybook/react';
import React from 'react';
import Button from '#components-ui/button';

export default {
  title: 'Button',
  component: Button,
  argTypes: {},
} as ComponentMeta<typeof Button>;

const Template: ComponentStory<typeof Button> = (args) => (
  <Button {...args}>Voir plus</Button>
);

export const Primary = Template.bind({});

Primary.args = {
  to: '',
  small: false,
  alt: false,
  target: '_blank',
  nofollow: false,
};
