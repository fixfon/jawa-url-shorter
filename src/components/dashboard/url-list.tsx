import { trpc } from '../../common/client/trpc';
import { FunctionComponent, useEffect, useRef, useState } from 'react';
import ContentLoader from 'react-content-loader';
import { BiLinkExternal, BiChevronRight, BiChevronLeft } from 'react-icons/bi';
import type { Session } from 'next-auth';
import { debounce } from 'lodash';
import type { ShortLink } from '@prisma/client';
import Link from 'next/link';

// TODO - Complete skeleton loading

type UrlListProps = {
	session: Session;
	status: 'authenticated' | 'loading' | 'unauthenticated';
};

const TableBodySkeleton = () => {
	return (
		<tbody>
			{Array(20)
				.fill(0)
				.map((_, i) => (
					<tr key={i}>
						<td>
							<div className=''></div>
						</td>
						<td className=''>
							<div className=''></div>
						</td>
						<td className=''>
							<div className=''></div>
						</td>
						<td className=''>
							<div className=''></div>
						</td>
						<td className=''>
							<div className=''></div>
						</td>
					</tr>
				))}
		</tbody>
	);
};

const UrlList: FunctionComponent<UrlListProps> = ({ session, status }) => {
	const [displayedSlugs, setDisplayedSlugs] = useState<ShortLink[]>([]);
	const [searchParam, setSearchParam] = useState('');
	const [slugCount, setSlugCount] = useState(0);
	const [page, setPage] = useState(1);
	const [maxPage, setMaxPage] = useState(1);

	// Query for slug count of the authenticated user - searches the count with params if there is one
	const slugCountQuery = trpc.useQuery(
		[
			'getUserSlugCount',
			{ userId: Number(session.user.userId), searchParam: searchParam },
		],
		{
			refetchOnReconnect: false,
			refetchOnMount: false,
			refetchOnWindowFocus: false,
		}
	);
	const slugCountRefetch = slugCountQuery.refetch; // Refetch the slug count query

	// Query for the slugs of the authenticated user - searches the slugs with params (if there is one) and returns a list
	const displaySlugQuery = trpc.useQuery(
		[
			'getUserSlugsByPage',
			{
				userId: Number(session.user.userId),
				pageNumber: page,
				searchParam: searchParam,
			},
		],
		{
			refetchOnReconnect: false,
			refetchOnMount: false,
			refetchOnWindowFocus: false,
		}
	);
	const displaySlugRefetch = displaySlugQuery.refetch; // Refetch the slug list query

	// Delete slug mutation
	const deleteSlugMutation = trpc.useMutation(['deleteSlug'], {
		onSuccess: () => {
			slugCountRefetch();
			displaySlugRefetch();
		},
	});

	// Could be a better way to set page, maxPage, displayed slug list other than keep calling with useEffect hook???
	useEffect(() => {
		console.log('hittes useEffect for slugcount status');
		if (
			slugCountQuery.isFetched &&
			slugCountQuery.data &&
			slugCountQuery.data.slugCount != null
		) {
			console.log('slugCountQuery', slugCountQuery.data.slugCount);
			setSlugCount(slugCountQuery.data.slugCount);
			setMaxPage(Math.ceil(slugCountQuery.data.slugCount / 10));
		}
	}, [slugCountQuery.isFetched, slugCountQuery.isRefetching]);

	useEffect(() => {
		console.log('hittes useEffect for displayslug status');
		if (displaySlugQuery.isFetched && displaySlugQuery.data) {
			console.log('hit if in useEffect for displayslug status');
			setDisplayedSlugs(displaySlugQuery.data.slugs);
			console.log('useEffect queryslug', displaySlugQuery.data.slugs);
		}
	}, [displaySlugQuery.isFetched, displaySlugQuery.isRefetching]);

	const handlePrevPage = () => {
		if (page <= 1) return;
		setPage((prevPage) => prevPage - 1);
		displaySlugRefetch();
	};

	const handleNextPage = () => {
		if (page >= maxPage) return;
		setPage((prevPage) => prevPage + 1);
		displaySlugRefetch();
	};

	// Did I use the debounce function correctly?
	const handleSearch = (e) => {
		setSearchParam(e.target.value);
		setPage(1);
		debounce(displaySlugRefetch, 200);
		debounce(slugCountRefetch, 200);
	};

	const handleDeleteSlug = async (slugId: number) => {
		deleteSlugMutation.mutate({ slugId });
	};

	return (
		<div className='flex h-full w-full min-w-fit flex-col items-center justify-center overflow-hidden bg-blue-920 px-4'>
			<h2 className='text-2xl'>your jawa! list</h2>
			<div className='slugListBox my-4 mx-3 flex w-full flex-col p-4'>
				<div className='searchSlug'>
					<input
						type='text'
						onChange={handleSearch}
						placeholder={"search in your jawa!'s"}
						className='my-1 block rounded-md border bg-white p-2 text-black placeholder-slate-400 shadow-sm focus:border-black focus:outline-none focus:ring-1 sm:text-sm'
					/>
				</div>

				{deleteSlugMutation.error && (
					<div className='slugError mt-6 w-fit self-center rounded border-2 border-solid border-red-700 bg-red-700 py-1 px-4 text-center'>
						<p className='block font-semibold text-white'>
							Something went wrong while deleting your slug! Try again later.
						</p>
					</div>
				)}

				<div className='slugTable'>
					<table className='mt-6 w-full items-center text-center'>
						<thead className='border-b-2'>
							<tr>
								<th>#</th>
								<th>slug</th>
								<th>url</th>
								<th>created</th>
								<th>action</th>
							</tr>
						</thead>
						{(displaySlugQuery.isLoading || displaySlugQuery.isRefetching) && (
							<TableBodySkeleton />
						)}
						{displaySlugQuery.isFetched && (
							<tbody>
								{displayedSlugs.map((slugDetail, index) => (
									<tr
										key={index}
										className='transition-colors hover:bg-blue-950'>
										<td className='py-3'>{index + (page - 1) * 10 + 1}</td>
										<td className='py-3'>
											<Link href={'/' + slugDetail.slug} passHref>
												<a target='_blank'>
													{slugDetail.slug}
													<BiLinkExternal className='inline ml-2' />
												</a>
											</Link>
										</td>
										<td className='py-3'>{slugDetail.url}</td>
										<td className='py-3'>
											{slugDetail.createdAt &&
												new Date(slugDetail.createdAt).toLocaleDateString()}
										</td>
										<td className='py-3'>
											<button
												type='button'
												onClick={() => handleDeleteSlug(slugDetail.id)}
												className='rounded bg-red-700 py-1 px-2.5 transition-colors hover:bg-red-500'>
												delete
											</button>
										</td>
									</tr>
								))}
							</tbody>
						)}
					</table>
				</div>
				<div className='slugListFooter mt-8 flex justify-between px-4'>
					{displaySlugQuery.isFetched && (
						<>
							<span className='block'>
								10 jawa!'s listed out of {slugCount}
							</span>
						</>
					)}
					<div className='flex items-center justify-center'>
						<button
							type='button'
							className='pr-1 text-2xl'
							onClick={handlePrevPage}
							disabled={page <= 1}>
							<BiChevronLeft />
						</button>
						<span>{page + '/' + maxPage}</span>
						<button
							type='button'
							className='pl-1 text-2xl'
							onClick={handleNextPage}
							disabled={page == maxPage}>
							<BiChevronRight />
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default UrlList;
