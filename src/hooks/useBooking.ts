import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { axiosInstance } from '@/utils/axiosInstance';

import type { NameJSONType, ReimbursementJSONType } from './useDepartment';

export type BookingType = {
  id: string;
  gender: string;
  claimCountry: string;
  bookingStatus: string;
  isElfsightFormSubmitted: false;
  hospitalProcedureId: string;
  userId: string;
  // costOfProcedure: {
  //   price: number;
  //   currency: string;
  // };
  // reimbursementCost: {
  //   price: number;
  //   currency: string;
  // };
  patientPreferredStartDate: string;
  patientPreferredEndDate: string;
  applicationDate: string;

  preferredLanguage: string;
  procedureName: NameJSONType;
  applicationStatus: string;
  hospitalName: string;
  hospitalStay: string;
  waitTime: string;
  costOfProcedure: ReimbursementJSONType;
  reimbursementCost: ReimbursementJSONType;
};

export type BookingResponse = {
  success: boolean;
  status: number;
  data: Array<BookingType>;
};

export type BookingDetailType = {
  id: string;
  gender: string;
  claimCountry: string;
  bookingStatus: string;
  isElfsightFormSubmitted: false;
  hospitalProcedureId: string;
  userId: string;
  patientPreferredStartDate: string;
  patientPreferredEndDate: string;
  applicationDate: string;

  preferredLanguage: string;
  procedureName: NameJSONType;
  applicationStatus: string;
  hospitalName: string;
  hospitalStay: string;
  waitTime: string;
  costOfProcedure: ReimbursementJSONType;
  reimbursementCost: ReimbursementJSONType;
};

export type BookingDetailResponse = {
  success: boolean;
  status: number;
  data: BookingDetailType;
};

export const getAllBookings = async (): Promise<BookingResponse> => {
  const response = await axiosInstance.get<BookingResponse>(
    `${process.env.BASE_URL}/bookings`,
  );
  return {
    success: response.data.success,
    status: response.data.status,
    data: response.data.data,
  };
};

export const useGetAllBookings = () => {
  return useQuery({
    queryKey: [`bookings`],
    queryFn: () => getAllBookings(),
    refetchOnWindowFocus: false,
  });
};

export const getBookingDetail = async (
  bookingId: string,
): Promise<BookingDetailResponse> => {
  const response = await axiosInstance.get<BookingDetailResponse>(
    `${process.env.BASE_URL}/bookings/booking-detail/${bookingId}`,
  );
  return {
    success: response.data.success,
    status: response.data.status,
    data: response.data.data,
  };
};

export const useGetBookingDetail = ({ bookingId }: { bookingId: string }) => {
  return useQuery({
    queryKey: [`booking`, bookingId],
    queryFn: () => getBookingDetail(bookingId),
    refetchOnWindowFocus: false,
  });
};

export const updateBookingStatus = async ({
  bookingId,
  status,
}: {
  bookingId: string;
  status: boolean;
}): Promise<any> => {
  await axiosInstance.patch<any>(
    `${process.env.BASE_URL}/bookings/update-status/${bookingId}`,
    {
      status,
    },
  );
  return {
    success: true,
  };
};
export const useUpdateBookingStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateBookingStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`bookings`],
      });
    },
    onError: (error) => {
      toast(`Something went wrong: ${error.message}`);
    },
  });
};
