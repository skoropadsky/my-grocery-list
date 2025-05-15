import {
    AddIcon,
    AlertDialog,
    AlertDialogBackdrop,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    Box,
    Button,
    ButtonIcon,
    ButtonText,
    Checkbox,
    CheckboxIcon,
    CheckboxIndicator,
    CheckIcon,
    CloseIcon,
    HStack,
    Input,
    InputField,
    RemoveIcon,
    Spinner,
    Text,
    VStack,
} from '@/components/ui';
import { groceryApi } from '@/services/api';
import { GroceryItem } from '@/types/grocery';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import colors from 'tailwindcss/colors';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default function MyListScreen() {
    const router = useRouter();
    const [newItem, setNewItem] = useState('');
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<GroceryItem | null>(null);
    const queryClient = useQueryClient();
    const [itemFocused, setItemFocused] = useState<GroceryItem | null>(null);

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
        mutationFn: ({ id, updates }: { id: string; updates: Partial<GroceryItem> }) =>
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

    const handleToggleItem = (item: GroceryItem) => {
        toggleMutation.mutate({
            id: item.id,
            updates: { bought: !item.bought },
        });
    };

    const handleAddAmount = (item: GroceryItem) => {
        toggleMutation.mutate({
            id: item.id,
            updates: { amount: item.amount + 1 },
        });
    };

    const handleRemoveAmount = (item: GroceryItem) => {
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

    const handleRemoveDialog = (item: GroceryItem | null) => {
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
                <HStack space="sm" className="mb-4 items-center">
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

                <VStack space="md">
                    {items.map((item) => (
                        <HStack
                            space="lg"
                            key={item.id}
                            className={`items-center justify-between p-2 rounded-md ${
                                itemFocused?.id === item.id ? 'bg-gray-100 dark:bg-gray-800' : ''
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
                            {itemFocused?.id === item.id && (
                                <HStack className="align-top">
                                    <Button
                                        size="xs"
                                        variant="outline"
                                        className="rounded-full p-3.5"
                                        onPress={() => handleAddAmount(item)}
                                    >
                                        <ButtonIcon as={AddIcon} />
                                    </Button>
                                    <Text className="text-lg px-2 min-w-10 text-center">
                                        {item.amount}
                                    </Text>
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
                            )}
                        </HStack>
                    ))}
                </VStack>
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
