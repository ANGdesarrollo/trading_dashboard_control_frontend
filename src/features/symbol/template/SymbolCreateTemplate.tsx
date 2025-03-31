'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CreateSymbolForm } from "@/features/symbol/molecules/SymbolCreateForm";
import { symbolRepository } from "@/features/shared/repositories";
import { SymbolDto } from "@/features/shared/interfaces";
import { tag } from "@/features/shared/actions/revalidate";
import styles from './symbol-create-template.module.css';

export const SymbolCreateTemplate = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleCreateSymbol = async (data: SymbolDto) => {
        setIsLoading(true);
        setError(null);

        try {
            const result = await symbolRepository.create(data);

            if (result.success) {
                await tag('symbol');
                router.push('/symbol');
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

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Crear Nuevo Símbolo</h1>
                <button
                    className={styles.backButton}
                    onClick={() => router.push('/symbol')}
                >
                    Volver
                </button>
            </div>
            <div className={styles.formContainer}>
                <CreateSymbolForm
                    onSubmit={handleCreateSymbol}
                    isLoading={isLoading}
                    errorMessage={error}
                />
            </div>
        </div>
    );
}
