'use client';

import React from 'react';
import {
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/features/shared/molecules/Dialog";
import styles from './operation-delete-confirmation.module.css';
import { Operation } from '@/features/shared/interfaces';

interface DeleteConfirmationProps {
    operation: Operation;
    onConfirm: (id: string) => Promise<void>;
    isLoading?: boolean;
    errorMessage?: string | null;
}

export const OperationDeleteConfirmation: React.FC<DeleteConfirmationProps> = ({
                                                                                   operation,
                                                                                   onConfirm,
                                                                                   isLoading = false,
                                                                                   errorMessage = null,
                                                                               }) => {
    return (
        <DialogContent className={styles.dialogWidth}>
            <DialogHeader>
                <DialogTitle>Eliminar Operación</DialogTitle>
            </DialogHeader>

            <div className={styles.content}>
                {errorMessage && (
                    <div className={styles.formError}>
                        {errorMessage}
                    </div>
                )}

                <p className={styles.warningText}>
                    ¿Estás seguro que deseas eliminar esta operación?
                </p>

                <div className={styles.operationDetails}>
                    <p><strong>Símbolo:</strong> {operation.symbol?.name || 'N/A'}</p>
                    <p><strong>Tipo:</strong> {operation.type === 'LONG' ? 'Compra' : 'Venta'}</p>
                    <p><strong>Pips:</strong> {operation.pips}</p>
                    <p><strong>Resultado:</strong> {
                        operation.result === 'WON'
                            ? 'Ganada'
                            : operation.result === 'LOST'
                                ? 'Perdida'
                                : 'Empate'
                    }</p>
                </div>

                <p className={styles.warningDescription}>
                    Esta acción no se puede deshacer. La operación será eliminada permanentemente del sistema.
                </p>
            </div>

            <DialogFooter className={styles.footer}>
                <button
                    className={styles.cancelButton}
                    type="button"
                    onClick={(e) => {
                        e.preventDefault();
                        // Close dialog is handled by Radix Dialog component
                    }}
                >
                    Cancelar
                </button>
                <button
                    className={styles.deleteButton}
                    type="button"
                    disabled={isLoading}
                    onClick={() => onConfirm(operation.id)}
                >
                    {isLoading ? (
                        <span className={styles.loadingSpinner}>
                            <svg className={styles.loadingIcon} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Eliminando...
                        </span>
                    ) : (
                        'Eliminar Operación'
                    )}
                </button>
            </DialogFooter>
        </DialogContent>
    );
};
