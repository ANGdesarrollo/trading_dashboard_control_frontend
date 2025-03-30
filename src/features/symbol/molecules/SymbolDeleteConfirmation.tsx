'use client';

import React from 'react';
import {
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/features/shared/molecules/Dialog";
import styles from './symbol-delete-confirmation.module.css';
import { Symbol } from '@/features/shared/interfaces';

interface DeleteConfirmationProps {
    symbol: Symbol;
    onConfirm: (id: string) => Promise<void>;
    isLoading?: boolean;
    errorMessage?: string | null;
}

export const SymbolDeleteConfirmation: React.FC<DeleteConfirmationProps> = ({
                                                                                symbol,
                                                                                onConfirm,
                                                                                isLoading = false,
                                                                                errorMessage = null,
                                                                            }) => {
    return (
        <DialogContent className={styles.dialogWidth}>
            <DialogHeader>
                <DialogTitle>Eliminar Símbolo</DialogTitle>
            </DialogHeader>

            <div className={styles.content}>
                {errorMessage && (
                    <div className={styles.formError}>
                        {errorMessage}
                    </div>
                )}

                <p className={styles.warningText}>
                    ¿Estás seguro que deseas eliminar el símbolo <strong>{symbol.name}</strong>?
                </p>
                <p className={styles.warningDescription}>
                    Esta acción no se puede deshacer. El símbolo será eliminado permanentemente del sistema.
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
                    onClick={() => onConfirm(symbol.id)}
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
                        'Eliminar Símbolo'
                    )}
                </button>
            </DialogFooter>
        </DialogContent>
    );
};
