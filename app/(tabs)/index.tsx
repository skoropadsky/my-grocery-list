import { Box } from '@/components/ui/box';
import { Button } from '@/components/ui/button';
import { Checkbox, CheckboxIcon, CheckboxIndicator, CheckboxLabel } from '@/components/ui/checkbox';
import { HStack } from '@/components/ui/hstack';
import { CheckIcon } from '@/components/ui/icon';
import { VStack } from '@/components/ui/vstack';
import { groceryApi } from '@/services/api';
import { GroceryItem } from '@/types/grocery';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import { ActivityIndicator, SafeAreaView, StyleSheet, Text, TextInput } from 'react-native';

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
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
            <SafeAreaView style={styles.safeArea}>
                <Box style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </Box>
            </SafeAreaView>
        );
    }

    if (error) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <Box style={styles.loadingContainer}>
                    <Text>Error loading groceries</Text>
                </Box>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <Box style={styles.container}>
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
                            onPress={handleAddItem}
                            disabled={!newItem.trim() || addMutation.isPending}
                        >
                            <Text>Add</Text>
                        </Button>
                    </HStack>

                    <VStack space="sm">
                        {items.map((item) => (
                            <HStack
                                key={item.id}
                                space="sm"
                                alignItems="center"
                                justifyContent="space-between"
                            >
                                <HStack space="sm" alignItems="center">
                                    <Checkbox
                                        value={item.bought ? 'true' : 'false'}
                                        onChange={() => handleToggleItem(item)}
                                        size="md"
                                        isInvalid={false}
                                        isDisabled={false}
                                    >
                                        <CheckboxIndicator>
                                            <CheckboxIcon as={CheckIcon} />
                                        </CheckboxIndicator>
                                        <CheckboxLabel>
                                            <Text
                                                style={{
                                                    textDecorationLine: item.bought
                                                        ? 'line-through'
                                                        : 'none',
                                                }}
                                            >
                                                {item.title}
                                            </Text>
                                        </CheckboxLabel>
                                    </Checkbox>
                                </HStack>
                                <Text>x{item.amount}</Text>
                            </HStack>
                        ))}
                    </VStack>
                </VStack>
            </Box>
        </SafeAreaView>
    );
}
