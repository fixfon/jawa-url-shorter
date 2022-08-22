import type { NextPage, InferGetServerSidePropsType } from 'next';
import { Suspense, useEffect } from 'react';
import Layout from '../../components/layout';
import Sidebar from '../../components/dashboard/sidebar';
import UrlList from '../../components/dashboard/url-list';

import { requireAuth } from '../../common/requireAuth';
import { useSession } from 'next-auth/react';

export const getServerSideProps = requireAuth(async (ctx) => {
	return {
		props: {},
	};
});

const Dashboard: NextPage = (
	props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
	const { data: session, status } = useSession();
	return (
		<Suspense>
			<Layout>
				<div className='flex w-[calc(100%-50px)] flex-col-reverse items-center justify-center gap-6 self-center md:flex-row md:items-stretch xl:max-w-7xl'>
					<Sidebar session={session} status={status} />
					{status === 'authenticated' && (
						<UrlList session={session} status={status} />
					)}
				</div>
			</Layout>
		</Suspense>
	);
};

export default Dashboard;
