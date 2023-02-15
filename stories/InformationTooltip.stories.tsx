import { ComponentStory, ComponentMeta } from '@storybook/react';
import React from 'react';
import InformationTooltip from '../components-ui/information-tooltip';

export default {
  title: 'Information Tooltip',
  component: InformationTooltip,
  argTypes: {
    orientation: {
      options: ['left', 'right', 'center'],
      control: { type: 'select' },
    },
  },
} as ComponentMeta<typeof InformationTooltip>;

const Template: ComponentStory<typeof InformationTooltip> = (args) => (
  <div style={{ marginTop: 128 }}>
    <InformationTooltip {...args}>
      <div>{args.label}</div>
    </InformationTooltip>
  </div>
);

export const Primary = Template.bind({});

Primary.args = {
  label: 'Cette structure est Reconnue Garante de l’Environnement',
  orientation: 'center',
  width: 250,
  inlineBlock: true,
  left: '',
};
