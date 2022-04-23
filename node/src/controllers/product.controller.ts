import { getCartHandler } from './user.controller'
import { UserModel } from './../models/index'
import express, { RequestHandler } from 'express'
import sharp from 'sharp'
import {
  CreateProductInput,
  DeleteProductByIdInput,
  GetAllProductInput,
  GetProductByIdInput,
  SearchProductInput,
  UploadImageInput,
} from '../validation/product.validation'
import path from 'path'
import { nanoid } from 'nanoid'
import { ProductModel } from '../models'
import createHttpError from 'http-errors'
import mongoose from 'mongoose'
export const createProductHandler: RequestHandler<
  {},
  {},
  CreateProductInput
> = async (req, res, next) => {
  const { description, price, os, title, inStock, trailer, categories } =
    req.body

  const newProduct = await ProductModel.create({
    description,
    price,
    os,
    title,
    inStock,
    trailer,
    categories,
    createdBy: res.locals.user._id,
  })
  console.log(newProduct)

  return res.status(201).json({ product: newProduct })
}

export const uploadImageHandler: RequestHandler<
  {},
  {},
  UploadImageInput
> = async (req, res, next) => {
  const { id } = req.body

  const product = await ProductModel.findOne({
    _id: id,
    createdBy: res.locals.user._id,
  })
  if (!product) return next(new createHttpError.NotFound('Product not found'))

  let images: string[] = []
  // @ts-ignore
  await req.files?.map(async (file) => {
    const fileName = `${nanoid()}.jpeg`
    images.push(fileName)
    await sharp(file.buffer)
      .resize(600, 600, { fit: 'cover' })
      .toFormat('jpeg')
      .jpeg()
      .toFile(path.join(__dirname, '..', 'public', 'images', fileName))
  })
  product.images = images

  const savedProduct = await product.save()

  return res.status(200).json({ product: savedProduct })
}

export const getAllProductHandler: RequestHandler<
  {},
  {},
  {},
  GetAllProductInput
> = async (req, res, next) => {
  const { page, perPage, search } = req.query
  console.log(req.query)

  const MAX_PER_PAGE = 30

  const products = await ProductModel.paginate(
    { title: { $regex: search || '', $options: 'i' } },
    {
      page: page ?? 1,
      limit: perPage ? (perPage > MAX_PER_PAGE ? MAX_PER_PAGE : perPage) : 10,
      // lean: true,
      select: 'title price images',
    }
  )
  return res.status(200).json({ products })
}

export const getProductByIdHandler: RequestHandler<
  GetProductByIdInput
> = async (req, res, next) => {
  const { id } = req.params
  const product = await ProductModel.findById(id).populate('createdBy').lean()

  if (!product) return next(new createHttpError.NotFound('Product not found'))
  return res.status(200).json({ product })
}

export const getMyProductHandler: RequestHandler = async (req, res, next) => {
  const products = await ProductModel.find({
    createdBy: res.locals.user._id,
  }).sort({ createdAt: -1 })

  return res.status(200).json({ products })
}
export const deleteProductHandler: RequestHandler<
  DeleteProductByIdInput
> = async (req, res, next) => {
  const { id } = req.params
  const products = await ProductModel.findById(id)

  if (!products) return next(new createHttpError.NotFound('Product not found'))
  console.log({
    products: products.createdBy,
    id: new mongoose.Types.ObjectId(res.locals.user._id),
  })

  if (products.createdBy?.toString() !== res.locals.user._id)
    return next(
      new createHttpError.Forbidden(
        'You are not allowed to delete this product'
      )
    )
  await products.remove()
  return res.sendStatus(204)
}
export const searchByTitleIdHandler: RequestHandler<
  {},
  {},
  {},
  SearchProductInput
> = async (req, res, next) => {
  const { search } = req.query
  const product = await ProductModel.find({
    title: { $regex: search || '', $options: 'i' },
  })
    .limit(5)
    .select('title price')
    .lean()

  return res.status(200).json({ product })
}

export const getCarouselImagesHandler: RequestHandler = async (
  req,
  res,
  next
) => {
  const product = await ProductModel.find({}).limit(5).lean()

  return res.status(200).json({ product })
}
export const getBestSellersHandler: RequestHandler = async (req, res, next) => {
  const products = await ProductModel.find({})
    .sort({ soldCount: 1 })
    .limit(6)
    .lean()

  return res.status(200).json({ products })
}
export const buyProductHandler: RequestHandler = async (req, res, next) => {
  const user = await UserModel.findById(res.locals.user._id).select(
    'cart boughtGames'
  )
  if (!user) return next(new createHttpError.NotFound('User not found'))
  if (!user.cart.length)
    return next(new createHttpError.BadRequest('Cart is empty'))

  //@ts-ignore
  user.boughtGames.addToSet(user.cart)

  const product = await ProductModel.updateMany(
    { _id: { $in: user.cart } },
    { $inc: { soldCount: 1, inStock: -1 } },
    { lean: true }
  )
  user.cart = []
  await user.save()
  return res.status(200).json({ user, product })
}
