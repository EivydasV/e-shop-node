import express, { RequestHandler } from 'express'
import sharp from 'sharp'
import { CreateProductInput } from '../validation/product.validation'
import path from 'path'
import { nanoid } from 'nanoid'
import ProductModel from '../models/product.model'

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
  //@ts-ignore
  // await req.files?.map(async (file) => {
  //   await sharp(file.buffer)
  //     .resize(300, 300)
  //     .toFormat('jpeg')
  //     .toFile(
  //       path.join(
  //         __dirname,
  //         '..',
  //         'public',
  //         `${nanoid()}.${file.mimetype.split('/')[1]}`
  //       )
  //     )
  // })
  return res.status(201).json({ product: newProduct })
}
