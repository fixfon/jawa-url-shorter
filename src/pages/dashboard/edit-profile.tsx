import type { NextPage, InferGetServerSidePropsType } from 'next';
import { Suspense } from 'react';
import Layout from '../../components/layout';
import Sidebar from '../../components/dashboard/sidebar';
import EditProfileContainer from '../../components/dashboard/edit-profile';

import { useSession } from 'next-auth/react';

import { requireAuth } from '../../common/requireAuth';

// TODO add only password change here.

export const getServerSideProps = requireAuth(async (ctx) => {
	return { props: {} };
});

const EditProfile: NextPage = (
	props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
	const { data: session, status } = useSession({
		required: true,
	});

	return (
		<Suspense>
			<Layout>
				<div className='flex w-full max-w-7xl flex-row items-center justify-center self-center'>
					<Sidebar session={session} status={status} />
					<EditProfileContainer session={session} status={status} />
				</div>
			</Layout>
		</Suspense>
	);
};

export default EditProfile;
