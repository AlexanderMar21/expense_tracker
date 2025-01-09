'use client';

import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface RecordFormProps {
	initialData?: RecordItem;
	onSubmit: (data: RecordItem) => void;
	categories: { id: string; name: string }[];
}

export const RecordForm: React.FC<RecordFormProps> = ({ initialData, onSubmit, categories }) => {
	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<RecordItem>({
		defaultValues: initialData || {
			id: '',
			note: '',
			createdAt: new Date().toISOString().split('T')[0],
			categoryId: '',
			amount: 0,
			type: 'expense',
		},
	});

	const isEditMode = !!initialData;

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
			<Controller
				name="type"
				control={control}
				rules={{ required: 'Type is required' }}
				render={({ field }) => (
					<Select onValueChange={field.onChange} defaultValue={field.value}>
						<SelectTrigger className="w-full">
							<SelectValue placeholder="Select type" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="income">Income</SelectItem>
							<SelectItem value="expense">Expense</SelectItem>
						</SelectContent>
					</Select>
				)}
			/>
			{errors.type && <p className="text-red-500 text-sm">{errors.type.message}</p>}

			<Controller
				name="amount"
				control={control}
				rules={{ required: 'Amount is required', min: { value: 0, message: 'Amount must be positive' } }}
				render={({ field }) => (
					<Input
						type="number"
						placeholder="Amount"
						{...field}
						onChange={(e) => field.onChange(parseFloat(e.target.value))}
					/>
				)}
			/>
			{errors.amount && <p className="text-red-500 text-sm">{errors.amount.message}</p>}

			<Controller
				name="categoryId"
				control={control}
				rules={{ required: 'Category is required' }}
				render={({ field }) => (
					<Select onValueChange={field.onChange} defaultValue={field.value}>
						<SelectTrigger className="w-full">
							<SelectValue placeholder="Select category" />
						</SelectTrigger>
						<SelectContent>
							{categories.map((category) => (
								<SelectItem key={category.id} value={category.id}>
									{category.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				)}
			/>
			{errors.categoryId && <p className="text-red-500 text-sm">{errors.categoryId.message}</p>}

			<Controller
				name="createdAt"
				control={control}
				rules={{ required: 'Date is required' }}
				render={({ field }) => <Input type="date" {...field} />}
			/>
			{errors.createdAt && <p className="text-red-500 text-sm">{errors.createdAt.message}</p>}

			<Controller
				name="note"
				control={control}
				render={({ field }) => <Textarea placeholder="Note (optional)" {...field} />}
			/>

			<Button type="submit" className="w-full">
				{isEditMode ? 'Update Record' : 'Create Record'}
			</Button>
		</form>
	);
};
