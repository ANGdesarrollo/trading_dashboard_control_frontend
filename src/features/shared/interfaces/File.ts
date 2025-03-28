
// Base file entity that matches FileDomain from backend
import {BaseDomain} from "@/features/shared/interfaces/BaseDomain";

export interface File extends BaseDomain {
    id: string;
    fileName: string;
    originalName: string;
    path: string;
    mimeType: string;
    size: number;
    isPublic: boolean;
    url?: string;
}

// DTO for creating a file (matches FileDto)
export interface FileDto {
    fileName: string;
    originalName: string;
    path: string;
    mimeType: string;
    size: number;
    isPublic?: boolean;
    url?: string;
}

// DTO for updating a file (partial of FileDto)
export interface UpdateFileDto extends Partial<FileDto> {}

// DTO for uploading a file
export interface UploadFileDto {
    file: File | Blob;
    isPublic?: boolean;
}

// Response from the file upload endpoint
export interface FileUploadResponse extends File {}
