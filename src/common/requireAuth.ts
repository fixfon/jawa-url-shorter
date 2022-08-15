import type { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { unstable_getServerSession } from 'next-auth';

import { nextAuthOptions } from './auth';

export const requireAuth =
	(func: GetServerSideProps) => async (ctx: GetServerSidePropsContext) => {
		const session = await unstable_getServerSession(
			ctx.req,
			ctx.res,
			nextAuthOptions
		);

		if (
			!session &&
			!ctx.req?.url?.startsWith('/login') &&
			!ctx.req?.url?.startsWith('/register')
		) {
			return {
				redirect: {
					destination: '/login',
					permanent: false,
				},
			};
		}
		// else if (
		// 	session &&
		// 	(ctx.req?.url?.startsWith('/login') ||
		// 		ctx.req?.url?.startsWith('/register'))
		// ) {
		// 	return {
		// 		redirect: {
		// 			destination: '/dashboard',
		// 			permanent: false,
		// 		},
		// 	};
		// }

		return await func(ctx);
	};
