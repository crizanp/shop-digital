// pages/_app.js
import '../styles/globals.css';
import Layout from '../components/Layout';
import { LoadingProvider } from '../contexts/LoadingContext';
import { CurrencyProvider } from '../contexts/CurrencyContext';

function MyApp({ Component, pageProps }) {
  return (
    <LoadingProvider>
      <CurrencyProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </CurrencyProvider>
    </LoadingProvider>
  );
}

export default MyApp;