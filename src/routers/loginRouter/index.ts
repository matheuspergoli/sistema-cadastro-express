import { z } from 'zod'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { Router } from 'express'
import { prisma } from '../../utils/prisma'
import { loginSchema } from '../../validations/loginValidation'

export const loginRouter = Router()

loginRouter.all('/login', (request, response, next) => {
	response.header('Access-Control-Allow-Origin', '*')
	response.header('Access-Control-Allow-Methods', 'POST')
	response.header('Access-Control-Allow-Headers', 'Content-Type')
	if (request.method === 'POST') {
		next()
	} else {
		response.status(405).end(`Method ${request.method} Not Allowed`)
	}
})

loginRouter.post('/login', async (request, response) => {
	try {
		const { email, password } = loginSchema.parse(request.body)

		if (!email || !password) {
			return response.status(405).json({ message: 'Todos os campos devem ser preenchidos' })
		}

		const user = await prisma.user.findUnique({
			where: {
				email: email
			}
		})

		if (!user) {
			return response.status(405).json({ message: 'Usuário não encontrado' })
		}

		const isPasswordCorrect = await bcrypt.compare(password, user.password)

		if (!isPasswordCorrect) {
			return response.status(405).json({ message: 'Senha incorreta' })
		}

		const secret = process.env.JWT_SECRET as string
		const token = jwt.sign({ user }, secret, {
			expiresIn: '7d'
		})

		return response.status(200).json({
			id: user.id,
			name: user.name,
			email: user.email,
			token: token
		})
	} catch (error) {
		if (error instanceof z.ZodError) {
			return response.status(405).json({ message: error.issues[0].message })
		}
	}
})
