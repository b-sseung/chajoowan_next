import '@/styles/globals.css';
import Head from 'next/head';
import { PortfolioProvider } from '../context/context';
import { prefix } from '../config/config';

export default function App({ Component, pageProps }) {
  return (
    <PortfolioProvider value={{ prefix }}>
      <Head>
        <title>차주완♥찻잔</title>
        <link rel="icon" href="/images/icon.jpg"></link>
      </Head>
      <Component {...pageProps} />
    </PortfolioProvider>
  );
}
