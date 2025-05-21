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
        onMutate: async (newTodo: { id: string; updates: Partial<GroceryItem> }) => {
            // Cancel any outgoing refetches
            // (so they don't overwrite our optimistic update)
            await queryClient.cancelQueries({ queryKey: ['groceries'] });

            // Snapshot the previous value
            const previousTodos = queryClient.getQueryData(['groceries']);

            // Optimistically update to the new value
            queryClient.setQueryData(['groceries'], (old: GroceryItem[]) => {
                return old.map((item) => {
                    if (item.id === newTodo.id) {
                        return { ...item, ...newTodo.updates };
                    }
                    return item;
                });
            });

            // Return a context object with the snapshotted value
            return { previousTodos };
        },
        onError: (err, newTodo, context) => {
            queryClient.setQueryData(['groceries'], context?.previousTodos);
        },
        onSettled: () => queryClient.invalidateQueries({ queryKey: ['groceries'] }),
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
