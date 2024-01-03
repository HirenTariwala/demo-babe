import React, { useState } from 'react';
import Box from '@/components/atoms/box';
import Button from '@/components/atoms/button';
import SimpleDialog from '@/components/atoms/modal';
import Typography from '@/components/atoms/typography';
import DragUpload from '@/components/molecules/upload/dragupload';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { TextareaAutosize } from '@mui/material';
import styles from '../profile.module.css';
import { REPORT, reasonKey, senderKey, timeStampKey, uidKey, urlKey } from '@/keys/firestoreKeys';
import { db, storage } from '@/credentials/firebase';
import Toast from '@/components/molecules/toast';

interface IReportModal {
  reportModalOpen: boolean;
  reportBy: string | null | undefined;
  user: string | null | undefined;
  setReportModalOpen: (arg: boolean) => void;
}

const ReportModal = ({ reportModalOpen, reportBy, user, setReportModalOpen }: IReportModal) => {
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<any>(null);
  const [openToast, setToast] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const onReport = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    if (!description || !reportBy || !user) return;

    const map: { [key: string]: any } = {
      [reasonKey]: description,
      [timeStampKey]: serverTimestamp(),
      [uidKey]: user,
      [senderKey]: reportBy,
    };

    if (image) {
      const uploadImageRef = ref(storage, `${REPORT}/${reportBy}/${new Date().getTime()}-${image.name}`);

      const uploadTask = await uploadBytes(uploadImageRef, image);
      const url = (await getDownloadURL(uploadTask.ref)) as string;

      map[urlKey] = url;
    }

    try {
      await addDoc(collection(db, REPORT), map);
      setLoading(false);
      setToast(true);
      setReportModalOpen(false);
    } catch (error) {
      console.log('report error ==> ', error);
    }
  };

  return (
    <>
      <SimpleDialog
        footer={
          <Box display="flex" justifyContent="flex-end" gap={2}>
            <Button
              variant="outlined"
              sx={{
                p: '12px 20px',
                whiteSpace: 'nowrap',
                height: 48,
              }}
              onClick={() => setReportModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              disabled={!description}
              loading={loading}
              sx={{
                p: '12px 20px',
                whiteSpace: 'nowrap',
                height: 48,
              }}
              onClick={onReport}
            >
              Report
            </Button>
          </Box>
        }
        open={reportModalOpen}
        title={
          <Typography variant="h3" fontWeight={500} component="span">
            Report User
          </Typography>
        }
        modelWidth={'fit-content'}
      >
        <Box display="flex" flexDirection="column" gap={4}>
          <Typography variant="body1" component="span">
            We take your feedback seriously, please write a reason why you are reporting this profile
          </Typography>
          <Typography variant="subtitle2" fontWeight={500}>
            Report description
          </Typography>
          <TextareaAutosize
            placeholder="Enter description"
            className={styles.textArea}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Typography variant="subtitle2" fontWeight={500}>
            Upload file
          </Typography>
          <DragUpload setImage={setImage} />
        </Box>
      </SimpleDialog>
      <Toast alertMessage="Reported Successfully" onClose={() => setToast(false)} open={openToast} />
    </>
  );
};

export default ReportModal;
