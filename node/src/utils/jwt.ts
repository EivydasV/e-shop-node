import { JWTVerify } from './../types/jwtPayload'
import jwt from 'jsonwebtoken'
import config from 'config'
import moment from 'moment'
export const signJWT = (
  payload: {
    id: string
    agent: { os?: string; platform?: string; source?: string }
  },
  tokenType: 'accessToken' | 'refreshToken'
) => {
  const secret =
    tokenType === 'accessToken'
      ? config.get<string>('jwtAccessKey')
      : config.get<string>('jwtRefreshKey')

  const expiresIn = tokenType === 'accessToken' ? '15m' : '1y'
  return jwt.sign(payload, secret, { expiresIn })
}

export const verifyJWT = (
  token: string,
  tokenType: 'accessToken' | 'refreshToken',
  { ignoreExpiration = false }: { ignoreExpiration?: boolean } = {}
): JWTVerify => {
  let decoded: JWTVerify['payload']
  try {
    const secret =
      tokenType === 'accessToken'
        ? config.get<string>('jwtAccessKey')
        : config.get<string>('jwtRefreshKey')

    decoded = jwt.verify(token, secret, {
      ignoreExpiration,
    }) as JWTVerify['payload']

    if ((decoded?.exp || 0) < moment().unix()) {
      return { expired: true, payload: decoded }
    }

    return { expired: false, payload: decoded }
  } catch (err: any) {
    return {
      expired: true,
      payload: null,
    }
  }
}
