import type { ExcludeId } from '@/types/utils';

export abstract class Repository<T extends UniqueIdentity> {
	abstract create(entry: ExcludeId<T>): Awaited<string>;
	abstract findOne(id: string): Awaited<T>;
	abstract findAll(): Awaited<T[]>;
	abstract updateOne(id: string, payload: Partial<T>): Awaited<T>;
	abstract deleteOne(id: string): Awaited<boolean>;
}
