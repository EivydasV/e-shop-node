import { searchByTitleIdHandler } from './../controllers/product.controller'
import {
  CreateProductValidation,
  getAllProductValidation,
  getProductByIdValidation,
  searchProductByTitleValidation,
  UploadImageValidation,
} from './../validation/product.validation'
import express from 'express'
import {
  createProductHandler,
  getAllProductHandler,
  getProductByIdHandler,
  uploadImageHandler,
} from '../controllers/product.controller'
import upload from '../utils/multer'
import validateResource from '../middlewares/validateResource'
import requireUser from '../middlewares/requireUser'

const router = express.Router()

router.get(
  '/search',
  validateResource(searchProductByTitleValidation),
  searchByTitleIdHandler
)
router.get(
  '/:id',
  validateResource(getProductByIdValidation),
  getProductByIdHandler
)
router
  .route('/')
  .get(validateResource(getAllProductValidation), getAllProductHandler)
  .post(
    requireUser,
    validateResource(CreateProductValidation),
    createProductHandler
  )
router.post(
  '/upload/images',
  requireUser,
  // validateResource(UploadImageValidation),
  upload.array('images', 6),
  uploadImageHandler
)

export default router
