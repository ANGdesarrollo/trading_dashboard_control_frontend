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
import {Symbol, SymbolDto} from "@/features/shared/interfaces";
import {formatDate} from "@/lib/utils";
import React, {useState} from "react";
import {CreateSymbolForm} from "@/features/symbol/molecules/SymbolCreateForm";
import {symbolRepository} from "@/features/shared/repositories";
import {revalidate} from "@/features/shared/utls/revalidate";
import { Dialog } from "@radix-ui/react-dialog";
import {DialogContent, DialogHeader, DialogTitle} from "@/features/shared/molecules/Dialog";
import styles from './symbol-table.module.css';

interface Props {
    symbols: Symbol[];
}

export const SymbolTable = ({symbols}: Props) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleCreateSymbol = async (data: SymbolDto) => {
        setIsLoading(true);
        setError(null);

        await symbolRepository.create(data);
        await revalidate('/symbol');
        setIsOpen(false);
        setIsLoading(false);
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Símbolos</h1>
                <button
                    className={styles.createButton}
                    onClick={() => setIsOpen(true)}
                >
                    Crear Símbolo
                </button>
            </div>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
                                            >
                                                Editar
                                            </button>
                                            <button
                                                className={styles.deleteButton}
                                                aria-label="Eliminar"
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
