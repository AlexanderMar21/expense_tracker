export type ExcludeId<T extends UniqueIdentity> = Exclude<T, { id: string }>;
