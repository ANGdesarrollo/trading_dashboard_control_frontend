"use client";

import React, { useState, useMemo } from "react";
import {
    Table, TableBody, TableCaption, TableCell,
    TableHead, TableHeader, TableRow,
} from "@/features/shared/organisms/Table";
import { Operation, Symbol, Result } from "@/features/shared/interfaces";
import { formatDate } from "@/lib/utils";
import { Dialog } from "@radix-ui/react-dialog";
import {
    DialogContent, DialogHeader, DialogTitle,
} from "@/features/shared/molecules/Dialog";
import { OperationDeleteConfirmation } from "@/features/operation/molecules/OperationDeleteConfirmation";
import { OperationForm } from "@/features/operation/molecules/OperationForm";
import Image from "next/image";

import styles from "./operation-table.module.css";
import { useOperations } from "@/features/operation/hooks/useOperations";
import { getResultText, getTradeTypeText } from "@/features/operation/utils/operation";

interface Props {
    operations: Operation[];
    symbols: Symbol[];
}

export const OperationTable = ({ operations, symbols }: Props) => {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isUpdateOpen, setIsUpdateOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [selectedOperation, setSelectedOperation] = useState<Operation | null>(null);
    const [selectedSymbolId, setSelectedSymbolId] = useState<string>('all');

    const {
        isLoading,
        error,
        create,
        update,
        remove,
        handleFileUpload,
        setError,
    } = useOperations();

    // Filtrar operaciones según el símbolo seleccionado
    const filteredOperations = useMemo(() => {
        if (selectedSymbolId === 'all') {
            return operations;
        }
        return operations.filter(op => op.symbolId === selectedSymbolId);
    }, [operations, selectedSymbolId]);

    // Calcular estadísticas
    const stats = useMemo(() => {
        const totalOps = filteredOperations.length;
        const wins = filteredOperations.filter(op => op.result === Result.WON).length;
        const losses = filteredOperations.filter(op => op.result === Result.LOST).length;

        // Calcular pips totales (wins - losses)
        let totalPips = 0;
        filteredOperations.forEach(op => {
            if (op.result === Result.WON) {
                totalPips += op.pips;
            } else if (op.result === Result.LOST) {
                totalPips -= op.pips;
            }
            // Para BE (break even) no modificamos los pips
        });

        // Calcular porcentaje de victorias (si hay operaciones)
        const winRate = totalOps > 0 ? (wins / totalOps) * 100 : 0;

        return {
            totalOps,
            wins,
            losses,
            winRate,
            totalPips
        };
    }, [filteredOperations]);

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

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Operaciones</h1>
                <button
                    className={styles.createButton}
                    onClick={() => {
                        setSelectedOperation(null);
                        setIsCreateOpen(true);
                        setError(null);
                    }}
                >
                    Crear Operación
                </button>
            </div>

            {/* Filtro y Estadísticas */}
            <div className={styles.filtersAndStats}>
                <div className={styles.filterSection}>
                    <label htmlFor="symbolFilter" className={styles.filterLabel}>
                        Filtrar por símbolo:
                    </label>
                    <select
                        id="symbolFilter"
                        value={selectedSymbolId}
                        onChange={(e) => setSelectedSymbolId(e.target.value)}
                        className={styles.symbolFilter}
                    >
                        <option value="all">Todos los símbolos</option>
                        {symbols.map((symbol) => (
                            <option key={symbol.id} value={symbol.id}>
                                {symbol.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className={styles.statsPanel}>
                    <div className={styles.statItem}>
                        <span className={styles.statLabel}>Win Rate:</span>
                        <span className={styles.statValue}>
                            {stats.winRate.toFixed(2)}%
                        </span>
                    </div>
                    <div className={styles.statItem}>
                        <span className={styles.statLabel}>Operaciones:</span>
                        <span className={styles.statValue}>
                            {stats.wins} W / {stats.losses} L / {stats.totalOps - stats.wins - stats.losses} BE
                        </span>
                    </div>
                    <div className={styles.statItem}>
                        <span className={styles.statLabel}>Total Pips:</span>
                        <span className={`${styles.statValue} ${stats.totalPips >= 0 ? styles.positiveValue : styles.negativeValue}`}>
                            {stats.totalPips}
                        </span>
                    </div>
                </div>
            </div>

            {/* Diálogo de creación */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent className={styles.dialogWidth}>
                    <DialogHeader>
                        <DialogTitle>Crear Nueva Operación</DialogTitle>
                    </DialogHeader>
                    <OperationForm
                        onSubmit={async (data) => {
                            await create(data);
                            setIsCreateOpen(false);
                        }}
                        isLoading={isLoading}
                        errorMessage={error}
                        onFileUpload={handleFileUpload}
                        symbols={symbols}
                    />
                </DialogContent>
            </Dialog>

            {/* Diálogo de edición */}
            <Dialog open={isUpdateOpen} onOpenChange={setIsUpdateOpen}>
                {selectedOperation && (
                    <DialogContent className={styles.dialogWidth}>
                        <DialogHeader>
                            <DialogTitle>Actualizar Operación</DialogTitle>
                        </DialogHeader>
                        <OperationForm
                            operation={selectedOperation}
                            onSubmit={async (data, id) => {
                                await update(data, id!);
                                setIsUpdateOpen(false);
                                setSelectedOperation(null);
                            }}
                            isLoading={isLoading}
                            errorMessage={error}
                            symbols={symbols}
                        />
                    </DialogContent>
                )}
            </Dialog>

            {/* Diálogo de eliminación */}
            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                {selectedOperation && (
                    <OperationDeleteConfirmation
                        operation={selectedOperation}
                        onConfirm={async (id) => {
                            await remove(id);
                            setIsDeleteOpen(false);
                            setSelectedOperation(null);
                        }}
                        isLoading={isLoading}
                        errorMessage={error}
                    />
                )}
            </Dialog>

            {/* Diálogo de vista previa */}
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
                                width={500}
                                height={300}
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
                        {filteredOperations.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className={styles.tableCell}>
                                    No hay operaciones disponibles
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredOperations.map((operation) => (
                                <TableRow key={operation.id}>
                                    <TableCell>{operation.symbol?.name || "N/A"}</TableCell>
                                    <TableCell>{getTradeTypeText(operation.type)}</TableCell>
                                    <TableCell>{operation.pips}</TableCell>
                                    <TableCell>
                                        <span className={`${styles.resultTag} ${styles[`result${operation.result}`.toLowerCase()]}`}>
                                            {getResultText(operation.result)}
                                        </span>
                                    </TableCell>
                                    <TableCell>{formatDate(operation.date)}</TableCell>
                                    <TableCell className={styles.actionsCell}>
                                        <div className={styles.actionsContainer}>
                                            <button
                                                className={styles.previewButton}
                                                onClick={() => openPreviewDialog(operation)}
                                            >
                                                Ver
                                            </button>
                                            <button
                                                className={styles.editButton}
                                                onClick={() => openUpdateDialog(operation)}
                                            >
                                                Editar
                                            </button>
                                            <button
                                                className={styles.deleteButton}
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
