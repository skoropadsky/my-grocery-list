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
    Switch,
    Text,
    VStack,
} from '@/components/ui';
import { groceryApi } from '@/services/api';
import { useThemeStore } from '@/stores/themeStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet } from 'react-native';

export default function SettingsScreen() {
    const { themeMode, setTheme } = useThemeStore();
    const [showClearDialog, setShowClearDialog] = useState(false);
    const queryClient = useQueryClient();

    const clearListMutation = useMutation({
        mutationFn: groceryApi.clearGroceries,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['groceries'] });
            setShowClearDialog(false);
            router.push('/');
        },
        onError: (error) => {
            console.error('Error clearing list:', error);
        },
    });

    const handleThemeChange = (value: boolean) => {
        setTheme(value ? 'dark' : 'light');
    };

    const handleClearList = () => {
        clearListMutation.mutate();
    };

    return (
        <Box className="bg-white dark:bg-black flex-1" style={styles.container}>
            <VStack space="lg" className="p-4">
                <Text size="2xl">Settings</Text>
                <HStack space="md" className="items-center justify-between">
                    <Text>Dark Mode</Text>
                    <Switch value={themeMode === 'dark'} onToggle={handleThemeChange} size="md" />
                </HStack>
                <Button
                    variant="outline"
                    action="negative"
                    onPress={() => setShowClearDialog(true)}
                    size="md"
                >
                    <ButtonText>Clear list</ButtonText>
                </Button>
            </VStack>

            <AlertDialog
                isOpen={showClearDialog}
                onClose={() => setShowClearDialog(false)}
                size="md"
            >
                <AlertDialogBackdrop />
                <AlertDialogContent>
                    <AlertDialogHeader className="mb-6">
                        <Text className="text-typography-950 font-semibold" size="lg">
                            Do you want to remove all items from the list?
                        </Text>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                        <Button
                            variant="outline"
                            action="secondary"
                            onPress={() => setShowClearDialog(false)}
                            size="lg"
                        >
                            <ButtonText>Cancel</ButtonText>
                        </Button>
                        <Button
                            variant="solid"
                            action="negative"
                            onPress={handleClearList}
                            size="lg"
                            isDisabled={clearListMutation.isPending}
                        >
                            <ButtonText>Yes, clear all</ButtonText>
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
    },
});
