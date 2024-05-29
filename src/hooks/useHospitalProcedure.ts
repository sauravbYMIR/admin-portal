import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { axiosInstance } from '@/utils/axiosInstance';

import type {
  CostJSONType,
  NameJSONType,
  ReimbursementJSONType,
} from './useDepartment';
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
  cost: CostJSONType;
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
  hospitalProcedureImages: Array<{
    id: string;
    hospitalProcedureId: string;
    fileName: string;
    originalFileName: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: null | string;
    imageUrl: string;
  }>;
  procedureMembers: Array<{
    hospitalId: string;
    id: string;
    name: string;
    position: NameJSONType;
    profile: string;
    profilePictureUploaded: boolean;
    qualification: string;
    role: null | NameJSONType;
    updatedAt: string;
  }>;
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
  cost: CostJSONType;
  hospitalProcedureId: string;
}): Promise<{
  success: boolean;
  status: number;
  data: string;
}> => {
  const response = await axiosInstance.patch<{
    success: boolean;
    status: number;
    data: string;
  }>(
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
    data: response.data.data,
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
  cost: CostJSONType;
  waitingTime: string;
  stayInHospital: string;
  stayInCity: string;
  procedureMembers: Array<{
    id: string;
    role: NameJSONType;
  }>;
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

export const updateHospitalProcedureGallery = async ({
  formData,
  hospitalProcedureId,
}: {
  formData: FormData;
  hospitalProcedureId: string;
}): Promise<{
  success: boolean;
}> => {
  await axiosInstance.post<{
    success: boolean;
  }>(
    `${process.env.BASE_URL}/hospital-procedure/upload-image/${hospitalProcedureId}`,
    formData,
  );
  return {
    success: true,
  };
};

export const useUpdateHospitalProcedureGallery = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateHospitalProcedureGallery,
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: ['hospital-procedure'],
      });
    },
  });
};

export const removeHospitalProcedureGallery = async ({
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
  }>(
    `${process.env.BASE_URL}/hospital-procedure/remove-procedure-picture/${id}`,
  );
  return {
    success: true,
    status: response.data.status,
  };
};

export const useRemoveHospitalProcedureGallery = ({ id }: { id: string }) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: removeHospitalProcedureGallery,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`hospital-procedure`, id],
      });
    },
    onError: (error) => {
      toast(`Something went wrong: ${error.message}`);
    },
  });
};

export const editHospitalMemberProcedure = async ({
  role,
  memberId,
  hospitalProcedure,
}: {
  role: NameJSONType;
  memberId: string;
  hospitalProcedure: string;
}): Promise<{
  success: boolean;
  status: number;
  data: {
    role: NameJSONType;
    memberId: string;
  };
}> => {
  const response = await axiosInstance.patch<{
    success: boolean;
    status: number;
    data: {
      role: NameJSONType;
      memberId: string;
    };
  }>(
    `${process.env.BASE_URL}/hospital-procedure/update-member/${hospitalProcedure}`,
    {
      role,
      memberId,
    },
  );
  return {
    success: response.data.success,
    status: response.data.status,
    data: response.data.data,
  };
};

export const useEditHospitalProcedureMember = ({
  hospitalProcedureId,
  onClose,
}: {
  hospitalProcedureId: string;
  onClose: () => void;
}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: editHospitalMemberProcedure,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`hospital-procedure`, hospitalProcedureId],
      });
      toast.success('Team member updated successfully');
      onClose();
    },
    onError: (error) => {
      toast.error(`Something went wrong: ${error.message}`);
    },
  });
};
export const removeHospitalMemberProcedure = async ({
  memberId,
  hospitalProcedureId,
}: {
  memberId: string;
  hospitalProcedureId: string;
}): Promise<{
  success: boolean;
  status: number;
  data: {
    procedureId: string;
    teamMemberId: string;
  };
}> => {
  const response = await axiosInstance.patch<{
    success: boolean;
    status: number;
    data: {
      procedureId: string;
      teamMemberId: string;
    };
  }>(
    `${process.env.BASE_URL}/hospital-procedure/remove-procedure-member/${hospitalProcedureId}`,
    {
      memberId,
    },
  );
  return {
    success: response.data.success,
    status: response.data.status,
    data: response.data.data,
  };
};

export const useRemoveHospitalProcedureMember = ({
  hospitalProcedureId,
}: {
  hospitalProcedureId: string;
}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: removeHospitalMemberProcedure,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`hospital-procedure`, hospitalProcedureId],
      });
      toast.success('Team member removed successfully');
    },
    onError: (error) => {
      toast.error(`Something went wrong: ${error.message}`);
    },
  });
};

export const addHospitalMemberToProcedure = async ({
  role,
  memberId,
  hospitalProcedure,
}: {
  role: NameJSONType;
  memberId: string;
  hospitalProcedure: string;
}): Promise<{
  success: boolean;
  status: number;
  data: {
    role: NameJSONType;
    memberId: string;
  };
}> => {
  const response = await axiosInstance.post<{
    success: boolean;
    status: number;
    data: {
      role: NameJSONType;
      memberId: string;
    };
  }>(
    `${process.env.BASE_URL}/hospital-procedure/add-member/${hospitalProcedure}`,
    {
      role,
      memberId,
    },
  );
  return {
    success: response.data.success,
    status: response.data.status,
    data: response.data.data,
  };
};

export const useAddHospitalMemberToProcedure = ({
  hospitalProcedureId,
  onClose,
}: {
  hospitalProcedureId: string;
  onClose: (() => void) | null;
}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addHospitalMemberToProcedure,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`hospital-procedure`, hospitalProcedureId],
      });
      toast.success('Team member added successfully');
      if (onClose) {
        onClose();
      }
    },
    onError: (error) => {
      toast.error(`Something went wrong: ${error.message}`);
    },
  });
};
