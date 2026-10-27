import { Link, useNavigate } from 'react-router';
import { useRegisterUserMutation } from '../../stores/service/authApi';
import { Input } from '../../components/ui/Input/Input';
import { useForm, type SubmitHandler } from 'react-hook-form';
import {
  registerUserSchema,
  type RegisterUserSchema,
} from '../schema/register';
import { zodResolver } from '@hookform/resolvers/zod';

export const RegisterPage = () => {
  const navigate = useNavigate();

  const [registerUser] = useRegisterUserMutation();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<RegisterUserSchema>({
    resolver: zodResolver(registerUserSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const onSubmit: SubmitHandler<RegisterUserSchema> = async (data) => {
    try {
      await registerUser({ ...data }).unwrap();
      navigate('/');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='min-h-[80vh] flex flex-col items-center justify-center gap-2 p-4'>
      <form
        className='bg-white p-6 rounded shadow-md w-full max-w-lg'
        onSubmit={handleSubmit(onSubmit)}
      >
        <h2 className='text-2xl mb-6 font-bold text-center text-gray-800'>
          Register
        </h2>
        <Input {...register('name')} type='text' placeholder='name' />
        <Input {...register('email')} type='email' placeholder='email' />
        <Input
          {...register('password')}
          type='password'
          placeholder='password'
        />
        <button
          className='bg-purple-400 text-white p-2 w-full'
          disabled={isSubmitting}
        >
          Register
        </button>
      </form>
      <Link to='/login'>Already have account? Login here</Link>
    </div>
  );
};
