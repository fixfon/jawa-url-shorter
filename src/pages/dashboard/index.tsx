import type { NextPage } from 'next';
import { Suspense } from 'react';
import Layout from '../../components/layout';
import Sidebar from '../../components/dashboard/sidebar';
import UrlList from '../../components/dashboard/urlList';

import { useSession } from 'next-auth/react';

import { requireAuth } from '../../common/requireAuth';

export const getServerSideProps = requireAuth(async (ctx) => {
	return { props: {} };
});

const Dashboard: NextPage = () => {
	const { data: session, status } = useSession({
		required: true,
	});

	return (
		<Suspense>
			<Layout>
				<div className='flex flex-row justify-center items-center px-8'>
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
