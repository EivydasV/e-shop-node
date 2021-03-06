import z, { nativeEnum, object, string } from 'zod'
import { Roles } from '../models/user.model'
import { UserModel } from '../models'

import validator from 'validator'

const firstName = string({
  required_error: 'First Name is required',
  invalid_type_error: 'Invalid type',
}).max(50, { message: 'First Name is too long' })

const lastName = string({
  required_error: 'Last Name is required',
  invalid_type_error: 'Invalid type',
}).max(50, { message: 'Last Name is too long' })

const email = string({
  required_error: 'Email is required',
  invalid_type_error: 'Invalid type',
})
  .email('Please provide a valid email')
  .max(50, { message: 'Email is too long' })

const password = string({
  required_error: 'Password is required',
  invalid_type_error: 'Invalid type',
}).max(200, { message: 'password is too long' })

const passwordConfirmation = string({
  required_error: 'Password Confimation is required',
  invalid_type_error: 'Invalid type',
})

export const createUserValidation = object({
  body: object({
    firstName,
    email,
    lastName,
    password,
    passwordConfirmation,
  })
    .refine(
      (data) => validator.isStrongPassword(data.password, { minSymbols: 0 }),
      {
        message:
          'password must contain at least one upperCase, one lowerCase, one number and total length must be more than 8 characters long',
        path: ['password'],
      }
    )
    .refine((data) => data.password === data.passwordConfirmation, {
      message: 'Passwords do not match',
      path: ['password', 'passwordConfirmation'],
    })
    .refine(
      async (data) =>
        !(await UserModel.findOne({ email: data.email }).select('').lean()),
      { message: 'This Email is already taken', path: ['email'] }
    ),
})

export const GetByIdUserValidation = object({
  params: object({
    id: string(),
  }),
})

export const ForgotPasswordUserValidation = object({
  body: object({
    email,
  }),
})

export const ResetPasswordUserValidation = object({
  params: object({
    id: string(),
    passwordResetToken: string(),
  }),
  body: object({
    password,
    passwordConfirmation,
  })
    .refine(
      (data) => validator.isStrongPassword(data.password, { minSymbols: 0 }),
      {
        message:
          'password must contain at least one upperCase, one lowerCase, one number and total length must be more than 8 characters long',
        path: ['password'],
      }
    )
    .refine((data) => data.password === data.passwordConfirmation, {
      message: 'Passwords do not match',
      path: ['password', 'passwordConfirmation'],
    }),
})

export const loginUserValidation = object({
  body: object({
    email,
    password,
  }),
})

export const updatePasswordUserValidation = object({
  body: object({
    currentPassword: password,
    newPassword: password,
  }).refine(
    (data) => validator.isStrongPassword(data.newPassword, { minSymbols: 0 }),
    {
      message:
        'password must contain at least one upperCase, one lowerCase, one number and total length must be more than 8 characters long',
      path: ['newPassword'],
    }
  ),
})
export const updateEmailUserValidation = object({
  body: object({
    currentPassword: password,
    newEmail: email,
  }).refine(
    async (data) => !(await UserModel.findOne({ email: data.newEmail })),
    {
      message: 'This Email is already taken',
      path: ['newEmail'],
    }
  ),
})
export const addRoleUserValidation = object({
  params: object({
    id: string(),
  }),
  body: object({
    role: nativeEnum(Roles),
  }),
})
export const removeUserValidation = object({
  params: object({
    id: string(),
  }),
})
export const getAllUserValidation = object({
  query: object({
    page: string().optional(),
  }),
})
export const addToCartUserValidation = object({
  body: object({
    id: string(),
  }),
})
export const removeItemCartUserValidation = object({
  params: object({
    id: string(),
  }),
})
export const removeRoleUserValidation = addRoleUserValidation

export type GetAllUserInput = z.infer<typeof getAllUserValidation>['query']
export type AddToCartUserInput = z.infer<typeof addToCartUserValidation>['body']
export type GetByIdUserInput = z.infer<typeof GetByIdUserValidation>['params']
export type removeUserInput = z.infer<typeof removeUserValidation>['params']
export type ResetPasswordUserInput = z.infer<typeof ResetPasswordUserValidation>
export type CreateUserInput = z.infer<typeof createUserValidation>['body']
export type LoginUserInput = z.infer<typeof loginUserValidation>['body']
export type AddRoleUserInput = z.infer<typeof addRoleUserValidation>
export type RemoveRoleUserInput = z.infer<typeof removeRoleUserValidation>
export type RemoveItemCartUserInput = z.infer<
  typeof removeItemCartUserValidation
>['params']
export type UpdateEmailUserInput = z.infer<
  typeof updateEmailUserValidation
>['body']
export type UpdatePasswordUserInput = z.infer<
  typeof updatePasswordUserValidation
>['body']
export type ForgotPasswordUserInput = z.infer<
  typeof ForgotPasswordUserValidation
>['body']
