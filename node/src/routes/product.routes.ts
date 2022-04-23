import {
  getBestSellersHandler,
  getMyProductHandler,
  searchByTitleIdHandler,
} from './../controllers/product.controller'
import {
  CreateProductValidation,
  deleteProductByIdValidation,
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
  getCarouselImagesHandler,
  deleteProductHandler,
  buyProductHandler,
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
router.get('/carousel-images', getCarouselImagesHandler)
router.get('/best-sellers', getBestSellersHandler)
router.get('/my-products', getMyProductHandler)
router.delete(
  '/:id',
  validateResource(deleteProductByIdValidation),
  deleteProductHandler
)

router.post('/buy', buyProductHandler)

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
