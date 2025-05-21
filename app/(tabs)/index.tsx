import { DeleteModal } from '@/components/DeleteModal';
import { GroceryItem } from '@/components/GroceryItem';
import {
    Box,
    Button,
    ButtonText,
    HStack,
    Input,
    InputField,
    Spinner,
    Text,
    VStack,
} from '@/components/ui';
import { useGrocery } from '@/hooks/useGrocery';
import { groceryApi } from '@/services/api';
import { GroceryItem as GroceryItemType } from '@/types/grocery';
import { useQuery } from '@tanstack/react-query';
import React, { useRef, useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import colors from 'tailwindcss/colors';

export default function MyListScreen() {
    const [newItem, setNewItem] = useState('');

    const [itemToDelete, setItemToDelete] = useState<GroceryItemType | null>(null);
    const flatListRef = useRef<FlatList>(null);
    const { addMutation } = useGrocery();
    const [itemFocused, setItemFocused] = useState<GroceryItemType | null>(null);

    const {
        data: items = [],
        isLoading,
        error,
    } = useQuery({
        queryKey: ['groceries'],
        queryFn: groceryApi.getGroceries,
    });

    const handleAddItem = () => {
        if (newItem.trim()) {
            addMutation.mutate(
                {
                    title: newItem.trim(),
                    amount: 1,
                    bought: false,
                },
                {
                    onSuccess: () => {
                        setNewItem('');
                        setTimeout(() => {
                            flatListRef.current?.scrollToEnd({ animated: true });
                        }, 100);
                    },
                }
            );
        }
    };

    if (isLoading) {
        return (
            <Box className="bg-white dark:bg-black flex-1 items-center justify-center">
                <Spinner size="large" color={colors.blue[500]} />
            </Box>
        );
    }

    if (error) {
        return (
            <Box className="bg-white dark:bg-black flex-1 items-center justify-center">
                <Text>Error loading groceries. Make sure server is running.</Text>
            </Box>
        );
    }

    return (
        <Box className="flex-1 bg-white dark:bg-black" style={styles.container}>
            <VStack space="md">
                <HStack space="sm" className="items-center p-4">
                    <Input className="flex-1" variant="outline" size="md">
                        <InputField
                            value={newItem}
                            onChangeText={setNewItem}
                            placeholder="Enter title..."
                        />
                    </Input>

                    <Button
                        size="md"
                        variant="outline"
                        action="primary"
                        onPress={handleAddItem}
                        disabled={!newItem.trim() || addMutation.isPending}
                    >
                        <ButtonText>Add item</ButtonText>
                    </Button>
                </HStack>

                {items?.length === 0 ? (
                    <Text className="text-center text-typography-500">Add your first item</Text>
                ) : (
                    <FlatList
                        ref={flatListRef}
                        data={items}
                        renderItem={({ item }) => (
                            <GroceryItem
                                item={item}
                                isFocused={itemFocused?.id === item.id}
                                setItemFocused={setItemFocused}
                                setItemToDelete={setItemToDelete}
                            />
                        )}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={{ gap: 8 }}
                        className="px-4"
                    />
                )}
            </VStack>
            <DeleteModal itemToDelete={itemToDelete} setItemToDelete={setItemToDelete} />
        </Box>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingBottom: 134,
    },
});
