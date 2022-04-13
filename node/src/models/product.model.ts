import {
  getModelForClass,
  ModelOptions,
  Prop,
  Pre,
  Ref,
} from '@typegoose/typegoose'
import slugify from 'slugify'
import validator from 'validator'
import PaginatedModel from '../helpers/paginatedModel'
import { User } from './user.model'

export enum OS {
  windows = 'windows',
  mac = 'mac',
  linux = 'linux',
}
export enum Categories {
  ADVENTURE = 'adventure',
  ACTION = 'action',
  PUZZLE = 'puzzle',
  STRATEGY = 'strategy',
}
@Pre<Product>('validate', function (next) {
  this.slug = slugify(this.title)
  // console.log(this.slug)

  next()
})
@ModelOptions({
  schemaOptions: {
    toJSON: { getters: true },
    toObject: { getters: true },
    timestamps: true,
  },
})
export class Product extends PaginatedModel {
  @Prop({
    trim: true,
    required: true,
    unique: true,
    maxlength: 50,
  })
  title!: string

  @Prop({
    required: true,
    min: 1,
    get: (val: number) => val.toFixed(2),
  })
  price!: number

  @Prop({ trim: true, required: true, maxlength: 400 })
  description!: string

  @Prop({ default: 0 })
  soldCount!: number

  @Prop({ required: true })
  inStock!: number

  @Prop({ required: true })
  trailer!: string

  @Prop({
    trim: true,
    required: true,
    // index: true,
    unique: true,
    validate: [validator.isSlug, 'Invalid slug'],
  })
  slug!: string

  @Prop({
    type: [String],
    validate: {
      validator: (val: string[]) => (val: string[]) => val.length < 6,
      message: (props) => `${props.path} exceeds the limit of 6`,
    },
  })
  images!: string[]

  @Prop({ type: [String], enum: OS, required: true })
  os!: OS[]

  @Prop({ type: [String], enum: Categories, required: true })
  categories!: Categories[]

  @Prop({ required: true, ref: () => User })
  createdBy!: Ref<User>
}
