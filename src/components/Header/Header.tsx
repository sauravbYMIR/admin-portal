'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import { brandName } from '@/utils/global';

import LogButton from '../LogButton/LogButton';
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
  return (
    <nav className={`h-24 w-full items-center ${headerStyle.headerContainer}`}>
      <button type="button" onClick={() => router.push('/patients')}>
        <h1 className="text-3xl font-semibold text-darkteal">{brandName}</h1>
      </button>
      <ul
        className={` flex list-none items-center gap-8 ${headerStyle.headerLinkContainer}`}
      >
        {menuItems.links.map((menu) => {
          return (
            <li key={`${menu.name}`}>
              <Link
                className={`text-left font-poppins text-base font-semibold  ${pathname.startsWith(menu.link) ? 'text-darkteal underline decoration-2 underline-offset-[5px]' : ''}`}
                href={menu.link}
              >
                {menu.name}
              </Link>
            </li>
          );
        })}
      </ul>

      <LogButton />
    </nav>
  );
}

export default Header;
