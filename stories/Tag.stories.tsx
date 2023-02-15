import { ComponentStory, ComponentMeta } from '@storybook/react';
import React from 'react';
import { Tag } from '../components-ui/tag';

export default {
  title: 'Tag',
  component: Tag,
  argTypes: {
    size: {
      options: ['medium', 'small'],
      control: { type: 'radio' },
    },
  },
} as ComponentMeta<typeof Tag>;

const Template: ComponentStory<typeof Tag> = (args) => (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
    <Tag size={args.size}>Tag default</Tag>
    <Tag size={args.size} color="error">
      Tag error
    </Tag>
    <Tag size={args.size} color="info">
      Tag info
    </Tag>
    <Tag size={args.size} color="new">
      Tag new
    </Tag>
    <Tag size={args.size} color="success">
      Tag success
    </Tag>
    <Tag size={args.size} color="warning">
      Tag warning
    </Tag>
  </div>
);

export const Primary = Template.bind({});

Primary.args = {
  size: 'medium',
};
