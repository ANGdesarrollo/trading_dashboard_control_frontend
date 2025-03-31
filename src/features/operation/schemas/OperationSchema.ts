import Joi from "joi";
import { TradeType, Result } from "@/features/shared/interfaces";

export const operationSchema = Joi.object({
    symbolId: Joi.string()
        .required()
        .uuid()
        .messages({
            'string.empty': 'El símbolo es requerido',
            'string.uuid': 'El formato del ID del símbolo es inválido',
            'any.required': 'El símbolo es requerido'
        }),

    fileId: Joi.string()
        .uuid()
        .optional()
        .messages({
            'string.uuid': 'El formato del ID de la imagen es inválido'
        }),

    file: Joi.any().optional(),

    type: Joi.string()
        .required()
        .valid(TradeType.LONG, TradeType.SHORT)
        .messages({
            'string.empty': 'El tipo de operación es requerido',
            'any.only': 'El tipo de operación debe ser LONG o SHORT',
            'any.required': 'El tipo de operación es requerido'
        }),

    pips: Joi.number()
        .required()
        .min(0)
        .integer()
        .messages({
            'number.base': 'Los pips deben ser un número',
            'number.min': 'Los pips deben ser un número positivo',
            'number.integer': 'Los pips deben ser un número entero',
            'any.required': 'Los pips son requeridos'
        }),

    result: Joi.string()
        .required()
        .valid(Result.WON, Result.LOST, Result.BE)
        .messages({
            'string.empty': 'El resultado es requerido',
            'any.only': 'El resultado debe ser WON, LOST o BE',
            'any.required': 'El resultado es requerido'
        }),

    description: Joi.string()
        .optional()
        .allow('')
        .max(1000)
        .messages({
            'string.max': 'La descripción no debe exceder {#limit} caracteres'
        }),

    date: Joi.date()
        .required()
        .messages({
            'date.base': 'La fecha debe ser válida',
            'any.required': 'La fecha es requerida'
        })
});
