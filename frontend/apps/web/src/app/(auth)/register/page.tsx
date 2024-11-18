import { registerAction } from '@/actions/registerAction'
import RegisterForm from '@/components/forms/RegisterForm'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Register'
}

const Register = () => {
  return <RegisterForm onSubmitHandler={registerAction} />
}

export default Register
