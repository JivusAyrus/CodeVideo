import Head from 'next/head';
import { RecoilRoot } from 'recoil';
import { withWunderGraph } from '../components/generated/nextjs';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
	return (
    <RecoilRoot>
      <Head>
        <title>Code Video</title>
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="preload"
          href="/fonts/RobotoMono.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />
      </Head>
      <Component {...pageProps} />
    </RecoilRoot>
  );
}

export default withWunderGraph(MyApp);
