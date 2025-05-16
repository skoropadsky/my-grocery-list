import {
    AddIcon,
    Button,
    ButtonIcon,
    Checkbox,
    CheckboxIcon,
    CheckboxIndicator,
    CheckIcon,
    CloseIcon,
    HStack,
    RemoveIcon,
    Text,
} from '@/components/ui';
import { GroceryItem as GroceryItemType } from '@/types/grocery';
import { useRouter } from 'expo-router';
import React from 'react';
import { TouchableOpacity } from 'react-native';

interface GroceryItemProps {
    item: GroceryItemType;
    isFocused: boolean;
    onToggle: (item: GroceryItemType) => void;
    onFocus: (item: GroceryItemType) => void;
    onAddAmount: (item: GroceryItemType) => void;
    onRemoveAmount: (item: GroceryItemType) => void;
    onRemove: (item: GroceryItemType) => void;
}

export function GroceryItem({
    item,
    isFocused,
    onToggle,
    onFocus,
    onAddAmount,
    onRemoveAmount,
    onRemove,
}: GroceryItemProps) {
    const router = useRouter();

    return (
        <HStack
            space="lg"
            className={`items-center justify-between p-2 rounded-md ${
                isFocused ? 'bg-gray-100 dark:bg-gray-800' : ''
            }`}
        >
            <HStack space="md" className="flex-1 items-center">
                <Checkbox
                    value={item.id}
                    isChecked={item.bought}
                    onChange={() => onToggle(item)}
                    size="lg"
                >
                    <CheckboxIndicator>
                        <CheckboxIcon as={CheckIcon} />
                    </CheckboxIndicator>
                </Checkbox>
                <TouchableOpacity
                    className="flex-1 p-2"
                    onLongPress={() => {
                        router.push({
                            pathname: '/edit',
                            params: {
                                id: item.id,
                                title: item.title,
                                amount: item.amount,
                            },
                        });
                    }}
                    onPress={() => onFocus(item)}
                >
                    <Text strikeThrough={item.bought}>{item.title}</Text>
                </TouchableOpacity>
            </HStack>
            {isFocused ? (
                <HStack className="align-top">
                    <Button
                        size="xs"
                        variant="outline"
                        className="rounded-full p-3.5"
                        onPress={() => onAddAmount(item)}
                    >
                        <ButtonIcon as={AddIcon} />
                    </Button>
                    <Text className="text-lg px-2 min-w-10 text-center">{item.amount}</Text>
                    <Button
                        size="xs"
                        variant="outline"
                        className="rounded-full p-3.5"
                        isDisabled={item.amount <= 1}
                        onPress={() => onRemoveAmount(item)}
                    >
                        <ButtonIcon as={RemoveIcon} />
                    </Button>
                    <Button
                        size="xs"
                        variant="link"
                        className="rounded-full px-3 ml-2"
                        onPress={() => onRemove(item)}
                    >
                        <ButtonIcon size="md" as={CloseIcon} />
                    </Button>
                </HStack>
            ) : (
                <HStack space="md">
                    <Text>{item.amount}</Text>
                </HStack>
            )}
        </HStack>
    );
}
