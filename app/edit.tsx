import { Box, Button, ButtonText, HStack, Input, InputField, Text, VStack } from '@/components/ui';
import { groceryApi } from '@/services/api';
import { GroceryItem } from '@/types/grocery';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';

export default function EditScreen() {
    const router = useRouter();
    const { id, title, amount } = useLocalSearchParams<{
        id: string;
        title: string;
        amount: string;
    }>();
    const [editedTitle, setEditedTitle] = useState(title);
    const [editedAmount, setEditedAmount] = useState(amount);
    const queryClient = useQueryClient();

    const updateMutation = useMutation({
        mutationFn: ({ id, updates }: { id: string; updates: Partial<GroceryItem> }) =>
            groceryApi.updateGrocery(id, updates),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['groceries'] });
            router.back();
        },
    });

    const handleSave = () => {
        const newTitle = editedTitle.trim();
        const newAmount = Number(editedAmount.trim());
        if (newTitle && newAmount) {
            updateMutation.mutate({
                id,
                updates: { title: newTitle, amount: newAmount },
            });
        }
    };

    return (
        <Box className="bg-white dark:bg-black flex-1 p-4">
            <VStack
                space="md"
                className="mb-8"
                style={{ minHeight: 80, paddingTop: 8, paddingBottom: 8 }}
            >
                <Text className="text-typography-500">Title</Text>
                <Input variant="underlined" size="lg" className="flex-1">
                    <InputField
                        value={editedTitle}
                        onChangeText={setEditedTitle}
                        placeholder="Enter title..."
                        multiline
                    />
                </Input>
            </VStack>
            <VStack
                space="md"
                className="mb-8"
                style={{ minHeight: 80, paddingTop: 8, paddingBottom: 8 }}
            >
                <Text className="text-typography-500">Amount</Text>
                <Input variant="underlined" size="lg" className="flex-1">
                    <InputField
                        value={editedAmount}
                        onChangeText={(newAmount) => setEditedAmount(newAmount)}
                        placeholder="Enter amount..."
                    />
                </Input>
            </VStack>
            <HStack space="md" className="justify-end">
                <Button
                    variant="outline"
                    action="secondary"
                    onPress={() => router.back()}
                    size="lg"
                >
                    <ButtonText>Cancel</ButtonText>
                </Button>
                <Button
                    size="lg"
                    onPress={handleSave}
                    disabled={!editedTitle.trim() || updateMutation.isPending}
                >
                    <ButtonText>Save</ButtonText>
                </Button>
            </HStack>
        </Box>
    );
}
