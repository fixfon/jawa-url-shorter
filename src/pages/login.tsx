import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../components/layout';
import { useCallback, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import classNames from 'classnames';

import { loginSchema, ILogin } from '../common/validation/auth';
import { requireUnAuth } from '../common/requireUnAuth';

export const getServerSideProps = requireUnAuth(async (ctx) => {
	return { props: {} };
});

const Login: NextPage = () => {
	const [signInError, setSignInError] = useState('');

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<ILogin>({
		resolver: zodResolver(loginSchema),
	});

	register('username', {
		onChange() {
			if (signInError.length > 0) setSignInError('');
		},
	});
	register('password', {
		onChange() {
			if (signInError.length > 0) setSignInError('');
		},
	});

	const onSubmit = useCallback(async (data: ILogin) => {
		const res = await signIn('credentials', {
			...data,
			redirect: false,
		}).then((res) => {
			if (res?.error) setSignInError(res.error);
		});
	}, []);

	const input =
		'text-black p-2 mb-1 bg-white border border-2 border-blue-920 shadow-sm placeholder-slate-400 focus:outline-none focus:border-blue-920 focus:ring-blue-950 block w-full rounded-md sm:text-sm focus:ring-1';

	const usernameInput = classNames(input, {
		'focus:border-red-500':
			(errors && errors.username) || (signInError && signInError.length > 0),
		'focus:ring-red-500':
			(errors && errors.username) || (signInError && signInError.length > 0),
		'border-red-500':
			(errors && errors.username) || (signInError && signInError.length > 0),
		'text-red-500':
			(errors && errors.username) || (signInError && signInError.length > 0),
	});

	const passwordInput = classNames(input, {
		'focus:border-red-500':
			(errors && errors.password) || (signInError && signInError.length > 0),
		'focus:ring-red-500':
			(errors && errors.password) || (signInError && signInError.length > 0),
		'border-red-500':
			(errors && errors.password) || (signInError && signInError.length > 0),
		'text-red-500':
			(errors && errors.password) || (signInError && signInError.length > 0),
	});

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
							<div className='flex flex-col gap-5 justify-center items-center'>
								<input
									required
									className={usernameInput}
									type='username'
									placeholder='username'
									autoComplete='username'
									{...register('username')}
								/>
								{errors.username?.message && (
									<p className='max-w-[200px] text-sm text-red-500'>
										{errors.username?.message}
									</p>
								)}
								<input
									required
									className={passwordInput}
									type='password'
									placeholder='password'
									autoComplete='current-password'
									{...register('password')}
								/>
								{errors.password?.message && (
									<p className='max-w-[200px] text-sm text-red-500'>
										{errors.password?.message}
									</p>
								)}
								{signInError && (
									<p className='max-w-[200px] text-red-500'>
										{signInError}
									</p>
								)}
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
