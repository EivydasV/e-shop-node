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
import parseBody from '../middlewares/parseBody'

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
    parseBody,
    upload.array('images', 6),
    // validateResource(CreateProductValidation),
    createProductHandler
  )

export default router
