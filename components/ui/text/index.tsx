import type { VariantProps } from '@gluestack-ui/nativewind-utils';
import { tva } from '@gluestack-ui/nativewind-utils/tva';
import React from 'react';
import { Text as RNText, TextProps } from 'react-native';

const textStyle = tva({
    base: 'text-typography-900',
    variants: {
        size: {
            xs: 'text-xs',
            sm: 'text-sm',
            md: 'text-base',
            lg: 'text-lg',
            xl: 'text-xl',
            '2xl': 'text-2xl',
            '3xl': 'text-3xl',
            '4xl': 'text-4xl',
        },
    },
    defaultVariants: {
        size: 'md',
    },
});

type ITextProps = TextProps & VariantProps<typeof textStyle> & { className?: string };

const Text = React.forwardRef<React.ComponentRef<typeof RNText>, ITextProps>(function Text(
    { className, ...props },
    ref
) {
    return <RNText ref={ref} {...props} className={textStyle({ class: className })} />;
});

Text.displayName = 'Text';
export { Text };
