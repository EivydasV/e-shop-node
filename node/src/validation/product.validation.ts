import z, {
  nativeEnum,
  number,
  object,
  string,
  any,
  instanceof as instance,
} from 'zod'
import { OS } from '../models/product.model'
import validator from 'validator'
import { ProductModel, UserModel } from '../models'

const title = string()
  .max(50, { message: 'First Name is too long' })
  .refine(
    async (title) => !(await ProductModel.findOne({ title }).select('').lean()),
    { message: 'Product with that title already exists' }
  )
const price = number()
const description = string().max(400, { message: 'description is too long' })
const os = nativeEnum(OS).array()

export const CreateProductValidation = object({
  body: object({
    title,
    price,
    description,
    os,
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
export type GetProductByIdInput = z.infer<
  typeof getProductByIdValidation
>['query']
export type GetAllProductInput = z.infer<
  typeof getAllProductValidation
>['query']
