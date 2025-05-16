import { GroceryItem } from '@/components/GroceryItem';
import {
    AlertDialog,
    AlertDialogBackdrop,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
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
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<GroceryItemType | null>(null);
    const [itemFocused, setItemFocused] = useState<GroceryItemType | null>(null);
    const flatListRef = useRef<FlatList>(null);
    const { addMutation, updateMutation, removeMutation } = useGrocery();

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

    const handleRemoveItem = () => {
        if (itemToDelete) {
            removeMutation.mutate({
                id: itemToDelete.id,
            });
            setItemToDelete(null);
            setShowDeleteDialog(false);
        }
    };

    const handleRemoveDialog = (item: GroceryItemType | null) => {
        if (item) {
            setItemToDelete(item);
            setShowDeleteDialog(true);
        } else {
            setItemToDelete(null);
            setShowDeleteDialog(false);
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
        <Box className="bg-white dark:bg-black" style={styles.container}>
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
                                onToggle={handleToggleItem}
                                onFocus={setItemFocused}
                                onAddAmount={handleAddAmount}
                                onRemoveAmount={handleRemoveAmount}
                                onRemove={handleRemoveDialog}
                            />
                        )}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={{ gap: 8 }}
                        className="px-4"
                    />
                )}
            </VStack>
            <AlertDialog
                isOpen={showDeleteDialog}
                onClose={() => handleRemoveDialog(null)}
                size="md"
            >
                <AlertDialogBackdrop />
                <AlertDialogContent>
                    <AlertDialogHeader className="mb-6">
                        <Text className="text-typography-950 font-semibold" size="lg">
                            Delete &quot;{itemToDelete?.title}&quot; from the list?
                        </Text>
                    </AlertDialogHeader>

                    <AlertDialogFooter className="">
                        <Button
                            variant="outline"
                            action="secondary"
                            onPress={() => handleRemoveDialog(null)}
                            size="lg"
                        >
                            <ButtonText>Cancel</ButtonText>
                        </Button>
                        <Button size="lg" onPress={() => handleRemoveItem()}>
                            <ButtonText>Delete</ButtonText>
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Box>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingBottom: 134,
    },
});
