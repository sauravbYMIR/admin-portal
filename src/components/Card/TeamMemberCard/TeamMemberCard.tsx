import Image from 'next/image';

import sampleProfile from '@/public/assets/icons/sampleProfile.svg';

import style from './style.module.scss';

function TeamMemberCard() {
  return (
    <div className={style.cardContainer}>
      <div className={style.cardHeader}>
        <Image src={sampleProfile} alt="sample profile image" />
        <p>Heather Philip</p>
      </div>

      <p className={style.memberPosition}>Head of Obgyn</p>
      <p className={style.memberQualification}>Phd</p>
    </div>
  );
}

export default TeamMemberCard;
