import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../components/layout';
import { useCallback } from 'react';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { loginSchema, ILogin } from '../common/validation/auth';
import { requireUnAuth } from '../common/requireUnAuth';

export const getServerSideProps = requireUnAuth(async (ctx) => {
	return { props: {} };
});

const Login: NextPage = () => {
	const {
		register,
		handleSubmit,
		formState: { errors },
		setError,
	} = useForm<ILogin>({
		resolver: zodResolver(loginSchema),
	});

	const onSubmit = useCallback(async (data: ILogin) => {
		const res = await signIn('credentials', {
			...data,
			callbackUrl: '/dashboard',
      redirect: false,
		})
			.then((res) => {
				console.log(res);
        
			})
	}, []);

	const input =
		'text-black p-2 mb-1 bg-white border border-2 border-blue-920 shadow-sm placeholder-slate-400 focus:outline-none focus:border-blue-920 focus:ring-blue-950 block w-full rounded-md sm:text-sm focus:ring-1';

	return (
		<Layout>
			<div>
				<Head>
					<title>Login | Jawa!</title>
					<meta name='description' content='Login to Jawa!' />
				</Head>

				<main className='flex flex-col justify-center items-center text-center'>
					<form onSubmit={handleSubmit(onSubmit)}>
						<div>
							<h2 className='text-3xl pb-14'>welcome back!</h2>
							<div className='flex flex-col gap-5'>
								<input
									required
									className={input}
									type='username'
									placeholder='username'
									autoComplete='username'
									{...register('username')}
								/>
								{errors.username?.message && <p>{errors.username?.message}</p>}
								<input
									required
									className={input}
									type='password'
									placeholder='password'
									autoComplete='current-password'
									{...register('password')}
								/>
								{errors.password?.message && <p>{errors.password?.message}</p>}
							</div>
							<div className='flex flex-col gap-4 mt-8 justify-center items-center'>
								<button
									type='submit'
									className='text-xl w-2/3 py-1 border border-blue-920 rounded-2xl hover:bg-blue-920 transition-colors duration-200'>
									login
								</button>
								<Link href='/register'>
									<button
										type='button'
										className='text-xl w-2/3 py-1 border border-blue-920 rounded-2xl hover:bg-blue-920 transition-colors duration-200'>
										register
									</button>
								</Link>
							</div>
						</div>
					</form>
				</main>
			</div>
		</Layout>
	);
};

export default Login;
