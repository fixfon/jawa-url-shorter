import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { Suspense } from 'react';
import Layout from '../components/layout';

const CreateLinkForm = dynamic(() => import('../components/create-link'), {
	ssr: false,
});

const Home: NextPage = (props) => {
	return (
		<Suspense>
			<Layout>
				<div className='flex flex-col items-center justify-center'>
					<Head>
						<title>Jawa!</title>
						<meta
							name='description'
							content='Jawa! | Your Effective URL Shorter'
						/>
					</Head>
					<CreateLinkForm />
				</div>
			</Layout>
		</Suspense>
	);
};

export default Home;
