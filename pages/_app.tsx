import Head from 'next/head';
import { withWunderGraph } from '../components/generated/nextjs';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
	return (
    <>
      <Head>
        <title>Code Video</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default withWunderGraph(MyApp);
