/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-nested-ternary */
/* eslint-disable unused-imports/no-unused-vars */
/* eslint-disable @typescript-eslint/naming-convention */

'use client';

import Image from 'next/image';
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
import emptyState from '@/public/assets/images/emptyState.svg';
import type { LangType } from '@/types/global';
import {
  availableCountriesByCountryCode,
  convertToValidCurrency,
  countryData,
} from '@/utils/global';

import proceduresStyle from './procedures.module.scss';

function ReimbursementWrapper({
  name,
  value,
}: {
  name?: string;
  value: number;
}) {
  const countryName = countryData.find((c) => c.countryCode === name)?.name;
  return (
    <div key={name} className="w-1/2 p-3">
      <p className="font-lexend text-xl font-normal text-neutral-2">
        Reimbursement for {countryName}
      </p>
      {value && name && (
        <p className="font-lexend text-base font-light">
          {convertToValidCurrency({
            price: value,
            currency:
              availableCountriesByCountryCode[
                name as keyof typeof availableCountriesByCountryCode
              ].currency,
            locale: name,
          })}
        </p>
      )}
    </div>
  );
}

const EmptyDepartmentPage = ({
  setIsEditData,
  setEditDepartmentModalOpen,
}: {
  setIsEditData: React.Dispatch<React.SetStateAction<boolean>>;
  setEditDepartmentModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <div className="mt-[100px] flex w-screen flex-col items-center justify-center">
      <Image
        src={emptyState}
        alt="empty-procedure-list"
        width={160}
        height={160}
      />
      <p className="mb-7 mt-3 font-poppins text-base font-normal text-neutral-2">
        To add a procedure, first you need to create a department
      </p>
      <button
        type="button"
        className="flex cursor-pointer items-center gap-3 rounded-lg bg-darkteal px-6 py-[14px]"
        onClick={() => {
          setIsEditData(false);
          setEditDepartmentModalOpen(true);
        }}
      >
        <PlusIcon className="size-5" stroke="#fff" />
        <p className="font-poppins text-base font-semibold text-primary-6">
          Create department
        </p>
      </button>
    </div>
  );
};

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
  const [isOpen, setIsOpen] = React.useState<{
    id: string;
    isVisible: boolean;
  }>({
    id: '',
    isVisible: false,
  });
  return (
    <>
      {editDepartmentModalOpen && (
        <DepartmentModal
          isOpen={editDepartmentModalOpen}
          onClose={() => {
            setUpdateId('');
            setEditDepartmentModalOpen(false);
          }}
          isEdit={isEditData}
          updateId={updateId}
        />
      )}
      {isEditSubCategory && (
        <ProcedureModal
          isOpen={editSubCategoryModalOpen}
          onClose={() => {
            setUpdateId('');
            setEditSubCategoryModalOpen(false);
          }}
          isEdit={isEditData}
          editSubCategory={isEditSubCategory}
          updateId={updateId}
        />
      )}
      {editProcedureModalOpen && (
        <ProcedureModal
          isOpen={editProcedureModalOpen}
          onClose={() => {
            setUpdateId('');
            setEditProcedureModalOpen(false);
          }}
          isEdit={isEditData}
          editSubCategory={isEditSubCategory}
          updateId={updateId}
        />
      )}
      <CustomHomePage
        heading="Procedure List"
        subHeading="List of all Procedures listed on the platform"
      >
        {departmentProcedureList.isSuccess ? (
          Array.isArray(
            departmentProcedureList.data.data.allCategoryWithProcedure,
          ) &&
          departmentProcedureList.data.data.allCategoryWithProcedure.length >
            0 ? (
            <>
              <div className="mb-11 flex w-[480px] items-center justify-between">
                <button
                  className="flex items-center rounded-[6.4px] border border-darkteal bg-darkteal px-4 py-3 text-white hover:bg-darkteal/90 active:bg-darkteal/90"
                  type="button"
                  onClick={() => {
                    setIsEditData(false);
                    setEditDepartmentModalOpen(true);
                  }}
                >
                  <PlusIcon className="size-5" stroke="#fff" />
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
                  <PlusIcon className="size-5" stroke="#fff" />
                  <p className="ml-2 font-poppins text-base font-medium">
                    Create a procedure
                  </p>
                </button>
              </div>
              {departmentProcedureList.data.data.allCategoryWithProcedure.map(
                (procedureData) => {
                  return (
                    <div key={procedureData.id} className="mb-3">
                      <Accordion
                        editClickHandler={() => {
                          setUpdateId(procedureData.id);
                          setIsEditData(true);
                          setEditDepartmentModalOpen(true);
                          setIsEditData(true);
                          setEditProcedureModalOpen(false);
                          setIsEditSubCategory(false);
                          setEditSubCategoryModalOpen(false);
                        }}
                        title={procedureData.name.en}
                        type="SUB-CATEGORY"
                      >
                        {procedureData.subCategoryWithProcedures.length > 0 &&
                          procedureData.subCategoryWithProcedures.map(
                            (subCategoryData) => {
                              return (
                                <ul key={subCategoryData.id}>
                                  <div
                                    className="my-2 flex cursor-pointer items-center justify-between rounded-lg bg-neutral-6 px-4 py-[14px]"
                                    onClick={() =>
                                      setIsOpen((prevState) => ({
                                        id: subCategoryData.id,
                                        isVisible: !prevState.isVisible,
                                      }))
                                    }
                                  >
                                    <p className="font-poppins text-base font-normal text-neutral-1">
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
                                  </div>

                                  {isOpen.id === subCategoryData.id &&
                                    isOpen.isVisible && (
                                      <div>
                                        {subCategoryData.procedures.length >
                                          0 && (
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
                                                      setEditProcedureModalOpen(
                                                        true,
                                                      );
                                                      setIsEditSubCategory(
                                                        false,
                                                      );
                                                      setEditSubCategoryModalOpen(
                                                        false,
                                                      );
                                                      setEditDepartmentModalOpen(
                                                        false,
                                                      );
                                                    }}
                                                    type="PROCEDURE"
                                                  >
                                                    <div className="flex flex-wrap items-center">
                                                      {Object.keys(
                                                        procedure.reimbursement,
                                                      ).map((key) => {
                                                        const reimbursementKey =
                                                          key as LangType;
                                                        return (
                                                          <ReimbursementWrapper
                                                            key={
                                                              reimbursementKey
                                                            }
                                                            name={key}
                                                            value={
                                                              procedure
                                                                .reimbursement[
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
                                      </div>
                                    )}
                                </ul>
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
                                    setIsEditSubCategory(false);
                                    setEditSubCategoryModalOpen(false);
                                  }}
                                  key={procedure.id}
                                  title={procedure.name.en}
                                  type="PROCEDURE"
                                >
                                  <div className="flex flex-wrap items-center">
                                    {Object.keys(procedure.reimbursement).map(
                                      (key) => {
                                        const reimbursementKey =
                                          key as LangType;
                                        return (
                                          <ReimbursementWrapper
                                            key={reimbursementKey}
                                            name={key}
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
              )}
            </>
          ) : (
            <EmptyDepartmentPage
              setIsEditData={setIsEditData}
              setEditDepartmentModalOpen={setEditDepartmentModalOpen}
            />
          )
        ) : (
          <div>
            {departmentProcedureList.isLoading ? (
              <TaskList />
            ) : (
              <EmptyDepartmentPage
                setIsEditData={setIsEditData}
                setEditDepartmentModalOpen={setEditDepartmentModalOpen}
              />
            )}
          </div>
        )}
      </CustomHomePage>
    </>
  );
}

export default WithAuth(ProceduresList);
