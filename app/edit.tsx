import { Box, Button, ButtonText, HStack, Input, InputField, Text, VStack } from '@/components/ui';
import { useGrocery } from '@/hooks/useGrocery';
import { GroceryFormValues, groceryValidationSchema } from '@/validations/grocery';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Formik, FormikHelpers } from 'formik';
import React from 'react';

export default function EditScreen() {
    const { id, title, amount } = useLocalSearchParams<{
        id: string;
        title: string;
        amount: string;
    }>();
    const router = useRouter();
    const { updateMutation } = useGrocery();

    const initialValues: GroceryFormValues = {
        title: title,
        amount: amount,
    };

    const handleSubmit = (
        values: GroceryFormValues,
        { setSubmitting }: FormikHelpers<GroceryFormValues>
    ) => {
        const trimmedTitle = values.title.trim();
        const trimmedAmount = Number(values.amount.trim());

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
                onSettled: () => {
                    setSubmitting(false);
                },
            }
        );
    };

    return (
        <Formik<GroceryFormValues>
            initialValues={initialValues}
            validationSchema={groceryValidationSchema}
            onSubmit={handleSubmit}
        >
            {({ handleChange, handleSubmit, values, errors, touched, isSubmitting }) => (
                <Box className="bg-white dark:bg-black flex-1 p-4">
                    <VStack space="md" className="flex-1">
                        <Text className="text-typography-500 font-medium">Title</Text>
                        <Input variant="underlined" size="lg">
                            <InputField
                                value={values.title}
                                onChangeText={handleChange('title')}
                                placeholder="Enter title..."
                                multiline
                            />
                        </Input>
                        {touched.title && errors.title && (
                            <Text className="text-red-500 text-sm">{errors.title}</Text>
                        )}

                        <Text className="text-typography-500 font-medium">Amount</Text>
                        <Input variant="underlined" size="lg">
                            <InputField
                                value={values.amount}
                                onChangeText={handleChange('amount')}
                                placeholder="Enter amount..."
                                keyboardType="numeric"
                            />
                        </Input>
                        {touched.amount && errors.amount && (
                            <Text className="text-red-500 text-sm">{errors.amount}</Text>
                        )}

                        <HStack space="md" className="mt-4 flex-1">
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
                                onPress={() => handleSubmit()}
                                isDisabled={isSubmitting || updateMutation.isPending}
                            >
                                <ButtonText>
                                    {updateMutation.isPending ? 'Saving...' : 'Save'}
                                </ButtonText>
                            </Button>
                        </HStack>
                    </VStack>
                </Box>
            )}
        </Formik>
    );
}
