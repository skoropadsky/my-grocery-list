import type { VariantProps } from '@gluestack-ui/nativewind-utils';
import { tva } from '@gluestack-ui/nativewind-utils/tva';
import React from 'react';
import { Pressable, PressableProps } from 'react-native';

const buttonStyle = tva({
    base: 'flex-row items-center justify-center rounded-md',
    variants: {
        size: {
            sm: 'px-3 py-2',
            md: 'px-4 py-2',
            lg: 'px-6 py-3',
        },
        variant: {
            solid: 'bg-primary-600 active:bg-primary-700',
            outline: 'border-2 border-primary-600 active:bg-primary-50',
            ghost: 'active:bg-primary-50',
        },
    },
    defaultVariants: {
        size: 'md',
        variant: 'solid',
    },
});

type IButtonProps = PressableProps & VariantProps<typeof buttonStyle> & { className?: string };

const Button = React.forwardRef<React.ComponentRef<typeof Pressable>, IButtonProps>(function Button(
    { className, ...props },
    ref
) {
    return <Pressable ref={ref} {...props} className={buttonStyle({ class: className })} />;
});

Button.displayName = 'Button';
export { Button };
