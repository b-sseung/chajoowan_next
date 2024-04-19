import '@/styles/globals.css';
import Head from 'next/head';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>차주완♥찻잔</title>
        <link rel="icon" href="/images/icon.jpg"></link>
      </Head>
      <Component {...pageProps} />
    </>
  );
}
