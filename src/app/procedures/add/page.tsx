'use client';

import { FbtButton } from '@frontbase/components-react';
import Image from 'next/image';
import React from 'react';

import {
  Accordion,
  DepartmentModal,
  ProcedureModal,
  WithAuth,
} from '@/components';
import editIcon from '@/public/assets/icons/edit.svg';
import plusIcon from '@/public/assets/icons/plus.svg';

import proceduresStyle from '../procedures.module.scss';

const proceduresApiData = [
  {
    id: 'ac38cdf1-6ceb-4c21-9047-9c1ccec3b352',
    name: {
      en: 'Orthopeadic',
      nb: 'Orthopeadic',
      da: 'Orthopeadic',
      sv: 'Orthopeadi ',
    },
    subCategoryWithProcedures: [
      {
        id: '991bed79-c679-4b6c-a23f-fd0398535f6f',
        name: {
          en: 'Ortho sub1',
          nb: 'Ortho sub1',
          da: 'Ortho sub1',
          sv: 'Ortho sub1',
        },
        procedures: [
          {
            id: 'ded68806-9aae-43e0-a9c5-184b81f42e37',
            name: {
              en: 'Nerve sub',
              nb: 'Nerve sub',
              da: 'Nerve sub',
              sv: 'Nerve sub',
            },
            reimbursement: {
              en: 12999,
              nb: 12999,
              da: 12999,
              sv: 12999,
            },
            categoryId: '991bed79-c679-4b6c-a23f-fd0398535f6f',
          },
        ],
      },
    ],
    procedures: [
      {
        id: '46a192b7-2a19-4bcd-87af-6bee560a5d05',
        name: {
          en: 'Nerve compression',
          nb: 'Nerve compression',
          da: 'Nerve compression',
          sv: 'Nerve compression',
        },
        reimbursement: {
          en: 12999,
          nb: 12999,
          da: 12999,
          sv: 12999,
        },
        categoryId: 'ac38cdf1-6ceb-4c21-9047-9c1ccec3b352',
      },
      {
        id: '46a192b7-2a19-4bcd-87af-6bedye470a5d05',
        name: {
          en: 'Epilepsy',
          nb: 'Epilepsy',
          da: 'Epilepsy',
          sv: 'Epilepsy',
        },
        reimbursement: {
          en: 12479,
          nb: 12949,
          da: 12399,
          sv: 12999,
        },
        categoryId: 'ac38cdf1-6ceb-4c21-0897-9c1ccec3b352',
      },
    ],
  },
  {
    id: '0705917e-397a-4683-9e1e-30ab4fb89bce',
    name: {
      en: 'Ortho',
      nb: 'Ortho',
      da: 'Ortho',
      sv: 'Ortho',
    },
    subCategoryWithProcedures: [
      {
        id: '0627b974-fa44-4c97-ae81-60456953cb62',
        name: {
          en: 'Ortho sub',
          nb: 'Ortho sub',
          da: 'Ortho sub',
          sv: 'Ortho sub',
        },
        procedures: [
          {
            id: '181e6744-e71b-4458-9106-9089e800a8b1',
            name: {
              en: 'Nerve compression1',
              nb: 'Nerve compression1',
              da: 'Nerve compression1',
              sv: 'Nerve compression1',
            },
            reimbursement: {
              en: 12999,
              nb: 12999,
              da: 12999,
              sv: 12999,
            },
            categoryId: '0627b974-fa44-4c97-ae81-60456953cb62',
          },
        ],
      },
    ],
    procedures: [],
  },
];
function AddProcedure() {
  const [departmentModalOpen, setDepartmentModalOpen] =
    React.useState<boolean>(false);
  const [editDepartmentModalOpen, setEditDepartmentModalOpen] =
    React.useState<boolean>(false);
  const [procedureModalOpen, setProcedureModalOpen] =
    React.useState<boolean>(false);
  const [editProcedureModalOpen, setEditProcedureModalOpen] =
    React.useState<boolean>(false);
  const [editSubCategoryModalOpen, setEditSubCategoryModalOpen] =
    React.useState<boolean>(false);
  const [procedureList] =
    React.useState<typeof proceduresApiData>(proceduresApiData);
  return (
    <div className={proceduresStyle.proceduresPageContentContainer}>
      <div className={proceduresStyle.titleContainer}>
        <h2 className={proceduresStyle.title}>Procedures list</h2>

        <p className={proceduresStyle.desc}>
          List of all Procedures listed on the platform
        </p>
      </div>

      {procedureList.length > 0 && (
        <div className={proceduresStyle.addDeptProcedureBtnContainer}>
          <FbtButton
            className={proceduresStyle.addDepartmentBtn}
            size="sm"
            variant="solid"
            onClick={() => setDepartmentModalOpen(true)}
          >
            <Image
              src={plusIcon}
              alt="plus icon cta button"
              width={25}
              height={25}
            />
            <p className={proceduresStyle.btnText}>Create a department</p>
          </FbtButton>

          <FbtButton
            className={proceduresStyle.addDepartmentBtn}
            size="sm"
            variant="solid"
            onClick={() => setProcedureModalOpen(true)}
          >
            <Image
              src={plusIcon}
              alt="plus icon cta button"
              width={25}
              height={25}
            />
            <p className={proceduresStyle.btnText}>Create a procedure</p>
          </FbtButton>
        </div>
      )}

      {procedureList.length <= 0 && (
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
      )}

      <div
        style={{ marginBottom: '80px' }}
        className={proceduresStyle.departmentAccordionContainer}
      >
        {proceduresApiData.map((procedureData) => {
          return (
            <Accordion
              editClickHandler={() => setEditDepartmentModalOpen(true)}
              key={procedureData.id}
              title={procedureData.name.en}
            >
              {procedureData.procedures.length > 0 && (
                <div className={proceduresStyle.proceduresAccordionContainer}>
                  {procedureData.procedures.map((procedure) => {
                    return (
                      <Accordion
                        editClickHandler={() => {
                          setEditProcedureModalOpen(true);
                        }}
                        key={procedure.id}
                        title={procedure.name.en}
                      >
                        <div>
                          {Object.entries(procedure.reimbursement).map(
                            ([key, value]) => {
                              return (
                                <div key={key}>
                                  <p>Reimbursement for {key}</p>
                                  <p>{value}</p>
                                </div>
                              );
                            },
                          )}
                        </div>
                      </Accordion>
                    );
                  })}
                </div>
              )}

              {procedureData.subCategoryWithProcedures.length > 0 &&
                procedureData.subCategoryWithProcedures.map(
                  (subCategoryData) => {
                    return (
                      <div key={subCategoryData.id}>
                        <div
                          className={proceduresStyle.subCategoryTitleWrapper}
                        >
                          <p> {subCategoryData.name.en} </p>

                          <Image
                            className={proceduresStyle.subCategoryEditIcon}
                            onClick={() => setEditSubCategoryModalOpen(true)}
                            src={editIcon}
                            alt="sub category edit icon"
                          />
                        </div>

                        {subCategoryData.procedures.length > 0 && (
                          <div
                            className={
                              proceduresStyle.subCategoryAccordionContainer
                            }
                          >
                            {subCategoryData.procedures.map((procedure) => {
                              return (
                                <Accordion
                                  key={procedure.id}
                                  title={procedure.name.en}
                                >
                                  <div>
                                    {Object.entries(
                                      procedure.reimbursement,
                                    ).map(([key, value]) => {
                                      return (
                                        <div key={key}>
                                          <p>Reimbursement for {key}</p>
                                          <p>{value}</p>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </Accordion>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  },
                )}
            </Accordion>
          );
        })}
      </div>

      <DepartmentModal
        isOpen={departmentModalOpen}
        onClose={() => setDepartmentModalOpen(false)}
        isEdit={false}
      />

      <DepartmentModal
        isOpen={editDepartmentModalOpen}
        onClose={() => setEditDepartmentModalOpen(false)}
        isEdit
      />

      <ProcedureModal
        isOpen={procedureModalOpen}
        onClose={() => setProcedureModalOpen(false)}
        isEdit={false}
      />

      <ProcedureModal
        isOpen={editProcedureModalOpen}
        onClose={() => setEditProcedureModalOpen(false)}
        isEdit
        editSubCategory={false}
      />

      <ProcedureModal
        isOpen={editSubCategoryModalOpen}
        onClose={() => setEditSubCategoryModalOpen(false)}
        isEdit
        editSubCategory
      />
    </div>
  );
}

export default WithAuth(AddProcedure);
