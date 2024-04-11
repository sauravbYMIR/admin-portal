'use client';

import Image from 'next/image';
import { type ReactNode, useState } from 'react';

import collapseIcon from '@/public/assets/icons/collapseCircle.svg';
import editIcon from '@/public/assets/icons/edit.svg';
import expandIcon from '@/public/assets/icons/expandCircle.svg';

import accordionStyles from './accordion.module.scss';

interface AccordionProps {
  children: ReactNode;
  title: string;
  editClickHandler?: () => void;
  // type: 'DEPARTMENT' | 'PROCEDURE' | 'SUB-CATEGORY';
}

function Accordion({
  children,
  title,
  editClickHandler,
  // type,
}: AccordionProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={accordionStyles.accordionContainer}>
      <div className={accordionStyles.headerContainer}>
        <div className={accordionStyles.headerContentWrapper}>
          <button
            onClick={toggleAccordion}
            className="cursor-pointer"
            type="button"
          >
            {isOpen ? (
              <Image
                src={collapseIcon}
                alt="collapse accordion icon"
                width={13.34}
                height={13.34}
              />
            ) : (
              <Image
                onClick={toggleAccordion}
                src={expandIcon}
                alt="expand accordion icon"
                width={13.34}
                height={13.34}
              />
            )}
          </button>
          <p className="font-poppins text-base text-black18">{title}</p>
        </div>
        <button type="button" className="cursor-pointer">
          <Image
            width={16}
            height={16}
            onClick={editClickHandler}
            className="mr-4"
            src={editIcon}
            alt="edit icon"
          />
        </button>
      </div>

      {isOpen && (
        <div className={accordionStyles.contentContainer}>{children}</div>
      )}
    </div>
  );
}

export default Accordion;
