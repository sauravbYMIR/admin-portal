import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { axiosInstance } from '@/utils/axiosInstance';
import { SERVER_ERROR_MESSAGE } from '@/utils/global';

import type { NameJSONType, ReimbursementJSONType } from './useDepartment';

export type HospitalMemberType = {
  id: string;
  position: NameJSONType;
  name: string;
  qualification: string;
  hospitalId: string;
  createdAt: string | null;
  updatedAt: string | null;
  deletedAt: string | null;
};

export type GetAllHospitalMemberResponse = {
  success: boolean;
  status: number;
  data: Array<HospitalMemberType>;
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

export type EditHospitalMemberAxios = {
  success: boolean;
  status: number;
  data: string;
};
export type EditHospitalMemberResponse = {
  success: boolean;
  status: number;
  data: string;
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

export const getAllHospitalMember =
  async (): Promise<GetAllHospitalMemberResponse> => {
    const response = await axiosInstance.get<GetAllHospitalMemberResponse>(
      `${process.env.BASE_URL}/hospital-member`,
    );
    return {
      success: response.data.success,
      status: response.data.status,
      data: response.data.data,
    };
  };

export const useGetAllHospitalMember = () => {
  return useQuery({
    queryKey: [`hospital-member`],
    queryFn: () => getAllHospitalMember(),
    refetchOnWindowFocus: false,
  });
};
export const createHospitalMember = async ({
  name,
  position,
  qualification,
  hospitalId,
}: {
  name: string;
  position: NameJSONType;
  qualification: string;
  hospitalId: string;
}): Promise<{ success: boolean; status: number; data: { id: string } }> => {
  const response = await axiosInstance.post<{
    success: boolean;
    status: number;
    data: string;
  }>(`${process.env.BASE_URL}/hospital-member`, {
    name,
    qualification,
    position,
    hospitalId,
  });
  return {
    success: response.data.success,
    status: response.data.status,
    data: { id: response.data.data },
  };
};

export const useCreateHospitalMember = ({
  closeModal,
}: {
  closeModal: (() => void) | null;
}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createHospitalMember,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`hospital`],
      });
      toast.success('Team member created successfully');
      if (closeModal) {
        closeModal();
      }
    },
    onError: (error) => {
      toast(`Something went wrong: ${error.message}`);
    },
  });
};

export const editHospitalMember = async ({
  name,
  position,
  qualification,
  hospitalMemberId,
}: {
  name: string;
  position: NameJSONType;
  qualification: string;
  hospitalMemberId: string;
}): Promise<EditHospitalMemberResponse> => {
  const response = await axiosInstance.patch<EditHospitalMemberAxios>(
    `${process.env.BASE_URL}/hospital-member/${hospitalMemberId}`,
    {
      name,
      position,
      qualification,
    },
  );
  return {
    success: response.data.success,
    status: response.data.status,
    data: response.data.data,
  };
};

export const useEditHospitalMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: editHospitalMember,
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

export const updateHospitalProfile = async ({
  formData,
  memberId,
}: {
  formData: FormData;
  memberId: string;
}): Promise<{
  success: boolean;
}> => {
  await axiosInstance.post<{
    success: boolean;
  }>(
    `${process.env.BASE_URL}/hospital-member/upload-profile/${memberId}`,
    formData,
  );
  return {
    success: true,
  };
};

export const useUpdateHospitalProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateHospitalProfile,
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: ['hospital'] });
    },
  });
};
export const deleteTeamMember = async ({
  memberId,
}: {
  memberId: string;
}): Promise<{
  success: boolean;
  status: number;
}> => {
  const response = await axiosInstance.delete<{
    success: boolean;
    status: number;
  }>(`${process.env.BASE_URL}/hospital-member/${memberId}`);
  return {
    success: true,
    status: response.data.status,
  };
};

export const useDeleteTeamMember = ({ hospitalId }: { hospitalId: string }) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTeamMember,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`hospital`, hospitalId],
      });
      toast.success('Team member removed successfully');
    },
    onError: (error) => {
      const err = error as unknown as {
        response: { data: { error: { message: string } } };
      };
      toast.error(
        `${SERVER_ERROR_MESSAGE[err.response.data.error.message as keyof typeof SERVER_ERROR_MESSAGE] ?? 'Server error'}`,
      );
    },
  });
};
export const getHospitalTeamMemberById = async (
  id: string,
): Promise<{
  status: number;
  success: boolean;
  data: {
    createdAt: string | null;
    deletedAt: string | null;
    hospitalId: string;
    id: string;
    name: string;
    position: NameJSONType;
    profile: string | boolean;
    qualification: string;
    updatedAt: string | null;
  };
}> => {
  const response = await axiosInstance.get<{
    status: number;
    success: boolean;
    data: {
      createdAt: string | null;
      deletedAt: string | null;
      hospitalId: string;
      id: string;
      name: string;
      position: NameJSONType;
      profile: string | boolean;
      qualification: string;
      updatedAt: string | null;
    };
  }>(`${process.env.BASE_URL}/hospital-member/${id}`);
  return {
    success: response.data.success,
    status: response.data.status,
    data: response.data.data,
  };
};

export const useGetHospitalTeamMemberById = ({ id }: { id: string }) => {
  return useQuery({
    queryKey: [`hospital-member`, id],
    queryFn: () => getHospitalTeamMemberById(id),
    refetchOnWindowFocus: false,
    enabled: !!id,
  });
};
// export const getProcedureByHospitalId = async (
//   id: string,
// ): Promise<GetProcedureByHospitalId> => {
//   const response = await axiosInstance.get<GetProcedureByHospitalId>(
//     `${process.env.BASE_URL}/hospital/procedure/${id}`,
//   );
//   return {
//     success: response.data.success,
//     status: response.data.status,
//     data: response.data.data,
//   };
// };

// export const useGetProcedureByHospitalId = ({ id }: { id: string }) => {
//   return useQuery({
//     queryKey: [`hospital-procedure`, id],
//     queryFn: () => getProcedureByHospitalId(id),
//     refetchOnWindowFocus: false,
//     enabled: !!id,
//   });
// };
