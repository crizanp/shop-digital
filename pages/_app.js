// pages/_app.js
import '../styles/globals.css';
import Layout from '../components/Layout';
import { LoadingProvider } from '../contexts/LoadingContext';

function MyApp({ Component, pageProps }) {
  return (
    <LoadingProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </LoadingProvider>
  );
}

export default MyApp;