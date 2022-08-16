import { trpc } from '../../common/client/trpc';
import { FunctionComponent, useEffect, useState } from 'react';
import type { Session } from 'next-auth';

type UrlListProps = {
	session: Session;
	status: 'authenticated' | 'loading' | 'unauthenticated';
};

const UrlList: FunctionComponent<UrlListProps> = ({ session, status }) => {
	const [slugCount, setSlugCount] = useState(0);
	const [urlList, setUrlList] = useState([]);

	const slugQuery = trpc.useQuery(
		['getUserSlugCount', { userId: Number(session?.user.userId) }],
		{
			refetchOnReconnect: false,
			refetchOnMount: false,
			refetchOnWindowFocus: false,
		}
	);

	const slugs = trpc.useQuery(
		['getUserSlugs', { userId: Number(session?.user.userId) }],
		{
			refetchOnReconnect: false,
			refetchOnMount: false,
			refetchOnWindowFocus: false,
		}
	);

	return (
		<div className='flex flex-col h-full w-1/6 min-w-fit px-4 justify-center items-center bg-red-400'>
			{slugs.isFetched && (
				<span>
					{slugs.data?.slugs[0].shortLinkIds.map((slugDetail, index) => (
						<div key={index}>
							<p>{new Date(slugDetail.createdAt).toLocaleDateString()}</p>
							<p>{slugDetail.url}</p>
							<p>{slugDetail.slug}</p>
						</div>
					))}
				</span>
			)}
			{slugQuery.isFetched && (
				<>
					<span>
						{JSON.stringify(slugQuery.data?.slugCount?.shortLinkIds, null, 2)}
					</span>
				</>
			)}
		</div>
	);
};

export default UrlList;
