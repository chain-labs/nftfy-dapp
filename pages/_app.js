import { useEffect } from 'react';
import { debounce } from 'lodash';
import Head from 'next/head';

import theme from 'styleguide/theme';
import { StatesProvider } from 'src/components/StatesContext'
import Navbar from 'src/components/Navbar';

import 'styleguide/globalStyles.css';
import { ThemeProvider } from 'styled-components';

const MyApp = ({ Component, pageProps }) => {
	useEffect(() => {
		// Set a custom CSS Property for Height
		// See https://css-tricks.com/the-trick-to-viewport-units-on-mobile/

		// First we get the viewport height and we multiple it by 1% to get a value for a vh unit
		if (process.browser) {
			const vh = window.innerHeight * 0.01;
			// Then we set the value in the --vh custom property to the root of the document
			document.documentElement.style.setProperty('--vh', `${vh}px`);

			const handleResize = debounce(() => {
				// We execute the same script as before
				const vh = window.innerHeight * 0.01;
				document.documentElement.style.setProperty('--vh', `${vh}px`);
			}, 150);

			window.addEventListener('resize', handleResize);
			return () => {
				if (process.browser) {
					window.removeEventListener('resize', handleResize);
				}
			};
		}
	});

	return (
		<>
			<Head>
				<title>NFTfy</title>
				<link href="https://api.fontshare.com/css?f[]=switzer@300,400,500,600,700,800&display=swap" rel="stylesheet"/>
				<link rel="shortcut icon" href="/static/images/logo.png" />
			</Head>
			<StatesProvider>
				<ThemeProvider theme={theme}>
					<Navbar />
					<Component {...pageProps} />
				</ThemeProvider>
			</StatesProvider>
		</>
	);
};

export default MyApp;
