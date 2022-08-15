import type { NextPage } from 'next';
import { useSession, signOut } from 'next-auth/react';

import { requireAuth } from '../common/requireAuth';

export const getServerSideProps = requireAuth(async (ctx) => {
	return { props: {} };
});

const Dashboard: NextPage = () => {
	const { data } = useSession();

	return (
		<div>
			<div>Your are logged in!</div>
			<code>{JSON.stringify(data, null, 2)}</code>
			<button
				className='btn btn-secondary'
				onClick={() => signOut({ callbackUrl: '/' })}>
				logout
			</button>
		</div>
	);
};

export default Dashboard;
