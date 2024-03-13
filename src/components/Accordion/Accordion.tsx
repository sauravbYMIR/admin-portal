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
}

function Accordion({ children, title, editClickHandler }: AccordionProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={accordionStyles.accordionContainer}>
      <div className={accordionStyles.headerContainer}>
        <div className={accordionStyles.headerContentWrapper}>
          {isOpen ? (
            <Image
              onClick={toggleAccordion}
              src={collapseIcon}
              alt="collapse accordion icon"
            />
          ) : (
            <Image
              onClick={toggleAccordion}
              src={expandIcon}
              alt="expand accordion icon"
            />
          )}

          <p>{title}</p>
        </div>

        <Image
          onClick={editClickHandler}
          className={accordionStyles.editIcon}
          src={editIcon}
          alt="edit icon"
        />
      </div>

      {isOpen && (
        <div className={accordionStyles.contentContainer}>{children}</div>
      )}
    </div>
  );
}

export default Accordion;
