import z, { nativeEnum, number, object, string } from 'zod'
import UserModel, { OS } from '../models/product.model'
import validator from 'validator'
import ProductModel from '../models/product.model'

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

export type CreateProductInput = z.infer<typeof CreateProductValidation>['body']
