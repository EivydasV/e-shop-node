import { Plugins } from '@typegoose/typegoose'
import { FilterQuery, PaginateOptions, PaginateResult } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

@Plugins(mongoosePaginate)
export default class PaginatedModel {
  static paginate: <T extends PaginatedModel>(
    this: T,
    query?: FilterQuery<T>,
    options?: PaginateOptions,
    callback?: (err: Error, result: PaginateResult<T>) => void
  ) => Promise<PaginateResult<T>>
}
