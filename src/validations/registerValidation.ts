import { z } from 'zod'

export const resgiterSchema = z.object({
	name: z
		.string({
			invalid_type_error: 'Nome deve ser uma string',
			required_error: 'Nome é obrigatório'
		})
		.min(1, {
			message: 'Nome deve ter no mínimo 1 caractere'
		})
		.trim(),

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
			required_error: 'Senha é obrigatória'
		})
		.min(8, {
			message: 'Senha deve ter no mínimo 8 caracteres'
		})
		.trim()
})
