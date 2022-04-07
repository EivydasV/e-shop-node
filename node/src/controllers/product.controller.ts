import express, { RequestHandler } from 'express'
import sharp from 'sharp'
import {
  CreateProductInput,
  GetAllProductInput,
  GetProductByIdInput,
} from '../validation/product.validation'
import path from 'path'
import { nanoid } from 'nanoid'
import { ProductModel } from '../models'
export const createProductHandler: RequestHandler<
  {},
  {},
  CreateProductInput
> = async (req, res, next) => {
  const { description, price, os, title } = req.body

  //@ts-ignore
  console.log(req.body)
  console.log(req.files)

  let images: string[] = []
  // @ts-ignore
  await req.files?.map(async (file) => {
    const fileName = `${nanoid()}.jpeg`
    images.push(fileName)
    await sharp(file.buffer)
      .resize(600, 600, { fit: 'cover' })
      .toFormat('jpeg')
      .jpeg()
      .toFile(path.join(__dirname, '..', 'public', fileName))
  })

  // const newProduct = await ProductModel.create({
  //   description,
  //   price,
  //   os,
  //   title,
  //   images,
  //   createdBy: res.locals.user._id,
  // })

  return res.status(201).json({ product: 's' })
}

export const getAllProductHandler: RequestHandler<
  {},
  {},
  {},
  GetAllProductInput
> = async (req, res, next) => {
  const { page, perPage } = req.query
  console.log(req.query)

  const MAX_PER_PAGE = 30

  const products = await ProductModel.paginate(
    {},
    {
      page,
      limit: perPage > MAX_PER_PAGE ? MAX_PER_PAGE : perPage,
      lean: true,
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
  const product = await ProductModel.findById(id).lean().explain()

  return res.status(201).json({ product })
}
