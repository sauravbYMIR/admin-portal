import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { axiosInstance } from '@/utils/axiosInstance';

export type NameJSONType = {
  en: string;
  nb: string;
  da: string;
  sv: string;
};
export type ReimbursementJSONType = {
  ie: number;
  no: number;
  dk: number;
  se: number;
};
export type CostJSONType = {
  price: number;
  currency: string;
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
export type GetDepartmentByIdResponse = {
  success: boolean;
  status: number;
  data: {
    id: string;
    name: NameJSONType;
    parentCategory: {
      id: string;
      name: NameJSONType;
      parentCategoryId: null;
    };
  };
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

export const useCreateDepartment = ({
  isCreateSubCategory,
  closeModal,
}: {
  isCreateSubCategory: boolean;
  closeModal: (() => void) | null;
}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createDepartment,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`department-with-procedure`],
      });
      if (isCreateSubCategory) {
        toast.success('Sub-category created successfully!');
      } else {
        toast.success('Department created successfully!');
      }
      if (closeModal) {
        closeModal();
      }
    },
    onError: (error) => {
      toast(`Something went wrong: ${error.message}`);
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

export const useEditDepartment = ({
  isSubCat,
  onClose,
}: {
  isSubCat: boolean;
  onClose: () => void;
}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: editDepartment,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`department-with-procedure`],
      });
      if (isSubCat) {
        toast.success('Sub category edited successfully');
      } else {
        toast.success('Department edited successfully');
      }
      onClose();
    },
    onError: (error) => {
      toast(`Something went wrong: ${error.message}`);
    },
  });
};

export const getDepartmentById = async (
  id: string,
): Promise<GetDepartmentByIdResponse> => {
  const response = await axiosInstance.get<GetDepartmentByIdResponse>(
    `${process.env.BASE_URL}/category/${id}`,
  );
  return {
    success: response.data.success,
    status: response.data.status,
    data: response.data.data,
  };
};

export const useGetDepartmentById = ({ id }: { id: string }) => {
  return useQuery({
    queryKey: [`department`, id],
    queryFn: () => getDepartmentById(id),
    refetchOnWindowFocus: false,
    enabled: !!id,
  });
};
