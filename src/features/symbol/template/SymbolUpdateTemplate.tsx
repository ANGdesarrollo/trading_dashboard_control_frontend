import React from 'react';
import { symbolRepository } from "@/features/shared/repositories";
import styles from './symbol-update-template.module.css';
import {UpdateSymbolFormContainer} from "@/features/symbol/molecules/UpdateSymbolFormContainer";

interface Props {
    id: string;
}

export const SymbolUpdateTemplate = async ({ id }: Props) => {
    const result = await symbolRepository.getById(id);
    const symbol = result.success ? result.data : null;
    const errorMessage = result.success ? null : result.error.message;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Actualizar Símbolo</h1>
            </div>
            <div className={styles.formContainer}>
                {errorMessage && !symbol && (
                    <div className={styles.errorMessage}>
                        {errorMessage}
                    </div>
                )}

                {symbol ? (
                    <UpdateSymbolFormContainer symbol={symbol} />
                ) : !errorMessage && (
                    <div className={styles.errorMessage}>
                        Símbolo no encontrado
                    </div>
                )}
            </div>
        </div>
    );
}
