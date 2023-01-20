import dotenv from 'dotenv'
import express from 'express'
import { loginRouter } from './routers/loginRouter'
import { registerRouter } from './routers/registerRouter'

dotenv.config()
const app = express()

app.use(express.json())

// Routers
app.use(loginRouter)
app.use(registerRouter)

app.listen(process.env.PORT || 3333, () => {
	console.log('Server is running')
})
