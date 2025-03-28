export interface BaseId {
    id: string;
}

export interface TimeStamp {
    createdAt: Date;
    updatedAt: Date;
}

export interface BaseDomain extends BaseId, TimeStamp {}

export interface ApiResponse<T> {
    data: T;
    message?: string;
}

export interface ApiErrorResponse {
    message: string;
    details?: never;
}
