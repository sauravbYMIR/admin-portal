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

import brandLogo from '@/public/assets/images/brandLogo.svg';

import headerStyle from './header.module.scss';

const menuItems = ['How it works', 'Our Hospitals', 'FAQs'];

function Header() {
  return (
    <FbtHeader className={headerStyle.headerContainer}>
      <FbtHeaderBrand>
        <Image src={brandLogo} alt="branch icon" width={120} height={48} />
      </FbtHeaderBrand>

      <FbtHeaderContent className={headerStyle.headerLinkContainer}>
        {menuItems.map((menu) => {
          return (
            <FbtHeaderItem key={menu}>
              <Link className={headerStyle.headerLink} href="./">
                {menu}
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
