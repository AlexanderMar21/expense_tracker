import { Repository } from '@/abstracts/Repository';
import { db } from '@/vendors/firebase';
import { collection, addDoc } from 'firebase/firestore';

export default class ExpenseRepository extends Repository<RecordItem> {
	constructor() {
		super();
	}
	async create(entry: RecordItem): string {
		try {
			const docRef = await addDoc(collection(db, 'expenses'), {
				description: entry.description ?? '',
				amount: entry.amount,
				type: 'expense',
				date: entry.createdAt,
				category: entry.categoryId,
			});
			console.log('Document written with ID: ', docRef.id);
			return docRef.id;
		} catch (e) {
			console.error('Error adding document: ', e);
		}
	}
	findOne(id: string) {}
	findAll() {}

	updateOne(id: string, payload: RecordItem) {}

	deleteOne(id: string) {
		return true;
	}
}
