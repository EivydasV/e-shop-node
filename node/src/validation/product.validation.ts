import z, {
  nativeEnum,
  number,
  object,
  string,
  any,
  instanceof as instance,
} from 'zod'
import { Categories, OS } from '../models/product.model'
import validator from 'validator'
import { ProductModel, UserModel } from '../models'

const title = string()
  .max(50, { message: 'First Name is too long' })
  .refine(
    async (title) => !(await ProductModel.findOne({ title }).select('').lean()),
    { message: 'Product with that title already exists' }
  )
const price = number().gte(1, { message: 'Price must be greater than 1' })
const description = string().max(400, { message: 'description is too long' })
const os = nativeEnum(OS).array()
const categories = nativeEnum(Categories).array()

export const CreateProductValidation = object({
  body: object({
    title,
    price,
    description,
    os,
    categories,
  }),
})
export const UploadImageValidation = object({
  body: object({
    images: any().array().nonempty(),
  }),
  params: object({
    id: string(),
  }),
})

export const getAllProductValidation = object({
  query: object({
    perPage: any(),
    page: any(),
  }),
})
export const getProductByIdValidation = object({
  query: object({
    id: string(),
  }),
})
export type CreateProductInput = z.infer<typeof CreateProductValidation>['body']
export type UploadImageInput = z.infer<typeof UploadImageValidation>
export type GetProductByIdInput = z.infer<
  typeof getProductByIdValidation
>['query']
export type GetAllProductInput = z.infer<
  typeof getAllProductValidation
>['query']
