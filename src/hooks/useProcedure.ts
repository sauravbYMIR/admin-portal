import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { axiosInstance } from '@/utils/axiosInstance';

import type {
  NameJSONType,
  ProcedureType,
  ReimbursementJSONType,
} from './useDepartment';

export type CreateProcedureResponse = {
  status: number;
  success: boolean;
  data: {
    name: NameJSONType;
    parentCategoryId: string;
    procedures: Array<ProcedureType>;
  };
};

export type GetAllProcudureResponse = {
  success: boolean;
  status: number;
  data: Array<ProcedureType>;
};

export type EditProcedureResponse = {
  success: boolean;
};

export const getAllProcedure = async (): Promise<GetAllProcudureResponse> => {
  const response = await axiosInstance.get<GetAllProcudureResponse>(
    `${process.env.BASE_URL}/procedure`,
  );
  return {
    success: response.data.success,
    status: response.data.status,
    data: response.data.data,
  };
};

export const useGetAllDepartmentWithProcedure = () => {
  return useQuery({
    queryKey: [`procedure`],
    queryFn: () => getAllProcedure(),
    refetchOnWindowFocus: false,
  });
};

export const createProcedure = async ({
  name,
  categoryId,
  reimbursement,
}: {
  name: NameJSONType;
  categoryId: string;
  reimbursement: ReimbursementJSONType;
}): Promise<CreateProcedureResponse> => {
  const response = await axiosInstance.post<CreateProcedureResponse>(
    `${process.env.BASE_URL}/procedure`,
    {
      name,
      categoryId,
      reimbursement,
    },
  );
  return {
    success: response.data.success,
    status: response.data.status,
    data: response.data.data,
  };
};

export const useCreateProcedure = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createProcedure,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`procedure`],
      });
    },
  });
};

export const editProcedure = async ({
  procedureId,
  name,
  reimbursement,
}: {
  procedureId: string;
  name: NameJSONType;
  reimbursement: ReimbursementJSONType;
}): Promise<EditProcedureResponse> => {
  await axiosInstance.patch<EditProcedureResponse>(
    `${process.env.BASE_URL}/procedure/update-procedure/${procedureId}`,
    {
      name,
      reimbursement,
    },
  );
  return {
    success: true,
  };
};

export const useEditProcedure = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: editProcedure,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`procedure`],
      });
    },
  });
};
