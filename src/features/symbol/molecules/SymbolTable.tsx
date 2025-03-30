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
import {Symbol, SymbolDto, UpdateSymbolDto} from "@/features/shared/interfaces";
import {formatDate} from "@/lib/utils";
import React, {useState} from "react";
import {CreateSymbolForm} from "@/features/symbol/molecules/SymbolCreateForm";
import {symbolRepository} from "@/features/shared/repositories";
import { Dialog } from "@radix-ui/react-dialog";
import {DialogContent, DialogHeader, DialogTitle} from "@/features/shared/molecules/Dialog";
import {UpdateSymbolForm} from "@/features/symbol/molecules/SymbolUpdateForm";
import {SymbolDeleteConfirmation} from "@/features/symbol/molecules/SymbolDeleteConfirmation";
import styles from './symbol-table.module.css';
import {useRouter} from "next/navigation";

interface Props {
    symbols: Symbol[];
}

export const SymbolTable = ({symbols}: Props) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isUpdateOpen, setIsUpdateOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedSymbol, setSelectedSymbol] = useState<Symbol | null>(null);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleCreateSymbol = async (data: SymbolDto) => {
        setIsLoading(true);
        setError(null);

        try {
            const result = await symbolRepository.create(data);

            if (result.success) {
                router.refresh();
                setIsCreateOpen(false);
            } else {
                setError(result.error.message);
            }
        } catch (err) {
            setError('Error al crear el símbolo. Intente nuevamente.');
            console.error('Error creating symbol:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateSymbol = async (id: string, data: UpdateSymbolDto) => {
        setIsLoading(true);
        setError(null);

        try {
            const result = await symbolRepository.update(id, data);

            if (result.success) {
                router.refresh();
                setIsUpdateOpen(false);
                setSelectedSymbol(null);
            } else {
                setError(result.error.message);
            }
        } catch (err) {
            setError('Error al actualizar el símbolo. Intente nuevamente.');
            console.error('Error updating symbol:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteSymbol = async (id: string) => {
        setIsLoading(true);
        setError(null);

        try {
            const result = await symbolRepository.delete(id);

            if (result.success) {
                router.refresh();
                setIsDeleteOpen(false);
                setSelectedSymbol(null);
            } else {
                setError(result.error.message);
            }
        } catch (err) {
            setError('Error al eliminar el símbolo. Intente nuevamente.');
            console.error('Error deleting symbol:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const openUpdateDialog = (symbol: Symbol) => {
        setSelectedSymbol(symbol);
        setIsUpdateOpen(true);
    };

    const openDeleteDialog = (symbol: Symbol) => {
        setSelectedSymbol(symbol);
        setIsDeleteOpen(true);
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Símbolos</h1>
                <button
                    className={styles.createButton}
                    onClick={() => setIsCreateOpen(true)}
                >
                    Crear Símbolo
                </button>
            </div>

            {/* Create Symbol Dialog */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent className={styles.dialogWidth}>
                    <DialogHeader>
                        <DialogTitle>Crear Nuevo Símbolo</DialogTitle>
                    </DialogHeader>
                    <CreateSymbolForm
                        onSubmit={handleCreateSymbol}
                        isLoading={isLoading}
                        errorMessage={error}
                    />
                </DialogContent>
            </Dialog>

            {/* Update Symbol Dialog */}
            <Dialog open={isUpdateOpen} onOpenChange={setIsUpdateOpen}>
                {selectedSymbol && (
                    <DialogContent className={styles.dialogWidth}>
                        <DialogHeader>
                            <DialogTitle>Actualizar Símbolo</DialogTitle>
                        </DialogHeader>
                        <UpdateSymbolForm
                            symbol={selectedSymbol}
                            onSubmit={handleUpdateSymbol}
                            isLoading={isLoading}
                            errorMessage={error}
                        />
                    </DialogContent>
                )}
            </Dialog>

            {/* Delete Symbol Dialog */}
            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                {selectedSymbol && (
                    <SymbolDeleteConfirmation
                        symbol={selectedSymbol}
                        onConfirm={handleDeleteSymbol}
                        isLoading={isLoading}
                        errorMessage={error}
                    />
                )}
            </Dialog>

            <div className={styles.tableContainer}>
                <Table>
                    <TableCaption>Lista de símbolos disponibles</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Nombre</TableHead>
                            <TableHead>Fecha de creación</TableHead>
                            <TableHead>Última actualización</TableHead>
                            <TableHead className={styles.actionsCell}>Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {symbols.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className={styles.tableCell}>
                                    No hay símbolos disponibles
                                </TableCell>
                            </TableRow>
                        ) : (
                            symbols.map((symbol: Symbol) => (
                                <TableRow key={symbol.id}>
                                    <TableCell className={styles.idCell}>{symbol.id.substring(0, 8)}...</TableCell>
                                    <TableCell className={styles.nameCell}>{symbol.name}</TableCell>
                                    <TableCell>{formatDate(symbol.createdAt)}</TableCell>
                                    <TableCell>{formatDate(symbol.updatedAt)}</TableCell>
                                    <TableCell className={styles.actionsCell}>
                                        <div className={styles.actionsContainer}>
                                            <button
                                                className={styles.editButton}
                                                aria-label="Editar"
                                                onClick={() => openUpdateDialog(symbol)}
                                            >
                                                Editar
                                            </button>
                                            <button
                                                className={styles.deleteButton}
                                                aria-label="Eliminar"
                                                onClick={() => openDeleteDialog(symbol)}
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
