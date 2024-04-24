import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { axiosInstance } from '@/utils/axiosInstance';

import type { EditHospitalAxios, EditHospitalResponse } from '.';
import type { NameJSONType, ReimbursementJSONType } from './useDepartment';
import type { HospitalMember } from './useMember';

export type HospitalProcedureType = {
  createdAt: string | null;
  deletedAt: string | null;
  description: NameJSONType;
  cost: ReimbursementJSONType;
  hospitalId: string;
  id: string;
  procedure: {
    category: {
      id: string;
      name: NameJSONType;
    };
    id: string;
    name: NameJSONType;
  };
  procedureId: string;
  stayInCity: string;
  stayInHospital: string;
  updatedAt: string | null;
  waitingTime: string;
};
export type HospitalProcedureByIdType = {
  createdAt: string | null;
  deletedAt: string | null;
  description: NameJSONType;
  cost: ReimbursementJSONType;
  hospitalId: string;
  id: string;
  hospitalMembers: Array<HospitalMember>;
  procedure: {
    category: {
      id: string;
      name: NameJSONType;
    };
    id: string;
    name: NameJSONType;
  };
  procedureId: string;
  stayInCity: string;
  stayInHospital: string;
  updatedAt: string | null;
  waitingTime: string;
};

export const getAllHospitalProcedure = async (
  id: string,
): Promise<{
  status: number;
  success: boolean;
  data: Array<HospitalProcedureType>;
}> => {
  const response = await axiosInstance.get<{
    status: number;
    success: boolean;
    data: Array<HospitalProcedureType>;
  }>(`${process.env.BASE_URL}/hospital-procedure/${id}`);
  return {
    success: response.data.success,
    status: response.data.status,
    data: response.data.data,
  };
};

export const useGetAllHospitalProcedure = ({ id }: { id: string }) => {
  return useQuery({
    queryKey: [`hospital-procedure`],
    queryFn: () => getAllHospitalProcedure(id),
    refetchOnWindowFocus: false,
  });
};
export const editHospitalProcedure = async ({
  waitingTime,
  stayInHospital,
  stayInCity,
  description,
  cost,
  hospitalProcedureId,
}: {
  waitingTime: string;
  stayInHospital: string;
  stayInCity: string;
  description: NameJSONType;
  cost: ReimbursementJSONType;
  hospitalProcedureId: string;
}): Promise<EditHospitalResponse> => {
  const response = await axiosInstance.patch<EditHospitalAxios>(
    `${process.env.BASE_URL}/hospital-procedure/update/${hospitalProcedureId}`,
    {
      waitingTime,
      stayInHospital,
      stayInCity,
      description,
      cost,
    },
  );
  return {
    success: response.data.success,
    status: response.data.status,
    data: response.data.data.id,
  };
};
export const useEditHospitalProcedure = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: editHospitalProcedure,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`hospital-procedure`],
      });
    },
    onError: (error) => {
      toast(`Something went wrong: ${error.message}`);
    },
  });
};
export const getHospitalProcedureById = async (
  id: string,
): Promise<{
  status: number;
  success: boolean;
  data: HospitalProcedureByIdType;
}> => {
  const response = await axiosInstance.get<{
    status: number;
    success: boolean;
    data: HospitalProcedureByIdType;
  }>(`${process.env.BASE_URL}/hospital-procedure/procedure-details/${id}`);
  return {
    success: response.data.success,
    status: response.data.status,
    data: response.data.data,
  };
};

export const useGetHospitalProcedureById = ({ id }: { id: string }) => {
  return useQuery({
    queryKey: [`hospital-procedure`, id],
    queryFn: () => getHospitalProcedureById(id),
    refetchOnWindowFocus: false,
    enabled: !!id,
  });
};

// cost
// :
// {en: 12998, da: 12999, sv: 12999, nb: 12999}
// createdAt
// :
// "2024-03-26T01:03:01.323Z"
// deletedAt
// :
// null
// description
// :
// {en: 'Hospital procedures include registration, triage, …ingly, with emphasis on safety and communication.', da: 'Hospital procedures include registration, triage, …ingly, with emphasis on safety and communication.', sv: 'Hospital procedures include registration, triage, …ingly, with emphasis on safety and communication.', nb: 'Hospital procedures include registration, triage, …ingly, with emphasis on safety and communication.'}
// hospitalId
// :
// "fe189a59-d6d3-4350-94ce-cb087e511c5f"
// id
// :
// "58d2deca-3aec-4692-ac0d-a5943041a390"
// procedure
// :
// category
// :
// id
// :
// "ac38cdf1-6ceb-4c21-9047-9c1ccec3b352"
// name
// :
// {en: 'Orthopeadic', nb: 'Orthopeadic', sv: 'Orthopeadi ', da: 'Orthopeadic'}
// parentCategoryId
// :
// null
// [[Prototype]]
// :
// Object
// categoryId
// :
// "ac38cdf1-6ceb-4c21-9047-9c1ccec3b352"
// id
// :
// "46a192b7-2a19-4bcd-87af-6bee560a5d05"
// name
// :
// {en: 'Nerve compression', nb: 'Nerve compression', da: 'Nerve compression', sv: 'Nerve compression'}
// reimbursement
// :
// {en: 12999, nb: 12999, da: 12999, sv: 12999}
// [[Prototype]]
// :
// Object
// procedureId
// :
// "46a192b7-2a19-4bcd-87af-6bee560a5d05"
// procedureImageUpload
// :
// false
// stayInCity
// :
// "6"
// stayInHospital
// :
// "2"
// updatedAt
// :
// "2024-04-23T22:13:44.647Z"
// waitingTime
// :
// "12"
