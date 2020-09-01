import React, { Suspense, FC } from 'react';

import Providers from './Providers';
import App from './App';
import Loading from './Loading';
import ErrorBoundary from './ErrorBoundary';

const Root: FC = () => {
  /**
   * @TODO
   * Add Suspense to suspend when using useLazyLoadQuery
   * Add ErrorBoundary to catch errors in useLazyLoadQuery
   */

  return (
    <ErrorBoundary>
      <Providers>
        <Suspense fallback={<Loading />}>
          <App />
        </Suspense>
      </Providers>
    </ErrorBoundary>
  );
};

export default Root;
