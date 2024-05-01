'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import brandLogo from '@/public/assets/images/brandLogo.svg';
import {
  handleGetLocalStorage,
  handleRemoveFromLocalStorage,
} from '@/utils/global';

import headerStyle from './header.module.scss';

const menuItems = {
  links: [
    {
      name: 'Patients',
      link: '/patients',
    },
    {
      name: 'Procedures',
      link: '/procedures',
    },
    {
      name: 'Hospitals',
      link: '/hospitals',
    },
  ],
};

function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const accessToken = handleGetLocalStorage({ tokenKey: 'access_token' });
  const handleLogoutUser = () => {
    handleRemoveFromLocalStorage({ tokenKey: 'access_token' });
    handleRemoveFromLocalStorage({ tokenKey: 'refresh_token' });
    router.push('/');
  };
  return (
    <nav className={` h-24 w-full items-center ${headerStyle.headerContainer}`}>
      <div>
        <Image src={brandLogo} alt="branch icon" width={120} height={48} />
      </div>
      <ul
        className={` flex list-none items-center gap-8 ${headerStyle.headerLinkContainer}`}
      >
        {menuItems.links.map((menu) => {
          return (
            <li key={`${menu.name}`}>
              <Link
                className={`text-left font-poppins text-base font-semibold  ${pathname.startsWith(menu.link) ? 'text-darkteal underline decoration-2 underline-offset-4' : ''}`}
                href={menu.link}
              >
                {menu.name}
              </Link>
            </li>
          );
        })}
      </ul>

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
    </nav>
  );
}

export default Header;
