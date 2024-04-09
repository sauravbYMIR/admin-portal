/* eslint-disable consistent-return */
/* eslint-disable react/jsx-no-useless-fragment */
import { useRouter } from 'next/navigation';
import type { ComponentType } from 'react';
import React from 'react';

import { handleGetLocalStorage } from '@/utils/global';

function WithAuth<P extends object>(Component: ComponentType<P>) {
  return function IsAuth(props: P) {
    const [isAuthenticated, setIsAuthenticated] =
      React.useState<boolean>(false);
    const accessToken = handleGetLocalStorage({ tokenKey: 'access_token' });
    const router = useRouter();
    React.useEffect(() => {
      if (!accessToken) {
        setIsAuthenticated(false);
        router.push('/');
        return;
      }
      setIsAuthenticated(true);
    }, [accessToken, router]);

    if (!isAuthenticated) {
      return null;
    }

    return <Component {...props} />;
  };
}

export { WithAuth };
