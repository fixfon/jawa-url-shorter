import * as trpc from '@trpc/server';
import { hash, verify } from 'argon2';
import { z } from 'zod';

import { Context } from './context';
import { signUpSchema } from '../../common/validation/auth';

export const serverRouter = trpc
	.router<Context>()
	.mutation('signup', {
		input: signUpSchema,
		resolve: async ({ input, ctx }) => {
			const { username, password, email } = input;

			const checkExistince = await ctx.prisma.user.findFirst({
				where: {
					OR: [{ username }, { email }],
				},
			});

			if (checkExistince) {
				throw new trpc.TRPCError({
					code: 'CONFLICT',
					message: 'User with this email or username already exists',
				});
			}

			const hashedPassword = await hash(password);
			const user = await ctx.prisma.user.create({
				data: { username, email, password: hashedPassword },
			});

			return {
				status: 201,
				message: 'User created successfully',
				result: user.email,
			};
		},
	})
	.mutation('changePassword', {
		input: z.object({
			oldPassword: z.string(),
			newPassword: z.string(),
		}),
		resolve: async ({ input, ctx }) => {
			const { oldPassword, newPassword } = input;
			const user = ctx.session?.user;
			const userRes = await ctx.prisma.user.findFirst({
				where: { username: user?.name! },
			});

			if (!userRes) {
				throw new trpc.TRPCError({
					code: 'NOT_FOUND',
					message: 'User not found',
				});
			}

			const isValidPassworod = await verify(userRes.password, oldPassword);

			if (!isValidPassworod) {
				throw new trpc.TRPCError({
					code: 'CONFLICT',
					message: 'Your current password is not correct.',
				});
			}

			const samePassword = await verify(userRes.password, newPassword);

			if (samePassword) {
				throw new trpc.TRPCError({
					code: 'CONFLICT',
					message: 'Your new password is the same as your old password.',
				});
			}

			const hashedPassword = await hash(newPassword);
			const updatedUser = await ctx.prisma.user.update({
				where: { id: userRes.id },
				data: { password: hashedPassword },
			});

			return {
				status: 201,
				message: 'Password changed successfully',
				result: updatedUser.id,
			};
		},
	})
	.query('slugCheck', {
		input: z.object({
			slug: z.string(),
		}),
		async resolve({ input, ctx }) {
			const { slug } = input;
			if (['login', 'register', 'dashboard', 'admin'].includes(slug)) {
				return {
					used: true,
				};
			}
			const count = await ctx.prisma.shortLink.count({
				where: {
					slug: slug,
				},
			});
			return { used: count > 0 };
		},
	})
	.query('getUserSlugsByPage', {
		input: z.object({
			userId: z.number(),
			pageNumber: z.number(),
			searchParam: z.string().nullish(),
		}),
		async resolve({ input, ctx }) {
			const { userId, pageNumber } = input;
			const searchParam = input.searchParam || undefined;
			const slugs = await ctx.prisma.shortLink.findMany({
				orderBy: {
					id: 'desc',
				},
				take: 10,
				skip: (pageNumber - 1) * 10,
				where: {
					AND: [
						{ creatorId: userId },

						{
							OR: [
								{
									slug: {
										contains: searchParam,
									},
								},
								{
									url: {
										contains: searchParam,
									},
								},
							],
						},
					],
				},
			});

			return { slugs };
		},
	})
	.query('getUserSlugCount', {
		input: z.object({
			userId: z.number(),
			searchParam: z.string().nullish(),
		}),
		async resolve({ input, ctx }) {
			const searchParam = input.searchParam || '';
			const res = await ctx.prisma.user.findFirst({
				where: {
					AND: [
						{ id: input.userId },
						{
							shortLinkIds: {
								some: {
									OR: [
										{
											slug: {
												contains: searchParam,
											},
										},
										{
											url: {
												contains: searchParam,
											},
										},
									],
								},
							},
						},
					],
				},
				include: {
					shortLinkIds: {
						where: {
							OR: [
								{
									slug: {
										contains: searchParam,
									},
								},
								{
									url: {
										contains: searchParam,
									},
								},
							],
						},
					},
				},
			});

			return { slugCount: res && res?.shortLinkIds.length };
		},
	})
	.mutation('createSlug', {
		input: z.object({
			slug: z.string(),
			url: z.string(),
		}),
		async resolve({ input, ctx }) {
			console.log(ctx.session);
			try {
				await ctx.prisma.shortLink.create({
					data: {
						slug: input.slug,
						url: input.url,
					},
				});
			} catch (error) {}
		},
	})
	.mutation('deleteSlug', {
		input: z.object({
			slugId: z.number(),
		}),
		async resolve({ input, ctx }) {
			const { slugId } = input;
			return await ctx.prisma.shortLink.delete({
				where: {
					id: slugId,
				},
			});
		},
	});

export type ServerRouter = typeof serverRouter;
