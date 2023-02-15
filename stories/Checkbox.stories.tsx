import { ComponentStory, ComponentMeta } from '@storybook/react';
import React from 'react';
import { Checkbox } from '../components-ui/checkbox';

export default {
  title: 'Checkbox',
  component: Checkbox,
  argTypes: {},
} as ComponentMeta<typeof Checkbox>;

const Template: ComponentStory<typeof Checkbox> = (args) => (
  <Checkbox {...args} />
);

export const Primary = Template.bind({});

Primary.args = {
  label: 'Rechercher les établissement RGE',
  value: false,
};
