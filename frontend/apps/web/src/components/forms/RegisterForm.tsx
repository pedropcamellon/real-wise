'use client'

import type {
  RegisterAction,
  RegisterFormSchema
} from '@/actions/registerAction'
import { fieldApiError } from '@/lib/forms'
import { registerFormSchema } from '@/lib/validation'
import FormFooter from '@frontend/ui/forms/FormFooter'
import FormHeader from '@frontend/ui/forms/FormHeader'
import SubmitField from '@frontend/ui/forms/SubmitField'
import TextField from '@frontend/ui/forms/TextField'
import { zodResolver } from '@hookform/resolvers/zod'
import { signIn } from 'next-auth/react'
import { useForm } from 'react-hook-form'

const RegisterForm: React.FC<{
  onSubmitHandler: RegisterAction
}> = ({ onSubmitHandler }) => {
  const { formState, handleSubmit, register, setError } =
    useForm<RegisterFormSchema>({
      resolver: zodResolver(registerFormSchema)
    })

  return (
    <>
      <FormHeader
        title="Create new account"
        description="Get an access to internal application"
      />

      <form
        method="post"
        onSubmit={handleSubmit(async (data) => {
          const res = await onSubmitHandler(data)

          if (res === true) {
            signIn()
          } else if (typeof res !== 'boolean') {
            fieldApiError('username', 'username', res, setError)
            fieldApiError('password', 'password', res, setError)
            fieldApiError('password_retype', 'passwordRetype', res, setError)
          }
        })}
      >
        <TextField
          type="text"
          register={register('username')}
          formState={formState}
          label="Username"
          placeholder="Unique username or email"
        />

        <TextField
          type="password"
          register={register('password')}
          formState={formState}
          label="Password"
          placeholder="Your new password"
        />

        <TextField
          type="password"
          register={register('passwordRetype')}
          formState={formState}
          label="Retype password"
          placeholder="Verify password"
        />

        <SubmitField>Sign up</SubmitField>
      </form>

      <FormFooter
        cta="Already have an account?"
        link="/login"
        title="Sign in"
      />
    </>
  )
}

export default RegisterForm
