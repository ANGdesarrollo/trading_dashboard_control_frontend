import { useState } from "react";
import { OperationDto, UpdateOperationDto } from "@/features/shared/interfaces";
import { fileRepository, operationRepository } from "@/features/shared/repositories";
import { tag } from "@/features/shared/actions/revalidate";

export function useOperations() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [uploadedFileId, setUploadedFileId] = useState<string | null>(null);

    const handleFileUpload = async (file: File) => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await fileRepository.upload(file);
            if (result.success) {
                setUploadedFileId(result.data.id);
                return result.data.id;
            } else {
                setError(result.error.message);
                return null;
            }
        } catch {
            setError("Error al subir el archivo.");
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    const create = async (data: OperationDto & { file?: File }) => {
        let fileId = uploadedFileId;
        if (data.file && !fileId) {
            fileId = await handleFileUpload(data.file);
            if (!fileId) return;
        }
        const payload: OperationDto = {
            fileId: fileId!,
            date: data.date,
            result: data.result,
            pips: data.pips,
            type: data.type,
            description: data.description,
            symbolId: data.symbolId
        };
        const result = await operationRepository.create(payload);
        if (result.success) {
            await tag("operation");
            setUploadedFileId(null);
        } else {
            setError(result.error.message);
        }
    };

    const update = async (data: UpdateOperationDto & { file?: File }, id: string) => {
        let fileId = data.fileId;
        if (data.file) {
            const newFileId = await handleFileUpload(data.file);
            if (newFileId) fileId = newFileId;
            else return;
        }
        const payload = { ...data, fileId };
        delete payload.file;

        // @ts-expect-error error for eslint error
        const result = await operationRepository.update(id, payload);
        if (result.success) {
            await tag("operation");
        } else {
            setError(result.error.message);
        }
    };

    const remove = async (id: string) => {
        const result = await operationRepository.delete(id);
        if (result.success) {
            await tag("operation");
        } else {
            setError(result.error.message);
        }
    };

    return {
        isLoading,
        error,
        create,
        update,
        remove,
        handleFileUpload,
        setError,
    };
}
