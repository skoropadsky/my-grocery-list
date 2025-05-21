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
import { useGrocery } from '@/hooks/useGrocery';
import { GroceryItem as GroceryItemType } from '@/types/grocery';
import { useRouter } from 'expo-router';
import React from 'react';
import { TouchableOpacity } from 'react-native';

interface GroceryItemProps {
    item: GroceryItemType;
    isFocused: boolean;
    setItemFocused: (item: GroceryItemType) => void;
    setItemToDelete: (item: GroceryItemType | null) => void;
}

export function GroceryItem({
    item,
    isFocused,
    setItemFocused,
    setItemToDelete,
}: GroceryItemProps) {
    const router = useRouter();
    const { updateMutation } = useGrocery();

    const handleToggleItem = (item: GroceryItemType) => {
        updateMutation.mutate({
            id: item.id,
            updates: { bought: !item.bought },
        });
    };

    const handleAddAmount = (item: GroceryItemType) => {
        updateMutation.mutate({
            id: item.id,
            updates: { amount: item.amount + 1 },
        });
    };

    const handleRemoveAmount = (item: GroceryItemType) => {
        if (item.amount > 1) {
            updateMutation.mutate({
                id: item.id,
                updates: { amount: item.amount - 1 },
            });
        }
    };

    const handleRemoveDialog = (item: GroceryItemType | null) => {
        if (item) {
            setItemToDelete(item);
        } else {
            setItemToDelete(null);
        }
    };

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
                    onChange={() => handleToggleItem(item)}
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
                    onPress={() => setItemFocused(item)}
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
                        onPress={() => handleAddAmount(item)}
                    >
                        <ButtonIcon as={AddIcon} />
                    </Button>
                    <Text className="text-lg px-2 min-w-10 text-center">{item.amount}</Text>
                    <Button
                        size="xs"
                        variant="outline"
                        className="rounded-full p-3.5"
                        isDisabled={item.amount <= 1}
                        onPress={() => handleRemoveAmount(item)}
                    >
                        <ButtonIcon as={RemoveIcon} />
                    </Button>
                    <Button
                        size="xs"
                        variant="link"
                        className="rounded-full px-3 ml-2"
                        onPress={() => handleRemoveDialog(item)}
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
