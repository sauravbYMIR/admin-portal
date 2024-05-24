import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

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
export type GetProcedureByIdResponse = {
  success: boolean;
  status: number;
  data: {
    id: string;
    name: NameJSONType;
    reimbursement: ReimbursementJSONType;
    category: {
      name: NameJSONType;
      id: string;
    };
  };
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
export const getAllProcedureByDeptId = async (
  id: string,
): Promise<{
  data: Array<{
    categoryId: string;
    id: string;
    name: NameJSONType;
    reimbursement: ReimbursementJSONType;
  }>;
}> => {
  const response = await axiosInstance.get<{
    data: Array<{
      categoryId: string;
      id: string;
      name: NameJSONType;
      reimbursement: ReimbursementJSONType;
    }>;
  }>(`${process.env.BASE_URL}/procedure/department/${id}`);
  return { data: response.data.data };
};

export const useGetAllProcedureByDeptId = ({ id }: { id: string }) => {
  return useQuery({
    queryKey: [`procedure`, id],
    queryFn: () => getAllProcedureByDeptId(id),
    refetchOnWindowFocus: false,
    enabled: !!id,
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
        queryKey: [`department-with-procedure`],
      });
      toast.success('Procedure created successfully');
    },
    onError: (error) => {
      toast(`Something went wrong: ${error.message}`);
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
      toast.success('Procedure edited successfully');
    },
    onError: (error) => {
      toast(`Something went wrong: ${error.message}`);
    },
  });
};

export const getProcedureById = async (
  id: string,
): Promise<GetProcedureByIdResponse> => {
  const response = await axiosInstance.get<GetProcedureByIdResponse>(
    `${process.env.BASE_URL}/procedure/${id}`,
  );
  return {
    success: response.data.success,
    status: response.data.status,
    data: response.data.data,
  };
};

export const useGetProcedureById = ({ id }: { id: string }) => {
  return useQuery({
    queryKey: [`procedure`, id],
    queryFn: () => getProcedureById(id),
    refetchOnWindowFocus: false,
    enabled: !!id,
  });
};
