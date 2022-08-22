import '../styles/globals.css';
import Head from 'next/head';
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { withTRPC } from '@trpc/next';
import { ServerRouter } from '../server/router/router';

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
	return (
		<>
			<Head>
				<title>Jawa!</title>
				<meta name='description' content='Jawa! | Your Effective URL Shorter' />
				<link rel='icon' href='favicon.ico' />
				<link
					rel='apple-touch-icon'
					sizes='180x180'
					href='apple-touch-icon.png'
				/>
				<link
					rel='icon'
					type='image/png'
					sizes='32x32'
					href='favicon-32x32.png'
				/>
				<link
					rel='icon'
					type='image/png'
					sizes='16x16'
					href='favicon-16x16.png'
				/>
				<link rel='manifest' href='manifest.json' />
				<link rel='mask-icon' href='safari-pinned-tab.svg' color='#5bbad5' />
				<meta name='msapplication-TileColor' content='#da532c' />
				<meta name='theme-color' content='#ffffff' />
			</Head>
			<SessionProvider session={pageProps.session}>
				<Component {...pageProps} />
			</SessionProvider>
		</>
	);
}

function getBaseUrl() {
	if (process.browser) return '';
	if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;

	return `https://localhost:${process.env.PORT ?? 3000}`;
}

export default withTRPC<ServerRouter>({
	config({ ctx }) {
		const url = `${getBaseUrl()}/api/trpc`;

		return {
			url,
			headers: {
				'x-ssr': '1',
			},
		};
	},
	ssr: true,
})(MyApp);
