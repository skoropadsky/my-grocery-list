import { Box, Button, ButtonText, HStack, Input, InputField, Text, VStack } from '@/components/ui';
import { useGrocery } from '@/hooks/useGrocery';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';

export default function EditScreen() {
    const { id, title, amount } = useLocalSearchParams<{
        id: string;
        title: string;
        amount: string;
    }>();
    const [editedTitle, setEditedTitle] = useState<string>(title);
    const [editedAmount, setEditedAmount] = useState<string>(amount);
    const router = useRouter();
    const { updateMutation } = useGrocery();

    const handleSave = () => {
        const trimmedTitle = editedTitle.trim();
        const trimmedAmount = Number(editedAmount.trim());
        if (trimmedTitle && trimmedAmount) {
            updateMutation.mutate(
                {
                    id,
                    updates: {
                        title: trimmedTitle,
                        amount: trimmedAmount,
                    },
                },
                {
                    onSuccess: () => {
                        router.back();
                    },
                }
            );
        }
    };

    return (
        <Box className="flex-1 bg-background p-4">
            <VStack space="md" className="flex-1">
                <Text className="text-foreground">Edit Item</Text>
                <Input variant="underlined" size="lg" className="flex-1">
                    <InputField
                        value={editedTitle}
                        onChangeText={setEditedTitle}
                        placeholder="Enter title..."
                        multiline
                    />
                </Input>
                <Input variant="underlined" size="lg" className="flex-1">
                    <InputField
                        value={editedAmount}
                        onChangeText={setEditedAmount}
                        placeholder="Enter amount..."
                    />
                </Input>
                <HStack space="md" className="mt-4">
                    <Button
                        variant="outline"
                        size="lg"
                        className="flex-1"
                        onPress={() => router.back()}
                    >
                        <ButtonText>Cancel</ButtonText>
                    </Button>
                    <Button
                        variant="solid"
                        size="lg"
                        className="flex-1"
                        onPress={handleSave}
                        isDisabled={
                            !editedTitle.trim() || !editedAmount.trim() || updateMutation.isPending
                        }
                    >
                        <ButtonText>{updateMutation.isPending ? 'Saving...' : 'Save'}</ButtonText>
                    </Button>
                </HStack>
            </VStack>
        </Box>
    );
}
