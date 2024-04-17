import Image from 'next/image';

import sampleProfile from '@/public/assets/icons/sampleProfile.svg';

import style from './style.module.scss';

function TeamMemberCard({
  name,
  role,
  qualification,
}: {
  name: string;
  role: string;
  qualification: string;
}) {
  return (
    <div className={style.cardContainer}>
      <div className={style.cardHeader}>
        <Image src={sampleProfile} alt="sample profile image" />
        <p>{name}</p>
      </div>

      <p className={style.memberPosition}>{role}</p>
      <p className={style.memberQualification}>{qualification}</p>
    </div>
  );
}

export default TeamMemberCard;
