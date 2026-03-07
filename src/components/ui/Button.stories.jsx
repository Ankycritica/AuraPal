import React from 'react';
import { Button } from './button';

export default {
    title: 'Components/Button',
    component: Button,
    argTypes: {
        variant: {
            control: { type: 'select' },
            options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
        },
        size: {
            control: { type: 'select' },
            options: ['default', 'sm', 'lg', 'icon'],
        },
    },
};

const Template = (args) => <Button {...args}>Click Me</Button>;

export const Primary = Template.bind({});
Primary.args = {
    variant: 'default',
    size: 'default',
};

export const Outline = Template.bind({});
Outline.args = {
    ...Primary.args,
    variant: 'outline',
};

export const PremiumGradient = (args) => (
    <Button
        className="bg-brand-gradient text-on-brand shadow-lg hover:opacity-90 transition-opacity"
        {...args}
    >
        Upgrade Now
    </Button>
);
