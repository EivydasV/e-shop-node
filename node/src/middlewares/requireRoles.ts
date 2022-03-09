import createError from 'http-errors'
import { Roles } from './../models/user.model'
import { RequestHandler } from 'express'

const requireRoles =
  (role: Roles): RequestHandler =>
  (req, res, next) => {
    if (!res.locals.user.roles.includes(role))
      return next(
        new createError.Forbidden(
          'You do not have permission to perform this action'
        )
      )
    next()
  }
export default requireRoles
