import '../styles/globals.css';
import Head from 'next/head';
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { withTRPC } from '@trpc/next';
import { ServerRouter } from '../server/router/router';

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
	console.log('Hitted MyApp _app.tsx');
	return (
		<>
			<Head>
				<title>Jawa!</title>
				<meta name='description' content='Jawa! | Your Effective URL Shorter' />
				{/* <link
					rel='apple-touch-icon'
					sizes='57x57'
					href='/apple-icon-57x57.png'
				/>
				<link
					rel='apple-touch-icon'
					sizes='60x60'
					href='/apple-icon-60x60.png'
				/>
				<link
					rel='apple-touch-icon'
					sizes='72x72'
					href='/apple-icon-72x72.png'
				/>
				<link
					rel='apple-touch-icon'
					sizes='76x76'
					href='/apple-icon-76x76.png'
				/>
				<link
					rel='apple-touch-icon'
					sizes='114x114'
					href='/apple-icon-114x114.png'
				/>
				<link
					rel='apple-touch-icon'
					sizes='120x120'
					href='/apple-icon-120x120.png'
				/>
				<link
					rel='apple-touch-icon'
					sizes='144x144'
					href='/apple-icon-144x144.png'
				/>
				<link
					rel='apple-touch-icon'
					sizes='152x152'
					href='/apple-icon-152x152.png'
				/>
				<link
					rel='apple-touch-icon'
					sizes='180x180'
					href='/apple-icon-180x180.png'
				/>
				<link
					rel='icon'
					type='image/png'
					sizes='192x192'
					href='/android-icon-192x192.png'
				/>
				<link
					rel='icon'
					type='image/png'
					sizes='32x32'
					href='/favicon-32x32.png'
				/>
				<link
					rel='icon'
					type='image/png'
					sizes='96x96'
					href='/favicon-96x96.png'
				/>
				<link
					rel='icon'
					type='image/png'
					sizes='16x16'
					href='/favicon-16x16.png'
				/>
				<link rel='manifest' href='/manifest.json' />
				<meta name='msapplication-TileColor' content='#ffffff' />
				<meta name='msapplication-TileImage' content='/ms-icon-144x144.png' />
				<meta name='theme-color' content='#ffffff' />
				<meta name='application-name' content='Jawa!' /> */}
			</Head>
			<SessionProvider session={pageProps.session}>
				<Component {...pageProps} />
			</SessionProvider>
		</>
	);
}

function getBaseUrl() {
	console.log('Hitted getBaseUrl _app.tsx');
	if (process.browser) return '';
	if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;

	return `https://localhost:${process.env.PORT ?? 3000}`;
}

export default withTRPC<ServerRouter>({
	config({ ctx }) {
		console.log('Hitted withTRPC config _app.tsx');
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
