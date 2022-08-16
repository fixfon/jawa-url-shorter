import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../components/layout';
import { useCallback, useState } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import classNames from 'classnames';

import { signUpSchema, ISignUp } from '../common/validation/auth';
import { trpc } from '../common/client/trpc';
import { requireUnAuth } from '../common/requireUnAuth';

export const getServerSideProps = requireUnAuth(async (ctx) => {
	return { props: {} };
});

const Register: NextPage = () => {
	const [registerError, setRegisterError] = useState('');

	const router = useRouter();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<ISignUp>({
		resolver: zodResolver(signUpSchema),
	});

	register('username', {
		onChange() {
			if (registerError.length > 0) setRegisterError('');
		},
	});
	register('email', {
		onChange() {
			if (registerError.length > 0) setRegisterError('');
		},
	});
	register('password', {
		onChange() {
			if (registerError.length > 0) setRegisterError('');
		},
	});

	const { mutateAsync } = trpc.useMutation(['signup']);

	const onSubmit = useCallback(
		async (data: ISignUp) => {
			try {
				const result = await mutateAsync(data);
				if (result?.status == 201) {
					router.push('/login');
				}
			} catch (error: any) {
				setRegisterError(error.message);
			}
		},
		[mutateAsync, router]
	);

	const input =
		'text-black p-2 mt-6 bg-white border border-2 border-blue-920 shadow-sm placeholder-slate-400 focus:outline-none focus:border-blue-920 focus:ring-blue-950 block w-full rounded-md sm:text-sm focus:ring-1';

	const usernameInput = classNames(input, {
		'focus:border-red-500':
			(errors && errors.username) ||
			(registerError && registerError.length > 0),
		'focus:ring-red-500':
			(errors && errors.username) ||
			(registerError && registerError.length > 0),
		'border-red-500':
			(errors && errors.username) ||
			(registerError && registerError.length > 0),
		'text-red-500':
			(errors && errors.username) ||
			(registerError && registerError.length > 0),
	});

	const passwordInput = classNames(input, {
		'focus:border-red-500':
			(errors && errors.password) ||
			(registerError && registerError.length > 0),
		'focus:ring-red-500':
			(errors && errors.password) ||
			(registerError && registerError.length > 0),
		'border-red-500':
			(errors && errors.password) ||
			(registerError && registerError.length > 0),
		'text-red-500':
			(errors && errors.password) ||
			(registerError && registerError.length > 0),
	});

	const emailInput = classNames(input, {
		'focus:border-red-500':
			(errors && errors.email) || (registerError && registerError.length > 0),
		'focus:ring-red-500':
			(errors && errors.email) || (registerError && registerError.length > 0),
		'border-red-500':
			(errors && errors.email) || (registerError && registerError.length > 0),
		'text-red-500':
			(errors && errors.email) || (registerError && registerError.length > 0),
	});

	return (
		<Layout>
			<div className='h-full items-center flex justify-center'>
				<Head>
					<title>Register | Jawa!</title>
					<meta name='description' content='Register to Jawa!' />
				</Head>

				<main className='flex flex-col justify-center items-center text-center'>
					<form onSubmit={handleSubmit(onSubmit)}>
						<div className='min-w-[280px]'>
							<h2 className='text-3xl pb-8'>join us!</h2>
							<div className='flex flex-col justify-center items-center'>
								<input
									required
									className={usernameInput}
									type='username'
									placeholder='username'
									autoComplete='username'
									{...register('username')}
								/>
								{errors.username?.message && (
									<p className='max-w-[200px] text-sm text-red-500 pt-2'>
										{errors.username?.message}
									</p>
								)}
								<input
									required
									className={emailInput}
									type='email'
									placeholder='email'
									autoComplete='email'
									{...register('email')}
								/>
								{errors.email?.message && (
									<p className='max-w-[200px] text-sm text-red-500 pt-2'>
										{errors.email?.message}
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
									<p className='max-w-[200px] text-sm text-red-500 pt-2'>
										{errors.password?.message}
									</p>
								)}
								{registerError && (
									<p className='max-w-[200px] text-red-500 pt-4'>
										{registerError}
									</p>
								)}
							</div>
							<div className='flex flex-col gap-4 mt-8 justify-center items-center'>
								<button
									type='submit'
									className='text-xl w-2/3 py-1 border border-blue-920 rounded-2xl hover:bg-blue-920 transition-colors duration-200'>
									register
								</button>
								<Link href='/login'>
									<button
										type='button'
										className='text-xl w-2/3 py-1 border border-blue-920 rounded-2xl hover:bg-blue-920 transition-colors duration-200'>
										go to login
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

export default Register;
