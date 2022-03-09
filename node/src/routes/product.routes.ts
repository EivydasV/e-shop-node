import { CreateProductValidation } from './../validation/product.validation'
import express from 'express'
import { createProductHandler } from '../controllers/product.controller'
import upload from '../utils/multer'
import validateResource from '../middlewares/validateResource'
import requireUser from '../middlewares/requireUser'

const router = express.Router()

router
  .route('/')
  .post(
    requireUser,
    validateResource(CreateProductValidation),
    upload.array('images', 6),
    createProductHandler
  )

export default router
