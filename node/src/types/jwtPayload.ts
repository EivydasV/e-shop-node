import { JwtPayload } from 'jsonwebtoken'
export type JWTVerify = {
  payload:
    | (JwtPayload & {
        id: string
        agent: { os?: string; platform?: string; source?: string }
      })
    | null
  expired: boolean
}
