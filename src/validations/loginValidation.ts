import { z } from 'zod'

export const loginSchema = z.object({
	email: z
		.string({
			invalid_type_error: 'Email deve ser uma string',
			required_error: 'Email é obrigatório'
		})
		.email({
			message: 'Email inválido'
		})
		.trim(),

	password: z
		.string({
			invalid_type_error: 'Senha deve ser uma string',
			required_error: 'Senha é obrigatório'
		})
		.min(8, {
			message: 'Senha deve ter no mínimo 8 caracteres'
		})
		.trim()
})
