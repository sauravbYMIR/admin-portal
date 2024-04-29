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
export type CreateHospitalProcedureType = {
  success: boolean;
  status: number;
  data: {
    id: string;
    hospitalMembers: Array<any>;
    procedureMembers: Array<any>;
    procedureId: string;
    hospitalId: string;
    description: NameJSONType;
    cost: ReimbursementJSONType;
    waitingTime: string;
    stayInHospital: string;
    stayInCity: string;
  };
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
export const createHospitalProcedure = async ({
  procedureId,
  hospitalId,
  description,
  cost,
  waitingTime,
  stayInHospital,
  stayInCity,
  procedureMembers,
}: {
  procedureId: string;
  hospitalId: string;
  description: NameJSONType;
  cost: ReimbursementJSONType;
  waitingTime: string;
  stayInHospital: string;
  stayInCity: string;
  procedureMembers: Array<any>;
}): Promise<{
  success: boolean;
  status: number;
  data: string;
}> => {
  const response = await axiosInstance.post<CreateHospitalProcedureType>(
    `${process.env.BASE_URL}/hospital-procedure`,
    {
      procedureId,
      hospitalId,
      description,
      cost,
      waitingTime,
      stayInHospital,
      stayInCity,
      procedureMembers,
    },
  );
  return {
    success: response.data.success,
    status: response.data.status,
    data: response.data.data.id,
  };
};

export const useCreateHospitalProcedure = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createHospitalProcedure,
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
