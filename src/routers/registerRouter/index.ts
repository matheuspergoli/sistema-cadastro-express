import { z } from 'zod'
import bcrypt from 'bcrypt'
import { Router } from 'express'
import { prisma } from '../../utils/prisma'
import { resgiterSchema } from '../../validations/registerValidation'

export const registerRouter = Router()

registerRouter.all('/register', (request, response, next) => {
	response.header('Access-Control-Allow-Origin', '*')
	response.header('Access-Control-Allow-Methods', 'POST')
	response.header('Access-Control-Allow-Headers', 'Content-Type')
	if (request.method === 'POST') {
		next()
	} else {
		response.status(405).end(`Method ${request.method} Not Allowed`)
	}
})

registerRouter.post('/register', async (request, response) => {
	try {
		const { name, email, password } = resgiterSchema.parse(request.body)

		if (!name || !email || !password) {
			return response.status(405).json({ message: 'Todos os campos devem ser preenchidos' })
		}

		const usersExists = await prisma.user.findUnique({
			where: {
				email: email
			}
		})

		if (usersExists) {
			return response.status(405).json({ message: 'Usuário já cadastrado' })
		}

		const genSalt = await bcrypt.genSalt(10)
		const hashedPassword = await bcrypt.hash(password, genSalt)

		const user = await prisma.user.create({
			data: {
				name: name,
				email: email,
				password: hashedPassword
			}
		})

		return response.status(200).json({ message: 'Usuário cadastrado com sucesso' })
	} catch (error) {
		if (error instanceof z.ZodError) {
			return response.status(405).json({ message: error.issues[0].message })
		}
	}
})
