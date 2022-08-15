import type { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { unstable_getServerSession } from 'next-auth';

import { nextAuthOptions } from './auth';

export const requireUnAuth =
	(func: GetServerSideProps) => async (ctx: GetServerSidePropsContext) => {
		const session = await unstable_getServerSession(
			ctx.req,
			ctx.res,
			nextAuthOptions
		);

		if (session) {
			return {
				redirect: {
					destination: '/dashboard',
					permanent: false,
				},
			};
		}

		return await func(ctx);
	};
