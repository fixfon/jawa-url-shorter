import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useCallback } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { signUpSchema, ISignUp } from '../common/validation/auth';
import { trpc } from '../common/client/trpc';
import { requireUnAuth } from '../common/requireUnAuth';

export const getServerSideProps = requireUnAuth(async (ctx) => {
	return { props: {} };
});

const Register: NextPage = () => {
	const router = useRouter();
	const { register, handleSubmit } = useForm<ISignUp>({
		resolver: zodResolver(signUpSchema),
	});

	const { mutateAsync } = trpc.useMutation(['signup']);

	const onSubmit = useCallback(
		async (data: ISignUp) => {
			const result = await mutateAsync(data);
			if (result.status === 201) {
				router.push('/login');
			}
		},
		[mutateAsync, router]
	);

	return (
		<div>
			<Head>
				<title>Register | Jawa!</title>
				<meta name='description' content='Register for Jawa!' />
			</Head>

			<main>
				<form onSubmit={handleSubmit(onSubmit)}>
					<div>
						<div>
							<h2>create account</h2>
							<input
								required
								type='username'
								placeholder='username'
								autoComplete='username'
								{...register('username')}
							/>
							<input
								required
								type='email'
								placeholder='email'
								autoComplete='email'
								{...register('email')}
							/>
							<input
								required
								type='password'
								placeholder='password'
								autoComplete='new-password'
								{...register('password')}
							/>
							<div>
								<Link href='/login'>go to login</Link>
								<button type='submit'>register</button>
							</div>
						</div>
					</div>
				</form>
			</main>
		</div>
	);
};

export default Register;
