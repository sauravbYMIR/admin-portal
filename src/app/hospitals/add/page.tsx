'use client';

/* eslint-disable jsx-a11y/label-has-associated-control */
import { FbtButton, FbtFileUpload } from '@frontbase/components-react';
import Image from 'next/image';

import { Header } from '@/components';
import backArrow from '@/public/assets/icons/backArrow.svg';
import { countryData } from '@/utils/global';

import addHospitalStyle from './style.module.scss';

function AddHospital() {
  return (
    <div>
      <Header />

      <div className={addHospitalStyle.hospitalFormContainer}>
        <Image src={backArrow} alt="back arrow icon" />
        <h2 className={addHospitalStyle.title}>Hospital profile</h2>

        <div className={addHospitalStyle.hospitalProfileForm}>
          <label
            style={{ marginBottom: '6px' }}
            className={addHospitalStyle.label}
          >
            Hospital logo
          </label>
          <FbtFileUpload message="PNG, JPG (max. 10 MB)" />

          <label
            style={{ margin: '24px 0 8px' }}
            className={addHospitalStyle.label}
          >
            Hospital name
          </label>
          <input
            className={addHospitalStyle.input}
            type="text"
            placeholder="Type here"
          />

          <label
            style={{ margin: '32px 0 0' }}
            className={addHospitalStyle.label}
          >
            Hospital Description
          </label>

          <div className={addHospitalStyle.langTabContainer}>
            {countryData.map((data) => {
              return (
                <button key={data.locale} type="button">
                  {data.language}
                </button>
              );
            })}
          </div>

          <textarea
            className={addHospitalStyle.textarea}
            placeholder="Type here"
          />

          <h3 className={addHospitalStyle.subTitleAddress}>Address</h3>

          <label
            style={{ marginBottom: '8px' }}
            className={addHospitalStyle.label}
          >
            Street name
          </label>
          <input
            style={{ marginBottom: '32px' }}
            className={addHospitalStyle.input}
            type="text"
          />

          <label
            style={{ marginBottom: '8px' }}
            className={addHospitalStyle.label}
          >
            Street number
          </label>
          <input
            style={{ marginBottom: '32px' }}
            className={addHospitalStyle.input}
            type="text"
          />

          <div className={addHospitalStyle.cityCountryInputWrapper}>
            <div className={addHospitalStyle.cityInputWrapper}>
              <label
                style={{ marginBottom: '8px' }}
                className={addHospitalStyle.label}
              >
                City
              </label>
              <input className={addHospitalStyle.input} type="text" />
            </div>

            <div className={addHospitalStyle.countryInputWrapper}>
              <label
                style={{ marginBottom: '8px' }}
                className={addHospitalStyle.label}
              >
                Country
              </label>
              <input className={addHospitalStyle.input} type="text" />
            </div>
          </div>

          <label
            style={{ marginBottom: '8px' }}
            className={addHospitalStyle.label}
          >
            Zip code
          </label>
          <input
            style={{ marginBottom: '64px' }}
            className={addHospitalStyle.input}
            type="text"
          />

          <h3 className={addHospitalStyle.subTitleHospitalGallery}>
            Hospital gallery
          </h3>
          <p className={addHospitalStyle.hospitalGalleryDesc}>
            Upload a minimum of 3 media items and maximum 10 media items
          </p>

          <FbtFileUpload message="PNG, JPG, MP4, MOV  (max. 10 MB)" />

          <div className={addHospitalStyle.footerBtnContainer}>
            <FbtButton
              className={addHospitalStyle.cancelBtn}
              size="sm"
              variant="outline"
            >
              <p>Cancel</p>
            </FbtButton>

            <FbtButton
              className={addHospitalStyle.publishBtn}
              size="sm"
              variant="solid"
            >
              <p>Publish</p>
            </FbtButton>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddHospital;
