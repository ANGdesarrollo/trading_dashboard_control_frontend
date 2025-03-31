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
import {Symbol} from "@/features/shared/interfaces";
import {formatDate} from "@/lib/utils";
import React, {useState} from "react";
import { Dialog } from "@radix-ui/react-dialog";
import {SymbolDeleteConfirmation} from "@/features/symbol/molecules/SymbolDeleteConfirmation";
import styles from './symbol-table.module.css';
import {tag} from "@/features/shared/actions/revalidate";
import {symbolRepository} from "@/features/shared/repositories";
import {useRouter} from "next/navigation";

interface Props {
    symbols: Symbol[];
}

export const SymbolTable = ({symbols}: Props) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedSymbol, setSelectedSymbol] = useState<Symbol | null>(null);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleDeleteSymbol = async (id: string) => {
        setIsLoading(true);
        setError(null);

        try {
            const result = await symbolRepository.delete(id);

            if (result.success) {
                await tag('symbol')
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
                    onClick={() => router.push('/symbol/create')}
                >
                    Crear Símbolo
                </button>
            </div>

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
                                                onClick={() => router.push(`/symbol/update?id=${symbol.id}`)}
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
