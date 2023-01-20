import { rest } from 'msw'
import { fetch } from 'cross-fetch'
import { setupServer } from 'msw/node'
import { it, expect, describe, afterAll, afterEach, beforeAll } from 'vitest'

global.fetch = fetch

const server = setupServer()

describe('POST /register', () => {
	beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
	afterEach(() => server.resetHandlers())
	afterAll(() => server.close())

	it('Deve retornar um erro se não passar um nome', async () => {
		server.use(
			rest.post('http://localhost:3000/register', async (req, res, ctx) => {
				return res(ctx.status(200), ctx.json({ message: 'Nome é obrigatório' }))
			})
		)

		const response = await fetch('http://localhost:3000/register', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				name: '',
				email: 'matheus@email.com',
				password: '12345678'
			})
		})

		const data = await response.json()

		expect(data).toEqual({ message: 'Nome é obrigatório' })
	})

	it('Deve retornar um erro se não passar uma senha com 8 caracteres', async () => {
		server.use(
			rest.post('http://localhost:3000/register', async (req, res, ctx) => {
				return res(ctx.status(200), ctx.json({ message: 'Senha deve ter no mínimo 8 caracteres' }))
			})
		)

		const response = await fetch('http://localhost:3000/register', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				name: 'Matheus',
				email: 'matheus@email.com',
				password: '1234567'
			})
		})

		const data = await response.json()

		expect(data).toEqual({ message: 'Senha deve ter no mínimo 8 caracteres' })
	})

	it('Deve retornar um erro se não passar um email válido', async () => {
		server.use(
			rest.post('http://localhost:3000/register', async (req, res, ctx) => {
				return res(ctx.status(200), ctx.json({ message: 'Email inválido' }))
			})
		)

		const response = await fetch('http://localhost:3000/register', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				name: 'Matheus',
				email: 'matheusemail.com',
				password: '12345678'
			})
		})

		const data = await response.json()

		expect(data).toEqual({ message: 'Email inválido' })
	})
})
