import Joi from "joi";

export const symbolSchema = Joi.object({
    name: Joi.string()
        .required()
        .min(1)
        .max(10)
        .pattern(/^[A-Za-z0-9/]+$/)
        .messages({
            'string.empty': 'El nombre del símbolo es requerido',
            'string.min': 'El nombre debe tener al menos {#limit} caracteres',
            'string.max': 'El nombre no debe exceder {#limit} caracteres',
            'string.pattern.base': 'El nombre solo puede contener letras, números y /',
            'any.required': 'El nombre del símbolo es requerido'
        })
});
