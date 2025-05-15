import { GroceryItem } from '@/types/grocery';

const API_URL = 'http://localhost:3000';

export const groceryApi = {
    getGroceries: async (): Promise<GroceryItem[]> => {
        const response = await fetch(`${API_URL}/groceries`);
        if (!response.ok) {
            throw new Error('Failed to fetch groceries');
        }
        return response.json();
    },

    addGrocery: async (
        grocery: Omit<GroceryItem, 'id' | 'createdAt' | 'updatedAt'>
    ): Promise<GroceryItem> => {
        const response = await fetch(`${API_URL}/groceries`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...grocery,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            }),
        });
        if (!response.ok) {
            throw new Error('Failed to add grocery');
        }
        return response.json();
    },

    updateGrocery: async (id: string, updates: Partial<GroceryItem>): Promise<GroceryItem> => {
        const response = await fetch(`${API_URL}/groceries/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...updates,
                updatedAt: new Date().toISOString(),
            }),
        });
        if (!response.ok) {
            throw new Error('Failed to update grocery');
        }
        return response.json();
    },

    deleteGrocery: async (id: string): Promise<void> => {
        const response = await fetch(`${API_URL}/groceries/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error('Failed to delete grocery');
        }
    },
};
