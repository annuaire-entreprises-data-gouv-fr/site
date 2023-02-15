import { ComponentStory, ComponentMeta } from '@storybook/react';
import React from 'react';
import Info from '../components-ui/alerts/info';

export default {
  title: 'Alert/Info',
  component: Info,
  argTypes: {
    full: {
      controls: { type: 'radio' },
    },
  },
} as ComponentMeta<typeof Info>;

const Template: ComponentStory<typeof Info> = (args) => (
  <Info full={args.full}>
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum perferendis
    expedita doloribus perspiciatis alias aspernatur neque sequi quasi
    <br />
    similique eveniet vel, reiciendis itaque ex minima, dolorem iure quae fuga
    officiis.
  </Info>
);

export const Primary = Template.bind({});

Primary.args = {
  full: false,
};
