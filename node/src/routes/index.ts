import express from 'express'
import userRoutes from './user.routes'
import productRoutes from './product.routes'

const router = express.Router()

router.get('/healthcheck', (_, res) => res.sendStatus(200))

router.use('/user', userRoutes)
router.use('/product', productRoutes)

export default router
