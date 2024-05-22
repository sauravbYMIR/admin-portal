/* eslint-disable no-nested-ternary */
/* eslint-disable unused-imports/no-unused-vars */
/* eslint-disable @typescript-eslint/naming-convention */

'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';

import {
  Accordion,
  CustomHomePage,
  DepartmentModal,
  PlusIcon,
  ProcedureModal,
  TaskList,
  WithAuth,
} from '@/components';
import { useGetAllDepartmentWithProcedure } from '@/hooks/useDepartment';
import editIcon from '@/public/assets/icons/edit.svg';
import plusIcon from '@/public/assets/icons/plus.svg';
import type { LangType } from '@/types/global';

import proceduresStyle from './procedures.module.scss';

function ReimbursementWrapper({
  name,
  value,
}: {
  name: LangType;
  value: number;
}) {
  return (
    <div key={name} className="w-1/2 p-3">
      <p className="font-lexend text-xl font-normal text-neutral-2">
        Reimbursement for {name}
      </p>
      <p className="font-lexend text-base font-light">{value}</p>
    </div>
  );
}

function ProceduresList() {
  const [editDepartmentModalOpen, setEditDepartmentModalOpen] =
    React.useState<boolean>(false);
  const [editProcedureModalOpen, setEditProcedureModalOpen] =
    React.useState<boolean>(false);
  const [editSubCategoryModalOpen, setEditSubCategoryModalOpen] =
    React.useState<boolean>(false);
  const [isEditSubCategory, setIsEditSubCategory] =
    React.useState<boolean>(false);
  const [updateId, setUpdateId] = React.useState<string>('');
  const [isEditData, setIsEditData] = React.useState<boolean>(false);
  const departmentProcedureList = useGetAllDepartmentWithProcedure();
  const router = useRouter();
  return (
    <>
      {editDepartmentModalOpen && (
        <DepartmentModal
          isOpen={editDepartmentModalOpen}
          onClose={() => setEditDepartmentModalOpen(false)}
          isEdit={isEditData}
          updateId={updateId}
        />
      )}
      {isEditSubCategory ? (
        <ProcedureModal
          isOpen={editSubCategoryModalOpen}
          onClose={() => setEditSubCategoryModalOpen(false)}
          isEdit={isEditData}
          editSubCategory={isEditSubCategory}
          updateId={updateId}
        />
      ) : (
        <ProcedureModal
          isOpen={editProcedureModalOpen}
          onClose={() => setEditProcedureModalOpen(false)}
          isEdit={isEditData}
          editSubCategory={isEditSubCategory}
          updateId={updateId}
        />
      )}
      {editProcedureModalOpen && (
        <ProcedureModal
          isOpen={editProcedureModalOpen}
          onClose={() => setEditProcedureModalOpen(false)}
          isEdit={isEditData}
          editSubCategory={false}
          updateId={updateId}
        />
      )}
      <CustomHomePage
        heading="Procedure List"
        subHeading="List of all Procedures listed on the platform"
      >
        <div className="mb-11 flex w-[480px] items-center justify-between">
          <button
            className="flex items-center rounded-[6.4px] border border-darkteal bg-darkteal px-4 py-3 text-white hover:bg-darkteal/90 active:bg-darkteal/90"
            type="button"
            onClick={() => {
              setIsEditData(false);
              setEditDepartmentModalOpen(true);
            }}
          >
            <PlusIcon className="size-[25px]" />
            <p className="ml-2 font-poppins text-base font-medium">
              Create a department
            </p>
          </button>
          <button
            className="flex items-center rounded-[6.4px] border border-darkteal bg-darkteal px-4 py-3 text-white hover:bg-darkteal/90 active:bg-darkteal/90"
            type="button"
            onClick={() => {
              setIsEditData(false);
              setEditProcedureModalOpen(true);
            }}
          >
            <PlusIcon className="size-[25px]" />
            <p className="ml-2 font-poppins text-base font-medium">
              Create a procedure
            </p>
          </button>
        </div>
        {departmentProcedureList.isSuccess ? (
          Array.isArray(
            departmentProcedureList.data.data.allCategoryWithProcedure,
          ) &&
          departmentProcedureList.data.data.allCategoryWithProcedure.length >
            0 ? (
            departmentProcedureList.data.data.allCategoryWithProcedure.map(
              (procedureData) => {
                return (
                  <div key={procedureData.id} className="mb-3">
                    <Accordion
                      editClickHandler={() => {
                        setUpdateId(procedureData.id);
                        setIsEditData(true);
                        setEditDepartmentModalOpen(true);
                      }}
                      title={procedureData.name.en}
                    >
                      {procedureData.subCategoryWithProcedures.length > 0 &&
                        procedureData.subCategoryWithProcedures.map(
                          (subCategoryData, index) => {
                            return (
                              <ol key={subCategoryData.id}>
                                <li className="flex items-center justify-between px-4 py-2">
                                  <p className="font-poppins text-sm font-medium text-darkteal">
                                    <span className="mr-1">{index + 1}.</span>
                                    <span>{subCategoryData.name.en}</span>
                                  </p>
                                  <button
                                    type="button"
                                    className="ml-2 cursor-pointer"
                                    onClick={() => {
                                      setUpdateId(subCategoryData.id);
                                      setIsEditData(true);
                                      setIsEditSubCategory(true);
                                      setEditSubCategoryModalOpen(true);
                                    }}
                                  >
                                    <Image
                                      className={
                                        proceduresStyle.subCategoryEditIcon
                                      }
                                      src={editIcon}
                                      width={16}
                                      height={16}
                                      alt="sub category edit icon"
                                    />
                                  </button>
                                </li>

                                {subCategoryData.procedures.length > 0 && (
                                  <div
                                    className={
                                      proceduresStyle.subCategoryAccordionContainer
                                    }
                                    style={{
                                      marginLeft: '1.5rem',
                                    }}
                                  >
                                    {subCategoryData.procedures.map(
                                      (procedure) => {
                                        return (
                                          <Accordion
                                            key={procedure.id}
                                            title={procedure.name.en}
                                            editClickHandler={() => {
                                              setUpdateId(procedure.id);
                                              setIsEditData(true);
                                              setEditProcedureModalOpen(true);
                                            }}
                                          >
                                            <div className="flex flex-wrap items-center">
                                              {Object.keys(
                                                procedure.reimbursement,
                                              ).map((key) => {
                                                const reimbursementKey =
                                                  key as LangType;
                                                return (
                                                  <ReimbursementWrapper
                                                    key={reimbursementKey}
                                                    name={reimbursementKey}
                                                    value={
                                                      procedure.reimbursement[
                                                        reimbursementKey
                                                      ]
                                                    }
                                                  />
                                                );
                                              })}
                                            </div>
                                          </Accordion>
                                        );
                                      },
                                    )}
                                  </div>
                                )}
                              </ol>
                            );
                          },
                        )}
                      {procedureData.procedures.length > 0 && (
                        <div
                          className={
                            proceduresStyle.proceduresAccordionContainer
                          }
                        >
                          {procedureData.procedures.map((procedure) => {
                            return (
                              <Accordion
                                editClickHandler={() => {
                                  setUpdateId(procedure.id);
                                  setIsEditData(true);
                                  setEditProcedureModalOpen(true);
                                }}
                                key={procedure.id}
                                title={procedure.name.en}
                              >
                                <div className="flex flex-wrap items-center">
                                  {Object.keys(procedure.reimbursement).map(
                                    (key) => {
                                      const reimbursementKey = key as LangType;
                                      return (
                                        <ReimbursementWrapper
                                          key={reimbursementKey}
                                          name={reimbursementKey}
                                          value={
                                            procedure.reimbursement[
                                              reimbursementKey
                                            ]
                                          }
                                        />
                                      );
                                    },
                                  )}
                                </div>
                              </Accordion>
                            );
                          })}
                        </div>
                      )}
                    </Accordion>
                  </div>
                );
              },
            )
          ) : (
            <div
              style={{ boxShadow: '2px 2px 4px 1px rgba(9, 111, 144, 0.1)' }}
              className="box-border flex w-full flex-col items-center gap-12 rounded-xl border border-lightskyblue bg-neutral-7 px-[178px] py-12"
            >
              <h2 className="text-center font-poppins text-4xl font-medium text-neutral-1">
                No departments have been added yet!
              </h2>
              <button
                type="button"
                className="flex h-16 cursor-pointer items-center gap-3 rounded-lg bg-darkteal px-6 py-[14px]"
                onClick={() => router.push('/procedures/add')}
              >
                <Image
                  src={plusIcon}
                  alt="cta btn text"
                  width={25}
                  height={25}
                />
                <p className="font-poppins text-2xl font-normal text-primary-6">
                  Add a department
                </p>
              </button>
            </div>
          )
        ) : (
          <div>
            {departmentProcedureList.isLoading ? (
              <TaskList />
            ) : (
              <div
                style={{ boxShadow: '2px 2px 4px 1px rgba(9, 111, 144, 0.1)' }}
                className="box-border flex w-full flex-col items-center gap-12 rounded-xl border border-lightskyblue bg-neutral-7 px-[178px] py-12"
              >
                <h2 className="text-center font-poppins text-4xl font-medium text-neutral-1">
                  No departments have been added yet!
                </h2>
                <button
                  type="button"
                  className="flex h-16 cursor-pointer items-center gap-3 rounded-lg bg-darkteal px-6 py-[14px]"
                  onClick={() => router.push('/procedures/add')}
                >
                  <Image
                    src={plusIcon}
                    alt="cta btn text"
                    width={25}
                    height={25}
                  />
                  <p className="font-poppins text-2xl font-normal text-primary-6">
                    Add a department
                  </p>
                </button>
              </div>
            )}
          </div>
        )}
      </CustomHomePage>
    </>
  );
}

export default WithAuth(ProceduresList);
