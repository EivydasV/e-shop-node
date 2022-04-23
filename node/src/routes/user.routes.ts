import {
  addRoleHandler,
  addToCartHandler,
  getCartHandler,
  removeRoleHandler,
  removeUserHandler,
} from './../controllers/user.controller'
import express, { Router } from 'express'
import CheckInCache from '../utils/checkInCacheForUser'
import {
  createUserHandler,
  forgotPasswordHandler,
  getAllUsersHandler,
  GetUserByIdHandler,
  resetPasswordHandler,
  updateEmailHandler,
  updatePasswordHandler,
  removeItemCartHandler,
} from '../controllers/user.controller'
import validateResource from '../middlewares/validateResource'
import {
  createUserValidation,
  ForgotPasswordUserValidation,
  ResetPasswordUserValidation,
  loginUserValidation,
  updatePasswordUserValidation,
  updateEmailUserValidation,
  addRoleUserValidation,
  removeRoleUserValidation,
  removeUserValidation,
  addToCartUserValidation,
  removeItemCartUserValidation,
} from '../validation/user.validation'
import requireUser from '../middlewares/requireUser'
import { login, logout, me } from '../controllers/auth.controller'
import requireRoles from '../middlewares/requireRoles'
import { Roles } from '../models/user.model'

const router = express.Router()
//OTHER
router
  .route('/')
  .post(validateResource(createUserValidation), createUserHandler)
  .get(requireUser, requireRoles(Roles.ADMIN), getAllUsersHandler)

//ROUTES FOR EVERYONE
router.post('/login', validateResource(loginUserValidation), login)

router.post(
  '/forgot-password',
  validateResource(ForgotPasswordUserValidation),
  forgotPasswordHandler
)
router.post(
  '/reset-password/:id/:passwordResetToken',
  validateResource(ResetPasswordUserValidation),
  resetPasswordHandler
)

router.post('/logout', logout)
//ROUTES ONLY FOR AUTH
router.use(requireUser)

//ROUTES ONLY FOR USER
router.use(requireRoles(Roles.USER))

router.get('/me', me)

router.put(
  '/update-password',
  validateResource(updatePasswordUserValidation),
  updatePasswordHandler
)
router.put(
  '/add-to-cart',
  validateResource(addToCartUserValidation),
  addToCartHandler
)
router.get('/get-cart', getCartHandler)
router.delete(
  '/remove-item-cart/:id',
  validateResource(removeItemCartUserValidation),
  removeItemCartHandler
)
router.put(
  '/update-email',
  validateResource(updateEmailUserValidation),
  updateEmailHandler
)
//ROUTES ONLY FOR ADMIN
router.use(requireRoles(Roles.ADMIN))

router.get('/:id', CheckInCache('user'), GetUserByIdHandler)

router.post(
  '/add-role/:id',
  validateResource(addRoleUserValidation),
  addRoleHandler
)
router.post(
  '/remove-role/:id',
  validateResource(removeRoleUserValidation),
  removeRoleHandler
)
router.delete('/', validateResource(removeUserValidation), removeUserHandler)

export default router
