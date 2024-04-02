'use client';

import {
  FbtButton,
  FbtHeader,
  FbtHeaderBrand,
  FbtHeaderContent,
  FbtHeaderItem,
} from '@frontbase/components-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import brandLogo from '@/public/assets/images/brandLogo.svg';

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
  const pathname = usePathname();
  return (
    <FbtHeader className={headerStyle.headerContainer}>
      <FbtHeaderBrand>
        <Image src={brandLogo} alt="branch icon" width={120} height={48} />
      </FbtHeaderBrand>

      <FbtHeaderContent className={headerStyle.headerLinkContainer}>
        {menuItems.links.map((menu) => {
          return (
            <FbtHeaderItem key={`${menu.name}`}>
              <Link
                className={`text-left font-poppins text-base font-semibold  ${pathname.startsWith(menu.link) ? 'text-darkteal underline decoration-2 underline-offset-2' : ''}`}
                href={menu.link}
              >
                {menu.name}
              </Link>
            </FbtHeaderItem>
          );
        })}
      </FbtHeaderContent>

      <FbtHeaderContent>
        <FbtHeaderItem>
          <FbtButton
            className={headerStyle.headerLoginBtn}
            size="lg"
            variant="outline"
          >
            Log in
          </FbtButton>
        </FbtHeaderItem>
      </FbtHeaderContent>
    </FbtHeader>
  );
}

export default Header;
