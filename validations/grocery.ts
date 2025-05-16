import * as Yup from 'yup';

export const groceryValidationSchema = Yup.object().shape({
    title: Yup.string()
        .required('Title is required')
        .min(2, 'Title must be at least 2 characters')
        .max(100, 'Title must not exceed 100 characters'),
    amount: Yup.string()
        .required('Amount is required')
        .test('is-number', 'Amount must be a number', (value) => !isNaN(Number(value)))
        .test('min', 'Amount must be at least 1', (value) => Number(value) >= 1)
        .test('max', 'Amount must not exceed 100', (value) => Number(value) <= 100),
});

export type GroceryFormValues = Yup.InferType<typeof groceryValidationSchema>;
