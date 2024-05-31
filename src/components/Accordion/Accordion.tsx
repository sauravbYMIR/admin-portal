'use client';

import Image from 'next/image';
import { type ReactNode, useState } from 'react';

import collapseIcon from '@/public/assets/icons/collapseCircle.svg';
import editIcon from '@/public/assets/icons/edit.svg';
import expandIcon from '@/public/assets/icons/expandCircle.svg';

import { MinusIcon, PlusIcon } from '../Icons/Icons';
import accordionStyles from './accordion.module.scss';

interface AccordionProps {
  children: ReactNode;
  title: string;
  editClickHandler?: () => void;
  type: 'DEPARTMENT' | 'PROCEDURE' | 'SUB-CATEGORY';
}

function Accordion({
  children,
  title,
  editClickHandler,
  type,
}: AccordionProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div className={accordionStyles.accordionContainer}>
      <div
        className={accordionStyles.headerContainer}
        style={
          // eslint-disable-next-line no-nested-ternary
          type === 'PROCEDURE' && isOpen
            ? {
                backgroundColor: 'rgba(225, 247, 254, 1)',
                border: '1px solid rgba(225, 247, 254, 1)',
              }
            : type === 'SUB-CATEGORY' && isOpen
              ? {
                  backgroundColor: 'rgba(242, 250, 252, 1)',
                  border: '1px solid rgba(242, 250, 252, 1)',
                }
              : {}
        }
      >
        <button
          type="button"
          onClick={toggleAccordion}
          className={accordionStyles.headerContentWrapper}
        >
          <div className="cursor-pointer">
            {isOpen ? (
              <div>
                {type === 'PROCEDURE' ? (
                  <MinusIcon className="size-4" stroke="#333" strokeWidth={3} />
                ) : (
                  <Image
                    src={collapseIcon}
                    alt="collapse accordion icon"
                    width={20}
                    height={20}
                  />
                )}
              </div>
            ) : (
              <div>
                {type === 'PROCEDURE' ? (
                  <PlusIcon className="size-4" stroke="#333" strokeWidth={3} />
                ) : (
                  <Image
                    onClick={toggleAccordion}
                    src={expandIcon}
                    alt="expand accordion icon"
                    width={20}
                    height={20}
                  />
                )}
              </div>
            )}
          </div>
          <p
            className={`font-poppins ${type === 'PROCEDURE' ? 'text-base' : 'text-xl'} font-normal text-neutral-1`}
          >
            {title}
          </p>
        </button>
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
