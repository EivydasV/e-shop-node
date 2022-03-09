import { signJWT } from './../utils/jwt'
import { RequestHandler } from 'express'
import redis from '../utils/redis'
import { verifyJWT } from '../utils/jwt'
import moment from 'moment'
import redisGetObject from '../utils/redisGetObject'
import { RedisUser } from '../types/redisTypes'
import { JWTVerify } from '../types/jwtPayload'
import _ from 'lodash'

const deserializeUser: RequestHandler = async (req, res, next) => {
  const { accessToken, refreshToken } = req.signedCookies
  const agent = req.useragent

  if (!accessToken) return next()
  const { payload, expired } = verifyJWT(accessToken, 'accessToken', {
    ignoreExpiration: true,
  })

  const user = await redisGetObject<RedisUser>(`user:${payload?.id}`)

  if (!user?.refreshToken) return next()

  if (!expired && payload) {
    res.locals.user = _.omit(user, 'refreshToken')
    return next()
  }

  const refresh: JWTVerify =
    expired && refreshToken && verifyJWT(refreshToken, 'refreshToken')

  if (!refresh.payload) return next()
  if (
    !_.isEqual(
      refresh.payload.agent,
      _.pick(req.useragent, 'os', 'platform', 'source')
    )
  ) {
    return next()
  }

  const newAccessToken = signJWT(
    {
      id: user._id,
      agent: {
        os: agent?.os,
        platform: agent?.platform,
        source: agent?.source,
      },
    },
    'accessToken'
  )

  res.locals.user = _.omit(user, 'refreshToken')

  res.cookie('accessToken', newAccessToken, {
    httpOnly: true,
    expires: moment().add('1', 'years').toDate(),
    sameSite: 'lax',
    signed: true,
  })
  console.log('🆕 New access token')

  return next()
}
export default deserializeUser
