'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UpdateSymbolForm } from "@/features/symbol/molecules/SymbolUpdateForm";
import { symbolRepository } from "@/features/shared/repositories";
import { Symbol, UpdateSymbolDto } from "@/features/shared/interfaces";
import { tag } from "@/features/shared/actions/revalidate";

interface Props {
    symbol: Symbol;
}

export const UpdateSymbolFormContainer: React.FC<Props> = ({ symbol }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleUpdateSymbol = async (id: string, data: UpdateSymbolDto) => {
        setIsLoading(true);
        setError(null);

        try {
            const result = await symbolRepository.update(id, data);

            if (result.success) {
                await tag('symbol');
                router.push('/symbol');
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

    return (
        <>
            <UpdateSymbolForm
                symbol={symbol}
                onSubmit={handleUpdateSymbol}
                isLoading={isLoading}
                errorMessage={error}
            />
            <div className="mt-4 flex justify-start">
                <button
                    className="bg-secondary text-secondary-foreground px-4 py-2 rounded-md hover:bg-secondary/90 transition-colors"
                    onClick={() => router.push('/symbol')}
                >
                    Volver
                </button>
            </div>
        </>
    );
};
