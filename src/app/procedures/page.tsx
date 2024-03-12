'use client';

import { FbtButton } from '@frontbase/components-react';
import Image from 'next/image';
import { useState } from 'react';

import { DepartmentModal, Header, ProcedureModal } from '@/components';
import plusIcon from '@/public/assets/icons/plus.svg';

import proceduresStyle from './procedures.module.scss';

function ProceduresList() {
  const [departmentModalOpen, setDepartmentModalOpen] = useState(false);
  const [procedureModalOpen, setProcedureModalOpen] = useState(false);

  return (
    <div>
      <Header />
      <div className={proceduresStyle.proceduresPageContentContainer}>
        <div className={proceduresStyle.titleContainer}>
          <h2 className={proceduresStyle.title}>Procedures list</h2>

          <p className={proceduresStyle.desc}>
            List of all Procedures listed on the platform
          </p>
        </div>

        <div>
          <FbtButton
            className={proceduresStyle.addDepartmentBtn}
            size="sm"
            variant="solid"
            onClick={() => setDepartmentModalOpen(true)}
          >
            <Image src={plusIcon} alt="plus icon cta button" />
            <p className={proceduresStyle.btnText}>Create a department</p>
          </FbtButton>

          <FbtButton
            className={proceduresStyle.addDepartmentBtn}
            size="sm"
            variant="solid"
            onClick={() => setProcedureModalOpen(true)}
          >
            <Image src={plusIcon} alt="plus icon cta button" />
            <p className={proceduresStyle.btnText}>Create a procedure</p>
          </FbtButton>
        </div>

        <div className={proceduresStyle.addDepartmentContainer}>
          <h2 className={proceduresStyle.subTitle}>
            No departments have been add yet!
          </h2>

          <FbtButton
            className={proceduresStyle.addDepartmentBtn}
            size="sm"
            variant="solid"
            onClick={() => setDepartmentModalOpen(true)}
          >
            <Image src={plusIcon} alt="plus icon cta button" />
            <p className={proceduresStyle.btnText}>Add a department</p>
          </FbtButton>
        </div>

        <DepartmentModal
          isOpen={departmentModalOpen}
          onClose={() => setDepartmentModalOpen(false)}
          isEdit={false}
        />

        <ProcedureModal
          isOpen={procedureModalOpen}
          onClose={() => setProcedureModalOpen(false)}
        />
      </div>
    </div>
  );
}

export default ProceduresList;
