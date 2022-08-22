import type { NextPage, InferGetServerSidePropsType } from 'next';
import { Suspense } from 'react';
import Layout from '../../components/layout';
import Sidebar from '../../components/dashboard/sidebar';
import EditProfileContainer from '../../components/dashboard/edit-profile';

import { useSession } from 'next-auth/react';

import { requireAuth } from '../../common/requireAuth';

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
				<div className='flex w-[calc(100%-50px)] flex-col-reverse items-center justify-center gap-6 self-center md:flex-row md:items-stretch xl:max-w-7xl'>
					<Sidebar session={session} status={status} />
					<EditProfileContainer session={session} status={status} />
				</div>
			</Layout>
		</Suspense>
	);
};

export default EditProfile;
