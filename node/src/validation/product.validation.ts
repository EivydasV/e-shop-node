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
const inStock = number().gte(1, { message: 'InStock must be greater than 1' })
const trailer = string().regex(
  /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/
)
const description = string().max(400, { message: 'description is too long' })
const os = nativeEnum(OS).array()
const categories = nativeEnum(Categories).array()

export const CreateProductValidation = object({
  body: object({
    title,
    price,
    description,
    os,
    inStock,
    trailer,
    categories,
  }),
})
export const UploadImageValidation = object({
  body: object({
    images: any().array().nonempty(),
    id: string(),
  }),
})

export const getAllProductValidation = object({
  query: object({
    perPage: any().optional(),
    page: any().optional(),
    search: any().optional(),
  }),
})
export const getProductByIdValidation = object({
  params: object({
    id: string(),
  }),
})
export const deleteProductByIdValidation = object({
  params: object({
    id: string(),
  }),
})
export const searchProductByTitleValidation = object({
  query: object({
    search: any().optional(),
  }),
})
export type CreateProductInput = z.infer<typeof CreateProductValidation>['body']
export type UploadImageInput = z.infer<typeof UploadImageValidation>['body']
export type GetProductByIdInput = z.infer<
  typeof getProductByIdValidation
>['params']
export type DeleteProductByIdInput = z.infer<
  typeof deleteProductByIdValidation
>['params']
export type GetAllProductInput = z.infer<
  typeof getAllProductValidation
>['query']
export type SearchProductInput = z.infer<
  typeof searchProductByTitleValidation
>['query']
