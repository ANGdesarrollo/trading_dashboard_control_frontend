"use client";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/features/shared/organisms/Table";
import { Operation, OperationDto, UpdateOperationDto, Result, TradeType, Symbol } from "@/features/shared/interfaces";
import { formatDate } from "@/lib/utils";
import React, { useState } from "react";
import { Dialog } from "@radix-ui/react-dialog";
import { DialogContent, DialogHeader, DialogTitle } from "@/features/shared/molecules/Dialog";
import { OperationDeleteConfirmation } from "@/features/operation/molecules/OperationDeleteConfirmation";
import { CreateOperationForm } from "@/features/operation/molecules/CreateOperationForm";
import { UpdateOperationForm } from "@/features/operation/molecules/UpdateOperationForm";
import { operationRepository, fileRepository } from "@/features/shared/repositories";
import { tag } from "@/features/shared/actions/revalidate";
import styles from './operation-table.module.css';
import Image from "next/image";

interface Props {
    operations: Operation[];
    symbols: Symbol[];
}

export const OperationTable = ({ operations, symbols }: Props) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isUpdateOpen, setIsUpdateOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [selectedOperation, setSelectedOperation] = useState<Operation | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [uploadedFileId, setUploadedFileId] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleFileUpload = async (file: File) => {
        if (!file) return;

        setIsUploading(true);
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
        } catch (err) {
            setError('Error al subir el archivo. Intente nuevamente.');
            console.error('Error uploading file:', err);
            return null;
        } finally {
            setIsUploading(false);
        }
    };

    const handleCreateOperation = async (data: OperationDto & { file?: File }) => {
        setIsLoading(true);
        setError(null);

        try {
            let fileId = uploadedFileId;

            // If a file was included in the form submission and not already uploaded
            if (data.file && !fileId) {
                fileId = await handleFileUpload(data.file) as string | null;
                if (!fileId) {
                    setIsLoading(false);
                    return;
                }
            }

            if (!fileId) {
                setError('Se requiere una imagen para la operación.');
                setIsLoading(false);
                return;
            }


            const payload: OperationDto = {
                fileId,
                date: data.date,
                result: data.result,
                pips: data.pips,
                type: data.type,
                description: data.description,
                symbolId: data.symbolId
            }

            const result = await operationRepository.create(payload);

            if (result.success) {
                await tag('operation');
                setIsCreateOpen(false);
                setUploadedFileId(null); // Reset the uploaded file ID
            } else {
                setError(result.error.message);
            }
        } catch (err) {
            setError('Error al crear la operación. Intente nuevamente.');
            console.error('Error creating operation:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateOperation = async (id: string, data: UpdateOperationDto & { file?: File }) => {
        setIsLoading(true);
        setError(null);

        try {
            let fileId = data.fileId;

            // If a new file was included in the form submission
            if (data.file) {
                const newFileId = await handleFileUpload(data.file);
                if (newFileId) {
                    fileId = newFileId;
                } else {
                    setIsLoading(false);
                    return;
                }
            }

            // Update the operation with potentially new file ID
            const payload = {
                ...data,
                fileId,
            };

            delete payload.file; // Remove the file object from payload

            const result = await operationRepository.update(id, payload);

            if (result.success) {
                await tag('operation');
                setIsUpdateOpen(false);
                setSelectedOperation(null);
            } else {
                setError(result.error.message);
            }
        } catch (err) {
            setError('Error al actualizar la operación. Intente nuevamente.');
            console.error('Error updating operation:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteOperation = async (id: string) => {
        setIsLoading(true);
        setError(null);

        try {
            const result = await operationRepository.delete(id);

            if (result.success) {
                await tag('operation');
                setIsDeleteOpen(false);
                setSelectedOperation(null);
            } else {
                setError(result.error.message);
            }
        } catch (err) {
            setError('Error al eliminar la operación. Intente nuevamente.');
            console.error('Error deleting operation:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const openUpdateDialog = (operation: Operation) => {
        setSelectedOperation(operation);
        setIsUpdateOpen(true);
    };

    const openDeleteDialog = (operation: Operation) => {
        setSelectedOperation(operation);
        setIsDeleteOpen(true);
    };

    const openPreviewDialog = (operation: Operation) => {
        setSelectedOperation(operation);
        setIsPreviewOpen(true);
    };

    const getResultClass = (result: Result) => {
        switch (result) {
            case Result.WON:
                return styles.resultWon;
            case Result.LOST:
                return styles.resultLost;
            case Result.BE:
                return styles.resultBE;
            default:
                return '';
        }
    };

    const getResultText = (result: Result) => {
        switch (result) {
            case Result.WON:
                return 'Ganada';
            case Result.LOST:
                return 'Perdida';
            case Result.BE:
                return 'Empate';
            default:
                return result;
        }
    };

    const getTradeTypeText = (type: TradeType) => {
        switch (type) {
            case TradeType.LONG:
                return 'Compra';
            case TradeType.SHORT:
                return 'Venta';
            default:
                return type;
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Operaciones</h1>
                <button
                    className={styles.createButton}
                    onClick={() => setIsCreateOpen(true)}
                >
                    Crear Operación
                </button>
            </div>

            {/* Create Operation Dialog */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent className={styles.dialogWidth}>
                    <DialogHeader>
                        <DialogTitle>Crear Nueva Operación</DialogTitle>
                    </DialogHeader>
                    <CreateOperationForm
                        onSubmit={handleCreateOperation}
                        isLoading={isLoading || isUploading}
                        errorMessage={error}
                        onFileUpload={handleFileUpload}
                    />
                </DialogContent>
            </Dialog>

            {/* Update Operation Dialog */}
            <Dialog open={isUpdateOpen} onOpenChange={setIsUpdateOpen}>
                {selectedOperation && (
                    <DialogContent className={styles.dialogWidth}>
                        <DialogHeader>
                            <DialogTitle>Actualizar Operación</DialogTitle>
                        </DialogHeader>
                        <UpdateOperationForm
                            operation={selectedOperation}
                            onSubmit={handleUpdateOperation}
                            isLoading={isLoading || isUploading}
                            errorMessage={error}
                            symbols={symbols}
                        />
                    </DialogContent>
                )}
            </Dialog>

            {/* Delete Operation Dialog */}
            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                {selectedOperation && (
                    <OperationDeleteConfirmation
                        operation={selectedOperation}
                        onConfirm={handleDeleteOperation}
                        isLoading={isLoading}
                        errorMessage={error}
                    />
                )}
            </Dialog>

            <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
                {selectedOperation && (
                    <DialogContent className={styles.imagePreviewDialog}>
                        <DialogHeader>
                            <DialogTitle>Vista Previa</DialogTitle>
                        </DialogHeader>
                        <div className={styles.imagePreviewContainer}>
                            <Image
                                src={`${selectedOperation.file?.url}`}
                                alt={`Operación ${selectedOperation.id}`}
                                className={styles.previewImage}
                            />
                        </div>
                    </DialogContent>
                )}
            </Dialog>

            <div className={styles.tableContainer}>
                <Table>
                    <TableCaption>Lista de operaciones registradas</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Símbolo</TableHead>
                            <TableHead>Tipo</TableHead>
                            <TableHead>Pips</TableHead>
                            <TableHead>Resultado</TableHead>
                            <TableHead>Fecha</TableHead>
                            <TableHead className={styles.actionsCell}>Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {operations.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className={styles.tableCell}>
                                    No hay operaciones disponibles
                                </TableCell>
                            </TableRow>
                        ) : (
                            operations.map((operation: Operation) => (
                                <TableRow key={operation.id}>
                                    <TableCell className={styles.symbolCell}>{operation.symbol?.name || 'N/A'}</TableCell>
                                    <TableCell>{getTradeTypeText(operation.type)}</TableCell>
                                    <TableCell className={styles.pipsCell}>{operation.pips}</TableCell>
                                    <TableCell>
                                        <span className={`${styles.resultTag} ${getResultClass(operation.result)}`}>
                                            {getResultText(operation.result)}
                                        </span>
                                    </TableCell>
                                    <TableCell>{formatDate(operation.date)}</TableCell>
                                    <TableCell className={styles.actionsCell}>
                                        <div className={styles.actionsContainer}>
                                            <button
                                                className={styles.previewButton}
                                                aria-label="Vista Previa"
                                                onClick={() => openPreviewDialog(operation)}
                                            >
                                                Ver
                                            </button>
                                            <button
                                                className={styles.editButton}
                                                aria-label="Editar"
                                                onClick={() => openUpdateDialog(operation)}
                                            >
                                                Editar
                                            </button>
                                            <button
                                                className={styles.deleteButton}
                                                aria-label="Eliminar"
                                                onClick={() => openDeleteDialog(operation)}
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};
