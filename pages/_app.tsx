import { withWunderGraph } from '../components/generated/nextjs';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
	return <Component {...pageProps} />;
}

export default withWunderGraph(MyApp);
