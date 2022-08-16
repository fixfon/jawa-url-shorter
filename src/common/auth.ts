import { NextAuthOptions } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { verify } from 'argon2';

import { prisma } from '../server/db/client';
import { loginSchema } from './validation/auth';

export const nextAuthOptions: NextAuthOptions = {
	providers: [
		Credentials({
			id: 'credentials',
			name: 'Credentials',
			credentials: {
				username: {
					label: 'Username',
					type: 'text',
					placeholder: 'username',
				},
				password: { label: 'Password', type: 'password' },
			},
			authorize: async (credentials, request) => {
				const creds = await loginSchema.parseAsync(credentials);
				const user = await prisma.user.findFirst({
					where: { username: creds.username },
				});

				if (!user) {
					throw new Error("User doesn't exist");
				}

				const isValidPassworod = await verify(user.password, creds.password);

				if (!isValidPassworod) {
					throw new Error('Invalid password');
				}

				return {
					id: user.id,
					email: user.email,
					name: user.username,
				};
			},
		}),
	],
	callbacks: {
		// redirect: ({ url, baseUrl }) => {
		// 	// Allows relative callback URLs
		// 	if (url.startsWith('/')) return `${baseUrl}${url}`;
		// 	// Allows callback URLs on the same origin
		// 	else if (new URL(url).origin === baseUrl) return url;
		// 	return baseUrl;
		// },
		jwt: async ({ token, user }) => {
			if (user) {
				token.id = user.id;
				token.email = user.email;
				token.name = user.name;
				// console.log('jwt', token);
			}

			return token;
		},
		session: async ({ session, token }) => {
			if (token) {
				session.id = token.id;
				session.user.userId = token.id;
				// console.log('sesion', session);
				// console.log('token', token);
			}

			return session;
		},
	},
	session: {
		strategy: 'jwt',
		maxAge: 15 * 24 * 30 * 60, // 15 days
		updateAge: 0,
	},
	jwt: {
		secret: 'super-secret',
		maxAge: 15 * 24 * 30 * 60, // 15 days
	},
	pages: {
		signIn: '/login',
		newUser: '/register',
	},
};
