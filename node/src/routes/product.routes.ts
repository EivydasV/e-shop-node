import {
  CreateProductValidation,
  getAllProductValidation,
  getProductByIdValidation,
} from './../validation/product.validation'
import express from 'express'
import {
  createProductHandler,
  getAllProductHandler,
  getProductByIdHandler,
} from '../controllers/product.controller'
import upload from '../utils/multer'
import validateResource from '../middlewares/validateResource'
import requireUser from '../middlewares/requireUser'

const router = express.Router()

router.get(
  '/:id',
  validateResource(getProductByIdValidation),
  getProductByIdHandler
)
router
  .route('/')
  .get(validateResource(getAllProductValidation), getAllProductHandler)
  .post(
    validateResource(CreateProductValidation),
    upload.array('images', 6),
    createProductHandler
  )

export default router
