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
import { groceryApi } from '@/services/api';
import { GroceryItem as GroceryItemType } from '@/types/grocery';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import colors from 'tailwindcss/colors';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingBottom: 134,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default function MyListScreen() {
    const [newItem, setNewItem] = useState('');
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<GroceryItemType | null>(null);
    const queryClient = useQueryClient();
    const [itemFocused, setItemFocused] = useState<GroceryItemType | null>(null);

    const {
        data: items = [],
        isLoading,
        error,
    } = useQuery({
        queryKey: ['groceries'],
        queryFn: groceryApi.getGroceries,
    });

    const addMutation = useMutation({
        mutationFn: groceryApi.addGrocery,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['groceries'] });
            setNewItem('');
        },
    });

    const toggleMutation = useMutation({
        mutationFn: ({ id, updates }: { id: string; updates: Partial<GroceryItemType> }) =>
            groceryApi.updateGrocery(id, updates),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['groceries'] });
        },
    });

    const removeMutation = useMutation({
        mutationFn: ({ id }: { id: string }) => groceryApi.deleteGrocery(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['groceries'] });
        },
    });

    const handleAddItem = () => {
        if (newItem.trim()) {
            addMutation.mutate({
                title: newItem.trim(),
                amount: 1,
                bought: false,
            });
        }
    };

    const handleToggleItem = (item: GroceryItemType) => {
        toggleMutation.mutate({
            id: item.id,
            updates: { bought: !item.bought },
        });
    };

    const handleAddAmount = (item: GroceryItemType) => {
        toggleMutation.mutate({
            id: item.id,
            updates: { amount: item.amount + 1 },
        });
    };

    const handleRemoveAmount = (item: GroceryItemType) => {
        if (item.amount > 1) {
            toggleMutation.mutate({
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
            <Box style={styles.loadingContainer}>
                <Spinner size="large" color={colors.blue[500]} />
            </Box>
        );
    }

    if (error) {
        return (
            <Box style={styles.loadingContainer}>
                <Text>Error loading groceries</Text>
            </Box>
        );
    }

    return (
        <Box className="bg-white dark:bg-black flex-1" style={styles.container}>
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

                <FlatList
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
