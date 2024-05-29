import { useRouter } from 'next/navigation';
import React from 'react';

import {
  handleGetLocalStorage,
  handleRemoveFromLocalStorage,
} from '@/utils/global';

import headerStyle from '../Header/header.module.scss';

const LogButton = () => {
  const router = useRouter();
  const accessToken = handleGetLocalStorage({ tokenKey: 'access_token' });
  const handleLogoutUser = () => {
    handleRemoveFromLocalStorage({ tokenKey: 'access_token' });
    handleRemoveFromLocalStorage({ tokenKey: 'refresh_token' });
    router.push('/');
  };
  const [isMounted, setIsMounted] = React.useState<boolean>(false);
  React.useEffect(() => {
    setIsMounted(true);
  }, []);
  if (!isMounted) {
    return null;
  }
  return (
    <ul className="flex list-none items-center gap-8">
      <li>
        {!accessToken ? (
          <button className={headerStyle.headerLoginBtn} type="button">
            Log in
          </button>
        ) : (
          <button
            className={`flex items-center justify-center ${headerStyle.headerLoginBtn}`}
            type="button"
            onClick={handleLogoutUser}
          >
            Log out
          </button>
        )}
      </li>
    </ul>
  );
};

export default LogButton;
