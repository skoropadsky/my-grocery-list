import type { VariantProps } from '@gluestack-ui/nativewind-utils';
import { tva } from '@gluestack-ui/nativewind-utils/tva';
import React from 'react';
import { View, ViewProps } from 'react-native';

const hstackStyle = tva({
    base: 'flex-row items-center',
    variants: {
        space: {
            sm: 'gap-2',
            md: 'gap-4',
            lg: 'gap-6',
        },
    },
});

type IHStackProps = ViewProps & VariantProps<typeof hstackStyle> & { className?: string };

const HStack = React.forwardRef<React.ComponentRef<typeof View>, IHStackProps>(function HStack(
    { className, space, ...props },
    ref
) {
    return <View ref={ref} {...props} className={hstackStyle({ class: className, space })} />;
});

HStack.displayName = 'HStack';
export { HStack };
