import createError from 'http-errors'
import { RequestHandler } from 'express'
import { LoginUserInput } from '../validation/user.validation'
import { signJWT } from '../utils/jwt'
import redis from '../utils/redis'
import moment from 'moment'
import _ from 'lodash'
import redisGetObject from '../utils/redisGetObject'
import { RedisUser } from '../types/redisTypes'
import { UserModel } from '../models'

export const me: RequestHandler = async (req, res, next) => {
  return res.status(200).json({ user: res.locals.user })
}

export const login: RequestHandler<{}, {}, LoginUserInput> = async (
  req,
  res,
  next
) => {
  const { password, email } = req.body

  const user = await UserModel.findOne({ email }).select('+password')

  if (!user || !(await user.comparePassword(password)))
    return next(new createError.Unauthorized('Wrong password or email?'))

  const accessToken = signJWT(
    { id: user._id, agent: _.pick(req.useragent, 'os', 'platform', 'source') },
    'accessToken'
  )
  const refreshToken = signJWT(
    { id: user._id, agent: _.pick(req.useragent, 'os', 'platform', 'source') },
    'refreshToken'
  )

  await redis.setex(
    `user:${user._id}`,
    31556926,
    JSON.stringify({ ..._.omit(user.toJSON(), 'password'), refreshToken })
  )

  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    expires: moment().add('1', 'years').toDate(),
    sameSite: 'lax',
    signed: true,
  })
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    expires: moment().add('1', 'years').toDate(),
    sameSite: 'lax',
    signed: true,
  })
  return res.sendStatus(200)
}
export const logout: RequestHandler = async (req, res, next) => {
  await redis.del(`user:${res.locals.user?.id}`)
  return res
    .clearCookie('accessToken')
    .clearCookie('refreshToken')
    .sendStatus(204)
}
