import type { VariantProps } from '@gluestack-ui/nativewind-utils';
import { tva } from '@gluestack-ui/nativewind-utils/tva';
import React from 'react';
import { View, ViewProps } from 'react-native';

const vstackStyle = tva({
    base: 'flex flex-col',
    variants: {
        space: {
            sm: 'gap-2',
            md: 'gap-4',
            lg: 'gap-6',
        },
    },
});

type IVStackProps = ViewProps & VariantProps<typeof vstackStyle> & { className?: string };

const VStack = React.forwardRef<React.ComponentRef<typeof View>, IVStackProps>(function VStack(
    { className, space, ...props },
    ref
) {
    return <View ref={ref} {...props} className={vstackStyle({ class: className, space })} />;
});

VStack.displayName = 'VStack';
export { VStack };
