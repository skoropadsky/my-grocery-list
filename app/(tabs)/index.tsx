import {
    Box,
    Button,
    ButtonText,
    Checkbox,
    CheckboxIcon,
    CheckboxIndicator,
    CheckboxLabel,
    CheckIcon,
    HStack,
    Text,
    VStack,
} from '@/components/ui';
import { groceryApi } from '@/services/api';
import { GroceryItem } from '@/types/grocery';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, TextInput } from 'react-native';

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
    const [newItem, setNewItem] = useState('');
    const queryClient = useQueryClient();

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

    if (isLoading) {
        return (
            <Box style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
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
                <HStack space="sm" alignItems="center">
                    <TextInput
                        style={{
                            flex: 1,
                            height: 40,
                            borderWidth: 1,
                            borderColor: '#ccc',
                            borderRadius: 8,
                            paddingHorizontal: 8,
                        }}
                        value={newItem}
                        onChangeText={setNewItem}
                        placeholder="Add new item"
                        onSubmitEditing={handleAddItem}
                    />

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
                            key={item.id}
                            space="md"
                            style={{ justifyContent: 'space-between' }}
                        >
                            <HStack space="sm" alignItems="center">
                                <Checkbox
                                    value={item.bought ? 'true' : 'false'}
                                    onChange={() => handleToggleItem(item)}
                                    size="lg"
                                    isInvalid={false}
                                    isDisabled={false}
                                >
                                    <CheckboxIndicator>
                                        <CheckboxIcon as={CheckIcon} />
                                    </CheckboxIndicator>
                                    <CheckboxLabel>
                                        <Text strikeThrough={item.bought}>{item.title}</Text>
                                    </CheckboxLabel>
                                </Checkbox>
                            </HStack>
                            <Text>x{item.amount}</Text>
                        </HStack>
                    ))}
                </VStack>
            </VStack>
        </Box>
    );
}
