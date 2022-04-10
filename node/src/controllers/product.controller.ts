import { UserModel } from './../models/index'
import express, { RequestHandler } from 'express'
import sharp from 'sharp'
import {
  CreateProductInput,
  GetAllProductInput,
  GetProductByIdInput,
  SearchProductInput,
  UploadImageInput,
} from '../validation/product.validation'
import path from 'path'
import { nanoid } from 'nanoid'
import { ProductModel } from '../models'
import createHttpError from 'http-errors'
export const createProductHandler: RequestHandler<
  {},
  {},
  CreateProductInput
> = async (req, res, next) => {
  const { description, price, os, title } = req.body

  const newProduct = await ProductModel.create({
    description,
    price,
    os,
    title,
    createdBy: res.locals.user._id,
  })

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

  console.log(req.files)
  console.log(req.body)

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
  {},
  {},
  {},
  GetProductByIdInput
> = async (req, res, next) => {
  const { id } = req.query
  const product = await ProductModel.findById(id).lean()

  return res.status(201).json({ product })
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
