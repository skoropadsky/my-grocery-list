import {
    AlertDialog,
    AlertDialogBackdrop,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    Button,
    ButtonText,
    Text,
} from '@/components/ui';
import { useGrocery } from '@/hooks/useGrocery';
import { GroceryItem as GroceryItemType } from '@/types/grocery';
import { Alert } from 'react-native';

export function DeleteModal({
    itemToDelete,
    setItemToDelete,
}: {
    itemToDelete: GroceryItemType | null;
    setItemToDelete: (item: GroceryItemType | null) => void;
}) {
    const { removeMutation } = useGrocery();

    const handleRemoveItem = async () => {
        try {
            if (itemToDelete) {
                await removeMutation.mutateAsync({
                    id: itemToDelete.id,
                });

                setItemToDelete(null);
            }
        } catch (error: any) {
            Alert.alert('Error', error?.message);
        }
    };

    return (
        <AlertDialog isOpen={!!itemToDelete} onClose={() => setItemToDelete(null)} size="md">
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
                        onPress={() => setItemToDelete(null)}
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
    );
}
