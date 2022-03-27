import { getModelForClass } from '@typegoose/typegoose'
import { Product } from './product.model'
import { User } from './user.model'

export const UserModel = getModelForClass(User)
export const ProductModel = getModelForClass(Product)
