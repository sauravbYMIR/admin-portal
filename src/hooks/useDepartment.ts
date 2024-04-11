import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { axiosInstance } from '@/utils/axiosInstance';

export type NameJSONType = {
  en: string;
  nb: string;
  da: string;
  sv: string;
};
export type ReimbursementJSONType = {
  en: number;
  nb: number;
  da: number;
  sv: number;
};

export type ProcedureType = {
  id: string;
  name: NameJSONType;
  reimbursement: ReimbursementJSONType;
  categoryId: string;
};

export type GetAllDepartmentWithProcedureType = {
  id: string;
  name: NameJSONType;
  subCategoryWithProcedures: Array<{
    id: string;
    name: NameJSONType;
    procedures: Array<ProcedureType>;
  }>;
  procedures: Array<ProcedureType>;
};

export type GetAllDepartmentWithProcedureResponseType = {
  success: boolean;
  status: number;
  data: { allCategoryWithProcedure: Array<GetAllDepartmentWithProcedureType> };
};

export type DepartmentType = {
  id: string;
  name: NameJSONType;
  parentCategoryId: string;
};

export type CreateDepartmentResponse = {
  status: number;
  success: boolean;
  data: {
    name: NameJSONType;
    parentCategoryId: string;
    procedures: Array<ProcedureType>;
  };
};

export type GetAllDepartmentResponse = {
  success: boolean;
  status: number;
  data: Array<DepartmentType>;
};

export type EditDepartmentResponse = {
  success: true;
};

export const getAllDepartmentWithProcedure =
  async (): Promise<GetAllDepartmentWithProcedureResponseType> => {
    const response =
      await axiosInstance.get<GetAllDepartmentWithProcedureResponseType>(
        `${process.env.BASE_URL}/category/with-procedure`,
      );
    return {
      success: response.data.success,
      status: response.data.status,
      data: response.data.data,
    };
  };

export const useGetAllDepartmentWithProcedure = () => {
  return useQuery({
    queryKey: [`department-with-procedure`],
    queryFn: () => getAllDepartmentWithProcedure(),
    refetchOnWindowFocus: false,
  });
};

export const createDepartment = async ({
  name,
  parentCategoryId,
}: {
  name: NameJSONType;
  parentCategoryId: string;
}): Promise<CreateDepartmentResponse> => {
  const response = await axiosInstance.post<CreateDepartmentResponse>(
    `${process.env.BASE_URL}/category`,
    {
      name,
      parentCategoryId,
    },
  );
  return {
    success: response.data.success,
    status: response.data.status,
    data: response.data.data,
  };
};

export const useCreateDepartment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createDepartment,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`department-with-procedure`],
      });
    },
  });
};

export const getAllDepartment = async (): Promise<GetAllDepartmentResponse> => {
  const response = await axiosInstance.get<GetAllDepartmentResponse>(
    `${process.env.BASE_URL}/category`,
  );
  return {
    success: response.data.success,
    status: response.data.status,
    data: response.data.data,
  };
};

export const useGetAllDepartment = () => {
  return useQuery({
    queryKey: [`department`],
    queryFn: () => getAllDepartment(),
    refetchOnWindowFocus: false,
  });
};

export const editDepartment = async ({
  departmentId,
  name,
}: {
  departmentId: string;
  name: NameJSONType;
}): Promise<EditDepartmentResponse> => {
  await axiosInstance.patch<EditDepartmentResponse>(
    `${process.env.BASE_URL}/category/update-category/${departmentId}`,
    {
      name,
    },
  );
  return {
    success: true,
  };
};

export const useEditDepartment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: editDepartment,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`department-with-procedure`, `department`],
      });
    },
  });
};
