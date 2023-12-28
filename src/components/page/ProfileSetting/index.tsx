'use client';
import Box from '@/components/atoms/box';
import Typography from '@/components/atoms/typography';
import React from 'react';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import styles from './profileSetting.module.css';
import Button from '@/components/atoms/button';
import Avatar from '@/components/atoms/avatar';
import Input from '@/components/atoms/input';
import PhoneIcon from '@/components/atoms/icons/phoneIcon';
import Dropdown from '@/components/molecules/dropdown';
import { TextareaAutosize } from '@mui/material';
import DateTimePicker from '@/components/atoms/datepicker/datepicker';
import EditIcon from '@/components/atoms/icons/editIcon';
import AvatarIcon from '@/components/atoms/icons/avatarIcon';
import SimpleDialog from '@/components/atoms/modal';
import useProfileSettingHook from './useProfileSettingHook';

const locationData = [
  {
    label: (
      <Typography variant="body1" fontWeight={500} color="#1A1A1A" mr={2}>
        Male
      </Typography>
    ),
    key: 'Male',
    value: 'Male',
  },
  {
    label: (
      <Typography variant="body1" fontWeight={500} color="#1A1A1A" mr={2}>
        Female
      </Typography>
    ),
    key: 'Female',
    value: 'Female',
  },
  {
    label: (
      <Typography variant="body1" fontWeight={500} color="#1A1A1A" mr={2}>
        Other
      </Typography>
    ),
    key: 'Other',
    value: 'Other',
  },
];

const ProfileSetting = () => {
  const {
    isMobile,
    phone,
    base64String,
    deleteModal,
    activeLocation,
    handleCloseDeleteModal,
    handleDeleteModal,
    handleRemovePhoto,
    handleChange,
    handleLocationChange,
  } = useProfileSettingHook();

  return (
    <>
      <Box>
        <Typography variant="h2" className={styles['mainHeadingBox']}>
          Settings
        </Typography>
        <Box className={styles.profileBox}>
          <Box className={styles.innerBox}>
            <Box className={styles.headerBox}>
              <Typography variant="h5" sx={{ marginRight: '8px' }}>
                Basic Profile
              </Typography>{' '}
              <InfoOutlinedIcon className={styles.icon} />
            </Box>
            <Box>
              <Typography variant="h5">Upload profile picture</Typography>
              <Box className={styles.avatarBox}>
                <Box>
                  <Avatar
                    avatars={[
                      {
                        alt: 'cover image',
                        src: base64String || <AvatarIcon />,
                      },
                    ]}
                    sx={{
                      maxWidth: '100px',
                      maxHeight: '100px',
                      width: '100px',
                      height: '100px',
                      fontSize: '31px',
                      color: '#646464',
                      marginTop: '8px',
                    }}
                  />
                </Box>
                <Box className={styles.uploadBox}>
                  {!base64String.length ? (
                    <Button className={styles.uploadButton} component="label">
                      Upload photo
                      <input type="file" hidden onChange={handleChange} />
                    </Button>
                  ) : (
                    <>
                      <Button className={styles.uploadButton} component="label">
                        Choose another photo
                        <input type="file" hidden onChange={handleChange} />
                      </Button>
                      &nbsp;
                      <Button className={styles.uploadButton} component="label">
                        Remove
                        <input hidden onClick={handleRemovePhoto} />
                      </Button>
                    </>
                  )}
                </Box>
              </Box>
            </Box>
            <Box className={styles.userDetailBox}>
              <Box className={styles.usernameBox}>
                <Typography variant="h6" className={styles.formLabel}>
                  Username
                </Typography>
                <Input className={styles.usernameInput} />
              </Box>
              <Box className={styles.birthDetailsBox}>
                <Box className={styles.genderBirthBox}>
                  <Typography variant="h6" className={styles.formLabel}>
                    Date of birth
                  </Typography>
                  <DateTimePicker />
                </Box>
                <Box className={styles.genderBirthBox}>
                  <Typography variant="h6" className={styles.formLabel}>
                    Gender
                  </Typography>
                  <Dropdown
                    placeholderText=""
                    sx={{ background: '#fff', borderRadius: '100px', width: '100%' }}
                    value={activeLocation}
                    listData={locationData}
                    onChange={handleLocationChange}
                  />
                </Box>
              </Box>
              <Box className={styles.bioBox}>
                <Typography variant="h6" sx={{ marginBottom: '8px' }}>
                  Bio
                </Typography>
                <TextareaAutosize placeholder="Bio" className={styles.bioTextArea} />
              </Box>
            </Box>
            <Button className={styles.saveButton} component="label">
              Save
            </Button>
          </Box>
        </Box>
        <Box className={styles.newDetailBox}>
          <Box className={styles.phoneBox}>
            <Box className={styles.phoneNumberHeadingText}>
              <Typography variant="h5" sx={{ marginRight: '8px' }}>
                Phone Number
              </Typography>{' '}
            </Box>
            <Box className={styles.phoneIconWithText}>
              <Box className={styles.iconTextBox}>
                <PhoneIcon />
                <Box sx={{ display: 'block', marginLeft: '12px' }}>
                  <Typography variant="h6">Phone number</Typography>
                  <Typography variant="caption">+123456789</Typography>
                </Box>
              </Box>
              <Box>
                {phone ? (
                  <Button className={styles.binButton}>Bind</Button>
                ) : !isMobile ? (
                  <Button className={styles.binButton}>Edit</Button>
                ) : (
                  <Button sx={{ display: 'flex', justifyContent: 'end' }}>
                    <EditIcon />
                  </Button>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
        <Box className={styles.newDetailBox}>
          <Typography
            variant="h5"
            sx={{ cursor: 'pointer', fontWeight: 700, color: '#E32D2D', padding: '12px 20px' }}
            onClick={handleDeleteModal}
          >
            Delete account
          </Typography>
        </Box>
      </Box>
      <SimpleDialog
        modelWidth={!isMobile ? '552px' : 'fit-content'}
        isDeleteModel={true}
        footer={
          <>
            <Button className={styles.cancelBtn}>
              <Typography variant="subtitle1" onClick={handleCloseDeleteModal}>
                Cancel
              </Typography>
            </Button>
            <Button className={styles.deleteBtn}>
              <Typography variant="subtitle1"> {isMobile ? 'Delete' : 'Delete Account'}</Typography>
            </Button>
          </>
        }
        open={deleteModal}
        title={<Typography variant="h3">Delete Account</Typography>}
      >
        {!isMobile && (
          <Typography variant="body1" sx={{ color: '#646464', display: 'flex', marginTop: '16px' }}>
            Confirm that you want to delete your account by typing: &nbsp;
            <Typography variant="subtitle1">DELETE</Typography>
          </Typography>
        )}
        <Input sx={{ width: '100%', marginTop: '16px' }} />
      </SimpleDialog>
    </>
  );
};

export default ProfileSetting;
