import { useLoginUserMutation } from '../../stores/service/authApi';
import { Link, useNavigate } from 'react-router';
import { Input } from '../../components/ui/Input/Input';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { loginUserSchema, type LoginUserSchema } from '../schema/login';
import { zodResolver } from '@hookform/resolvers/zod';

export const LoginPage = () => {
  const navigate = useNavigate();

  const [loginUser] = useLoginUserMutation();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<LoginUserSchema>({
    resolver: zodResolver(loginUserSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit: SubmitHandler<LoginUserSchema> = async (data) => {
    try {
      await loginUser({ ...data }).unwrap();
      navigate('/');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='min-h-[80vh] flex flex-col items-center justify-center gap-2 p-4'>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h2>Login</h2>
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
          Login
        </button>
      </form>
      <Link to='/register'>Don't have account? Register here</Link>
    </div>
  );
};
