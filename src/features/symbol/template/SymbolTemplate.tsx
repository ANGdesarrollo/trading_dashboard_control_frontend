import React from "react";
import { symbolRepository } from "@/features/shared/repositories";
import { Symbol } from "@/features/shared/interfaces";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/features/shared/organisms/Table";
import { formatDate } from "@/lib/utils";


export const SymbolTemplate = async () => {
    const result = await symbolRepository.getAll();
    const symbols = result.success ? result.data : [];

    return (
        <div className="container mx-auto py-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Símbolos</h1>
                <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md">
                    Crear Símbolo
                </button>
            </div>

            <div className="bg-card rounded-lg shadow-sm">
                <Table>
                    <TableCaption>Lista de símbolos disponibles</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Nombre</TableHead>
                            <TableHead>Fecha de creación</TableHead>
                            <TableHead>Última actualización</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {symbols.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-4">
                                    No hay símbolos disponibles
                                </TableCell>
                            </TableRow>
                        ) : (
                            symbols.map((symbol: Symbol) => (
                                <TableRow key={symbol.id}>
                                    <TableCell className="font-mono text-xs">{symbol.id.substring(0, 8)}...</TableCell>
                                    <TableCell className="font-medium">{symbol.name}</TableCell>
                                    <TableCell>{formatDate(symbol.createdAt)}</TableCell>
                                    <TableCell>{formatDate(symbol.updatedAt)}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                className="bg-accent text-accent-foreground p-2 rounded-md"
                                                aria-label="Editar"
                                            >
                                                Editar
                                            </button>
                                            <button
                                                className="bg-destructive text-destructive-foreground p-2 rounded-md"
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
