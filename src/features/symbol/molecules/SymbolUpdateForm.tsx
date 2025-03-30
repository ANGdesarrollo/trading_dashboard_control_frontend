'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';
import { Symbol, UpdateSymbolDto } from '@/features/shared/interfaces';
import { symbolSchema } from "@/features/symbol/schemas/SymbolSchema";
import styles from './symbol-update-form.module.css';

interface UpdateSymbolFormProps {
    symbol: Symbol;
    onSubmit: (id: string, data: UpdateSymbolDto) => Promise<void>;
    isLoading?: boolean;
    errorMessage?: string | null;
}

export const UpdateSymbolForm: React.FC<UpdateSymbolFormProps> = ({
                                                                      symbol,
                                                                      onSubmit,
                                                                      isLoading = false,
                                                                      errorMessage = null,
                                                                  }) => {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<UpdateSymbolDto>({
        resolver: joiResolver(symbolSchema),
        defaultValues: {
            name: symbol.name
        }
    });

    const handleFormSubmit = (data: UpdateSymbolDto) => {
        onSubmit(symbol.id, data);
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)}>
            {errorMessage && (
                <div className={styles.formError}>
                    {errorMessage}
                </div>
            )}

            <div className={styles.formGroup}>
                <label htmlFor="name" className={styles.formLabel}>
                    Nombre del Símbolo
                </label>
                <input
                    id="name"
                    {...register('name')}
                    className={`${styles.formInput} ${
                        errors.name ? styles.formInputError : styles.formInputValid
                    }`}
                    placeholder="Ej: EURUSD, BTCUSD, AAPL"
                />
                {errors.name && (
                    <p className={styles.errorMessage}>
                        {errors.name.message}
                    </p>
                )}
                <p className={styles.helperText}>
                    Solo letras, números y / son permitidos (ej: EUR/USD)
                </p>
            </div>

            <div className={styles.formActions}>
                <button
                    type="submit"
                    className={styles.submitButton}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <span className={styles.loadingSpinner}>
                            <svg className={styles.loadingIcon} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Actualizando...
                        </span>
                    ) : (
                        'Actualizar Símbolo'
                    )}
                </button>
            </div>
        </form>
    );
};
