import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { axiosInstance } from '@/utils/axiosInstance';

import type {
  NameJSONType,
  ProcedureType,
  ReimbursementJSONType,
} from './useDepartment';
import type { HospitalMemberType } from './useMember';

export type GetAllHospitalResponse = {
  success: boolean;
  status: number;
  data: Array<HospitalType>;
};

export type HospitalType = {
  id: string;
  hospitalLogoUploaded: boolean;
  name: string;
  description: NameJSONType;
  streetName: string;
  streetNumber: string;
  city: string;
  country: string;
  zipcode: string;
  hospitalGalleryUploaded: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};
export type HospitalByIdType = {
  id: string;
  hospitalLogoUploaded: boolean;
  name: string;
  description: NameJSONType;
  streetName: string;
  streetNumber: string;
  city: string;
  country: string;
  zipcode: string;
  hospitalGalleryUploaded: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  members: Array<HospitalMember>;
  procedures: Array<HospitalProcedure>;
};

export type CreateHospitalResponse = {
  success: boolean;
  status: number;
  data: CreateHospital;
};

export type CreateHospital = {
  procedures: Array<ProcedureType>;
  members: Array<any>;
  name: string;
  description: NameJSONType;
  streetName: string;
  streetNumber: string;
  city: string;
  country: string;
  zipcode: string;
};

export type EditHospitalAxios = {
  success: boolean;
  status: number;
  data: { id: string };
};
export type EditHospitalResponse = {
  success: boolean;
  status: number;
  data: string;
};
export type GetHospitalById = {
  success: boolean;
  status: number;
  data: HospitalByIdType & {
    logo: boolean | string;
    hospitalImages: Array<{
      id: string;
      hospitalId: string;
      fileName: string;
      originalFileName: string;
      createdAt: string;
      updatedAt: string;
      deletedAt: null | string;
      imageUrl: string;
    }>;
  };
};
export type GetHospitalTeamMembersByHospitalId = {
  success: boolean;
  status: number;
  data: Array<HospitalMemberType>;
};
export type GetProcedureByHospitalId = {
  success: boolean;
  status: number;
  data: Array<{
    cost: ReimbursementJSONType;
    createdAt: string | null;
    deletedAt: string | null;
    description: NameJSONType;
    hospitalId: string;
    id: string;
    procedureId: string;
    procedureImageUpload: boolean;
    stayInCity: string;
    stayInHospital: string;
    updatedAt: string | null;
    waitingTime: string;
  }>;
};
export type HospitalProcedure = {
  id: string;
  procedureId: string;
  description: NameJSONType;
  cost: ReimbursementJSONType;
  waitingTime: string;
  stayInHospital: string;
  stayInCity: string;
  procedureImageUpload: boolean;
  hospitalId: string;
  createdAt: string | null;
  updatedAt: string | null;
  deletedAt: string | null;
};

export type HospitalMember = {
  id: string;
  position: NameJSONType;
  name: string;
  qualification: string;
  profilePictureUploaded: boolean;
  profile: string;
  hospitalId: string;
  createdAt: string | null;
  updatedAt: string | null;
  deletedAt: string | null;
};

export const getAllHospital = async (): Promise<GetAllHospitalResponse> => {
  const response = await axiosInstance.get<GetAllHospitalResponse>(
    `${process.env.BASE_URL}/hospital`,
  );
  return {
    success: response.data.success,
    status: response.data.status,
    data: response.data.data,
  };
};

export const useGetAllHospital = () => {
  return useQuery({
    queryKey: [`hospital`],
    queryFn: () => getAllHospital(),
    refetchOnWindowFocus: false,
  });
};

export const createHospital = async ({
  name,
  description,
  streetName,
  streetNumber,
  city,
  country,
  zipcode,
}: {
  name: string;
  description: NameJSONType;
  streetName: string;
  streetNumber: string;
  city: string;
  country: string;
  zipcode: string;
}): Promise<{ success: boolean; status: number; data: { id: string } }> => {
  const response = await axiosInstance.post<{
    success: boolean;
    status: number;
    data: string;
  }>(`${process.env.BASE_URL}/hospital`, {
    name,
    description,
    streetName,
    streetNumber,
    city,
    country,
    zipcode,
  });
  return {
    success: response.data.success,
    status: response.data.status,
    data: { id: response.data.data },
  };
};

export const useCreateHospital = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createHospital,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`hospital`],
      });
      toast.success('Hospital added  successfully');
    },
    onError: (error) => {
      toast(`Something went wrong: ${error.message}`);
    },
  });
};

