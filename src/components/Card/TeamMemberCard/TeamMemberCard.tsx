import Image from 'next/image';
import React from 'react';
import { ClipLoader } from 'react-spinners';

import { ProfileIcon } from '@/components/Icons/Icons';
import type { NameJSONType } from '@/hooks/useDepartment';
import { useDeleteTeamMember } from '@/hooks/useMember';

import style from './style.module.scss';

function TeamMemberCard({
  teamMemberId,
  name,
  role,
  qualification,
  isEdit,
  onOpen,
  profile,
  hospitalId,
}: {
  teamMemberId: string;
  name: string;
  role: string;
  qualification: NameJSONType;
  isEdit: boolean;
  onOpen: () => void;
  profile: string | false;
  hospitalId: string;
}) {
  const deleteTeamMember = useDeleteTeamMember({ hospitalId });
  return (
    <div className={style.cardContainer}>
      <div className={style.cardHeader}>
        {profile && typeof profile === 'string' ? (
          <Image
            src={`${profile}?version=${new Date().getTime()}`}
            width={32}
            height={32}
            className="aspect-square size-8 rounded-full border border-lightsilver object-contain"
            alt={name}
            priority
            unoptimized
          />
        ) : (
          <ProfileIcon className="size-6 rounded-full" />
        )}
        <p className="font-poppins text-base font-medium text-neutral-1">
          {name}
        </p>
      </div>
      <p className="font-lexend text-base font-light text-neutral-2">{role}</p>
      <p className="font-lexend text-base font-light text-neutral-2">
        {qualification?.en}
      </p>
      {isEdit && (
        <div className="mt-[10px] flex items-center justify-between">
          <button
            className="flex items-center justify-between text-darkteal"
            type="button"
            onClick={() => deleteTeamMember.mutate({ memberId: teamMemberId })}
          >
            {deleteTeamMember.isPending ? (
              <ClipLoader
                loading={deleteTeamMember.isPending}
                color="rgba(9, 111, 144, 1)"
                size={20}
                aria-label="Loading Spinner"
                data-testid="loader"
              />
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                  />
                </svg>
                <span className="ml-3 font-poppins text-base font-medium">
                  Remove
                </span>
              </>
            )}
          </button>
          <button
            className="flex items-center justify-between text-darkteal"
            type="button"
            onClick={onOpen}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
              />
            </svg>
            <span className="ml-3 font-poppins text-base font-medium">
              Edit
            </span>
          </button>
        </div>
      )}
    </div>
  );
}

export default TeamMemberCard;
