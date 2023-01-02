import { ComponentStory, ComponentMeta } from '@storybook/react';
import React from 'react';
import Breadcrumb from '#components-ui/breadcrumb';

export default {
  title: 'Breacrumb',
  component: Breadcrumb,
  argTypes: {},
} as ComponentMeta<typeof Breadcrumb>;

const Template: ComponentStory<typeof Breadcrumb> = () => (
  <Breadcrumb
    links={[
      { href: '/a', label: 'Entité' },
      { href: '/b', label: 'question' },
      { href: '/c', label: 'demande' },
    ]}
  />
);

export const Primary = Template.bind({});

Primary.args = {};
