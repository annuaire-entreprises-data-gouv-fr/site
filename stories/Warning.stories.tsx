import { ComponentStory, ComponentMeta } from '@storybook/react';
import React from 'react';
import Warning from '#components-ui/alerts/warning';

export default {
  title: 'Alert/Warning',
  component: Warning,
  argTypes: {
    full: {
      controls: { type: 'radio' },
    },
  },
} as ComponentMeta<typeof Warning>;

const Template: ComponentStory<typeof Warning> = (args) => (
  <Warning full={args.full}>
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum perferendis
    expedita doloribus perspiciatis alias aspernatur neque sequi quasi
    <br />
    similique eveniet vel, reiciendis itaque ex minima, dolorem iure quae fuga
    officiis.
  </Warning>
);

export const Primary = Template.bind({});

Primary.args = {
  full: false,
};
