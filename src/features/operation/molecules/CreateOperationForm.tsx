'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';
import { OperationDto, TradeType, Result } from '@/features/shared/interfaces';
import styles from './operation-create-form.module.css';
import {operationSchema} from "@/features/operation/schemas/OperationSchema";
import {Symbol} from "@/features/shared/interfaces";

interface CreateOperationFormProps {
    onSubmit: (data: OperationDto & { file?: File }) => Promise<void>;
    onFileUpload?: (file: File) => Promise<string | null | undefined>;
    isLoading?: boolean;
    errorMessage?: string | null;
    symbols: Symbol[];
}

export const CreateOperationForm: React.FC<CreateOperationFormProps> = ({
                                                                            onSubmit,
                                                                            onFileUpload,
                                                                            isLoading = false,
                                                                            errorMessage = null,
                                                                            symbols
                                                                        }) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors }
    } = useForm<OperationDto & { file?: File }>({
        resolver: joiResolver(operationSchema),
        defaultValues: {
            symbolId: '',
            type: TradeType.LONG,
            pips: 0,
            result: Result.WON,
            date: new Date(),
            description: ''
        }
    });

    const handleFileChange =  async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);
            setValue('file', file);

            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);

            if (onFileUpload) {
                await onFileUpload(file);
            }
        }
    };

    const handleFormSubmit = async (data: OperationDto & { file?: File }) => {
        if (selectedFile) {
            data.file = selectedFile;
        }
        await onSubmit(data);
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)}>
            {errorMessage && (
                <div className={styles.formError}>
                    {errorMessage}
                </div>
            )}

            <div className={styles.formGroup}>
                <label htmlFor="symbolId" className={styles.formLabel}>
                    Símbolo
                </label>
                <select
                    id="symbolId"
                    {...register('symbolId')}
                    className={`${styles.formSelect} ${
                        errors.symbolId ? styles.formInputError : styles.formInputValid
                    }`}
                >
                    <option value="">Seleccione un símbolo</option>
                    {symbols.map((symbol) => (
                        <option key={symbol.id} value={symbol.id}>
                            {symbol.name}
                        </option>
                    ))}
                </select>
                {errors.symbolId && (
                    <p className={styles.errorMessage}>
                        {errors.symbolId.message}
                    </p>
                )}
            </div>

            <div className={styles.formRow}>
                <div className={styles.formGroup}>
                    <label htmlFor="type" className={styles.formLabel}>
                        Tipo de Operación
                    </label>
                    <select
                        id="type"
                        {...register('type')}
                        className={`${styles.formSelect} ${
                            errors.type ? styles.formInputError : styles.formInputValid
                        }`}
                    >
                        <option value={TradeType.LONG}>Compra (Long)</option>
                        <option value={TradeType.SHORT}>Venta (Short)</option>
                    </select>
                    {errors.type && (
                        <p className={styles.errorMessage}>
                            {errors.type.message}
                        </p>
                    )}
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="result" className={styles.formLabel}>
                        Resultado
                    </label>
                    <select
                        id="result"
                        {...register('result')}
                        className={`${styles.formSelect} ${
                            errors.result ? styles.formInputError : styles.formInputValid
                        }`}
                    >
                        <option value={Result.WON}>Ganada</option>
                        <option value={Result.LOST}>Perdida</option>
                        <option value={Result.BE}>Empate (Break Even)</option>
                    </select>
                    {errors.result && (
                        <p className={styles.errorMessage}>
                            {errors.result.message}
                        </p>
                    )}
                </div>
            </div>

            <div className={styles.formRow}>
                <div className={styles.formGroup}>
                    <label htmlFor="pips" className={styles.formLabel}>
                        Pips
                    </label>
                    <input
                        id="pips"
                        type="number"
                        {...register('pips', { valueAsNumber: true })}
                        className={`${styles.formInput} ${
                            errors.pips ? styles.formInputError : styles.formInputValid
                        }`}
                        min="0"
                        step="1"
                    />
                    {errors.pips && (
                        <p className={styles.errorMessage}>
                            {errors.pips.message}
                        </p>
                    )}
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="date" className={styles.formLabel}>
                        Fecha
                    </label>
                    <input
                        id="date"
                        type="date"
                        {...register('date')}
                        className={`${styles.formInput} ${
                            errors.date ? styles.formInputError : styles.formInputValid
                        }`}
                    />
                    {errors.date && (
                        <p className={styles.errorMessage}>
                            {errors.date.message}
                        </p>
                    )}
                </div>
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="file" className={styles.formLabel}>
                    Imagen de Operación
                </label>
                <input
                    id="file"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className={styles.fileInput}
                />
                {previewUrl && (
                    <div className={styles.previewContainer}>
                        <img
                            src={previewUrl}
                            alt="Vista previa"
                            className={styles.previewImage}
                        />
                    </div>
                )}
                <p className={styles.helperText}>
                    Sube una captura de pantalla u otra imagen de la operación
                </p>
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="description" className={styles.formLabel}>
                    Descripción
                </label>
                <textarea
                    id="description"
                    {...register('description')}
                    className={`${styles.formTextarea} ${
                        errors.description ? styles.formInputError : styles.formInputValid
                    }`}
                    rows={4}
                    placeholder="Agrega detalles sobre tu operación..."
                />
                {errors.description && (
                    <p className={styles.errorMessage}>
                        {errors.description.message}
                    </p>
                )}
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
                            Creando...
                        </span>
                    ) : (
                        'Crear Operación'
                    )}
                </button>
            </div>
        </form>
    );
};
