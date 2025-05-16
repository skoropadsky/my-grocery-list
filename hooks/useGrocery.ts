import { groceryApi } from '@/services/api';
import { GroceryItem } from '@/types/grocery';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useGrocery() {
    const queryClient = useQueryClient();

    const addMutation = useMutation({
        mutationFn: groceryApi.addGrocery,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['groceries'] });
        },
    });

    const updateMutation = useMutation({
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

    const clearListMutation = useMutation({
        mutationFn: async () => {
            await groceryApi.clearGroceries();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['groceries'] });
        },
    });

    return {
        addMutation,
        updateMutation,
        removeMutation,
        clearListMutation,
    };
}