export const editHospital = async ({
  name,
  description,
  streetName,
  streetNumber,
  city,
  country,
  zipcode,
  hospitalId,
}: {
  name: string;
  description: NameJSONType;
  streetName: string;
  streetNumber: string;
  city: string;
  country: string;
  zipcode: string;
  hospitalId: string;
}): Promise<EditHospitalResponse> => {
  const response = await axiosInstance.patch<EditHospitalAxios>(
    `${process.env.BASE_URL}/hospital/${hospitalId}`,
    {
      name,
      description,
      streetName,
      streetNumber,
      city,
      country,
      zipcode,
    },
  );
  return {
    success: response.data.success,
    status: response.data.status,
    data: response.data.data.id,
  };
};

export const useEditHospital = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: editHospital,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`hospital`],
      });
    },
    onError: (error) => {
      toast(`Something went wrong: ${error.message}`);
    },
  });
};

export const updateHospitalLogo = async ({
  formData,
  hospitalId,
}: {
  formData: FormData;
  hospitalId: string;
}): Promise<{
  success: boolean;
}> => {
  await axiosInstance.post<{
    success: boolean;
  }>(`${process.env.BASE_URL}/hospital/upload-logo/${hospitalId}`, formData);
  return {
    success: true,
  };
};

export const useUpdateHospitalLogo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateHospitalLogo,
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: ['hospital'] });
    },
  });
};
export const updateHospitalGallery = async ({
  formData,
  hospitalId,
}: {
  formData: FormData;
  hospitalId: string;
}): Promise<{
  success: boolean;
}> => {
  await axiosInstance.post<{
    success: boolean;
  }>(`${process.env.BASE_URL}/hospital/upload-gallery/${hospitalId}`, formData);
  return {
    success: true,
  };
};

export const useUpdateHospitalGallery = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateHospitalGallery,
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: ['hospital'] });
    },
  });
};
export const getHospitalById = async (id: string): Promise<GetHospitalById> => {
  const response = await axiosInstance.get<GetHospitalById>(
    `${process.env.BASE_URL}/hospital/${id}`,
  );
  return {
    success: response.data.success,
    status: response.data.status,
    data: response.data.data,
  };
};

export const useGetHospitalById = ({ id }: { id: string }) => {
  return useQuery({
    queryKey: [`hospital`, id],
    queryFn: () => getHospitalById(id),
    refetchOnWindowFocus: false,
    enabled: !!id,
  });
};
export const getProcedureByHospitalId = async (
  id: string,
): Promise<GetProcedureByHospitalId> => {
  const response = await axiosInstance.get<GetProcedureByHospitalId>(
    `${process.env.BASE_URL}/hospital/procedure/${id}`,
  );
  return {
    success: response.data.success,
    status: response.data.status,
    data: response.data.data,
  };
};

export const useGetProcedureByHospitalId = ({ id }: { id: string }) => {
  return useQuery({
    queryKey: [`hospital-procedure`, id],
    queryFn: () => getProcedureByHospitalId(id),
    refetchOnWindowFocus: false,
    enabled: !!id,
  });
};
export const getHospitalTeamMembersByHospitalId = async (
  id: string,
): Promise<GetHospitalTeamMembersByHospitalId> => {
  const response = await axiosInstance.get<GetHospitalTeamMembersByHospitalId>(
    `${process.env.BASE_URL}/hospital/team-members/${id}`,
  );
  return {
    success: response.data.success,
    status: 200,
    data: response.data.data,
  };
};

export const useGetHospitalTeamMembersByHospitalId = ({
  id,
}: {
  id: string;
}) => {
  return useQuery({
    queryKey: [`hospital`, `team-members`, id],
    queryFn: () => getHospitalTeamMembersByHospitalId(id),
    refetchOnWindowFocus: false,
    enabled: !!id,
  });
};

export const removeGallery = async ({
  id,
}: {
  id: string;
}): Promise<{
  success: boolean;
  status: number;
}> => {
  const response = await axiosInstance.delete<{
    success: boolean;
    status: number;
  }>(`${process.env.BASE_URL}/hospital/remove-gallery/${id}`);
  return {
    success: true,
    status: response.data.status,
  };
};

export const useRemoveGallery = ({ id }: { id: string }) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: removeGallery,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`hospital`, id],
      });
    },
    onError: (error) => {
      toast(`Something went wrong: ${error.message}`);
    },
  });
};
