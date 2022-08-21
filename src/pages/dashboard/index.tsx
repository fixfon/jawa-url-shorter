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

const Dashboard: NextPage = () => {
	const { data: session, status } = useSession();
	return (
		<Suspense>
			<Layout>
				<div className='flex flex-row self-center items-center justify-center max-w-7xl w-full'>
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
