type UniqueIdentity = {
	id: string;
};

type RecordItem = {
	note?: string;
	createdAt?: string;
	categoryId: string;
	amount: number;
	type: 'income' | 'expense';
} & UniqueIdentity;
