import { trpc } from '../../common/client/trpc';
import { FunctionComponent, useEffect, useRef, useState } from 'react';
import ContentLoader from 'react-content-loader';
import { BiLinkExternal, BiChevronRight, BiChevronLeft } from 'react-icons/bi';
import type { Session } from 'next-auth';

// TODO - Complete skeleton loading
// TODO - Try useInfiniteQuery for pagination. We want to take max 10 results per page when page is changed. Default take first 10 results.
// TODO - Do a search component dynamicyly based on the url or slug.
// ? - useInfiniteQuery may cause problems on search component??? Solve this with another trpc query because we need to search that query in all database.

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
	const [displayedSlugs, setDisplayedSlugs] = useState({});
	const [slugCount, setSlugCount] = useState(0);
	const [page, setPage] = useState(1);
	const [maxPage, setMaxPage] = useState(1);

	const slugCountQuery = trpc.useQuery(
		['getUserSlugCount', { userId: Number(session.user.userId) }],
		{
			refetchOnReconnect: false,
			refetchOnMount: false,
			refetchOnWindowFocus: false,
		}
	);

	const slugCountRefetch = slugCountQuery.refetch;

	const displaySlugQuery = trpc.useQuery(
		[
			'getUserSlugsByPage',
			{ userId: Number(session.user.userId), pageNumber: page },
		],
		{
			refetchOnReconnect: false,
			refetchOnMount: false,
			refetchOnWindowFocus: false,
		}
	);

	const displaySlugRefetch = displaySlugQuery.refetch;

	useEffect(() => {
		console.log('hittes useEffect for slugcount status');
		if (
			slugCountQuery.isFetched &&
			slugCountQuery.data &&
			slugCountQuery.data.slugCount != null
		) {
			setSlugCount(slugCountQuery.data.slugCount);
			setMaxPage(Math.ceil(slugCountQuery.data.slugCount / 10));
		}
	}, [slugCountQuery.isFetched, slugCountQuery.isRefetching]);

	useEffect(() => {
		console.log('hittes useEffect for displayslug status');
		if (displaySlugQuery.isFetched && displaySlugQuery.data) {
			console.log('hit if in useEffect for displayslug status');
			setDisplayedSlugs(() => displaySlugQuery.data.slugs);
			console.log('useEffect queryslug', displaySlugQuery.data.slugs);
		}
	}, [displaySlugQuery.isFetched, displaySlugQuery.isRefetching]);

	useEffect(() => {
		console.log('useEffect displayedSlugs', displayedSlugs);
	}, [displayedSlugs]);

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

	const handleSearch = (e) => {};

	// useEffect(() => {
	// 	console.log(displaySlugQuery.data);
	// }, [page]);

	return (
		<div className='flex h-full w-full min-w-fit flex-col items-center justify-center overflow-hidden bg-blue-920 px-4'>
			<h2 className='text-2xl'>your jawa! list</h2>
			<div className='slugListBox my-4 mx-3 w-full p-4'>
				<div className='searchSlug'>
					<input
						type='text'
						placeholder={"search in your jawa!'s"}
						className='my-1 block rounded-md border bg-white p-2 text-black placeholder-slate-400 shadow-sm focus:border-black focus:outline-none focus:ring-1 sm:text-sm'
					/>
				</div>
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
						{/* {slugs.isLoading && <TableBodySkeleton />}
						{slugs.isFetched && (
							<tbody>
								{slugs.data?.slugs[0].shortLinkIds.map((slugDetail, index) => (
									<tr
										key={index}
										className='transition-colors hover:bg-blue-950'>
										<td className='py-3'>{index + 1}</td>
										<td className='py-3'>{slugDetail.slug}</td>
										<td className='py-3'>
											<a href={slugDetail.url} target='blank'>
												{slugDetail.url} <BiLinkExternal className='inline' />
												{''}
											</a>
										</td>
										<td className='py-3'>
											{new Date(slugDetail.createdAt).toLocaleDateString()}
										</td>
										<td className='py-3'>
											<button
												type='button'
												className='rounded bg-red-700 py-1 px-2.5 transition-colors hover:bg-red-500'>
												delete
											</button>
										</td>
									</tr>
								))}
							</tbody>
						)} */}
					</table>
				</div>
				<div className='slugListFooter mt-8 flex justify-between px-4'>
					{/* {slugQuery.isFetched && (
						<>
							<span className='block'>
								10 jawa!'s listed out of{' '}
								{JSON.stringify(
									slugQuery.data?.slugCount?.shortLinkIds,
									null,
									2
								)}
							</span>
						</>
					)} */}
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
