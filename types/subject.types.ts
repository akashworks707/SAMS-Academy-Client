export interface ISubject {
    _id: string;
    title: string;
    description?: string;
    code?: string;
    isDeleted?: boolean;
    isActive?: boolean;
}