import React, { useEffect, useRef, useState } from 'react';
import Avatar from '@/components/atoms/avatar';
import Box from '@/components/atoms/box';
import Button from '@/components/atoms/button';
import Typography from '@/components/atoms/typography';
import Dialog from '@/components/molecules/dialogs';
import Rating from '@/components/molecules/ratings';
import { TextareaAutosize } from '@mui/material';
import styles from '../order.module.css';
import Toggle from '@/components/atoms/toggle';
import CheckBox from '@/components/atoms/checkbox';
import {
  APNSTokenKey,
  REVIEWS,
  USERS,
  annonymousKey,
  commentsKey,
  completedKey,
  mobileUrlKey,
  nicknameKey,
  ratings2Key,
  ratingsKey,
  senderKey,
  teleIdKey,
  uidKey,
} from '@/keys/firestoreKeys';
import { httpsCallable } from 'firebase/functions';
import { db, functions } from '@/credentials/firebase';
import {
  sendPushNotificationFunction,
  sendTelegramNotificationFunction,
  updateUserReviewFunction,
} from '@/keys/functionNames';
import { doc, getDoc } from 'firebase/firestore';
import { APNSTokenProps } from '@/props/userProps';
import Toast from '@/components/molecules/toast';

interface IRequestOrderModal {
  uid?: string;
  isOpen: boolean;
  isMobile: boolean;
  isTablet: boolean;
  babeDetails: any;
  setOpen: (arg: boolean) => void | undefined;
}

const ReviewModal = ({ isMobile, isTablet, isOpen, babeDetails, setOpen }: IRequestOrderModal) => {
  const [comment, setComment] = useState('');
  const [check, setCheck] = useState<boolean>(false);
  const [isAnnon, setIsAnnon] = useState<boolean>(false);
  const [rating, setRating] = useState<number | null>();
  const [teleid, setTeleid] = useState<string>('');
  const [apnsToken, setApnsToken] = useState<APNSTokenProps | undefined>();
  const [nickname, setNickname] = useState<string>();
  const [url, setUrl] = useState<string>();
  const [otherUID, setOtherUID] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const [openToast, setToast] = useState<boolean>(false);
  const prevRating = useRef<number | null | undefined>(0);
  const sidMatch = babeDetails?.reviewLink?.match(/[?&]sid=([^&]+)/);
  const sid = sidMatch ? sidMatch[1] : null;
  const reset = () => {
    setComment('');
    setCheck(false);
    setIsAnnon(false);
  };

  const sumbitHandler = async () => {
    if (!otherUID) {
      alert('Please try again');
      return;
    }
    const map: { [key: string]: any } = {
      [ratings2Key]: rating,
      [completedKey]: true,
      [annonymousKey]: isAnnon,
    };

    if (comment) map[commentsKey] = comment;
    try {
      setLoading(true);
      const updateUserReview = httpsCallable(functions, updateUserReviewFunction);
      const promises = [];

      const promise = updateUserReview({
        id: sid,
        uid: otherUID,
        star: rating,
        map: map,
        prevRating: prevRating.current,
      });

      promises.push(promise);

      const text = `You have received ${rating} star review from ${
        babeDetails.currentUserName?.charAt(0).toUpperCase() + babeDetails.currentUserName.slice(1) ?? 'a user'
      }!`;

      if (teleid) {
        const sendTelegramNotification = httpsCallable(functions, sendTelegramNotificationFunction);
        const msg = encodeURIComponent(text);

        const promise = sendTelegramNotification({
          tele_id: teleid,
          text: msg,
        });

        promises.push(promise);
      }

      if (apnsToken) {
        const sendPushNotification = httpsCallable(functions, sendPushNotificationFunction);

        const promise = sendPushNotification({
          token: apnsToken,
          title: nickname ?? '',
          body: text ?? '',
          icon: url ?? '',
        });

        promises.push(promise);
      }

      await Promise.all(promises);
      if (prevRating.current) {
        prevRating.current = rating;
      }
      setLoading(false);
      reset();
      setToast(true);
      setOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!sid) {
      console.log('Cannot find review');
      return;
    }

    getDoc(doc(db, REVIEWS, sid)).then(async (snapShot) => {
      // const completed = snapShot.get(completedKey) as boolean | undefined
      const uid = snapShot.get(uidKey) as string;

      const sender = snapShot.get(senderKey) as string;

      if (sender !== babeDetails?.myUID) {
        return;
      }

      let ratings = (snapShot.get(ratings2Key) as number) ?? (snapShot.get(ratingsKey) as number);
      const comments = snapShot.get(commentsKey) as string;
      const annonymous = snapShot.get(annonymousKey) as boolean | undefined;

      if (ratings === 0) {
        ratings = 1;
      } else if (ratings > 5) {
        ratings = 5;
      }

      if (ratings) {
        prevRating.current = ratings;
        setRating(ratings);
      }
      if (comments) setComment(comments);

      if (annonymous !== undefined) setIsAnnon(annonymous);

      setOtherUID(uid);

      //get member details
      getDoc(doc(db, USERS, uid)).then((snapShot) => {
        const url = snapShot.get(mobileUrlKey) as string;
        const nickname = snapShot.get(nicknameKey) as string;

        const teleID = snapShot.get(teleIdKey) as string;
        const APNSToken = snapShot.get(APNSTokenKey) as APNSTokenProps | undefined;

        if (teleID) setTeleid(teleID);
        if (APNSToken) setApnsToken(APNSToken);

        if (!nickname || !url) {
          alert('Cannot find profile');
          return;
        }

        setNickname(nickname);
        setUrl(url);
      });
    });
  }, [sid]);

  return (
    <>
      <Dialog
        maxWidth="sm"
        onClose={() => setOpen(false)}
        footer={
          <Box display="flex" justifyContent={'flex-end'} gap={3} p={4}>
            <Button
              variant="outlined"
              sx={{
                p: '12px 20px',
                whiteSpace: 'nowrap',
                height: 48,
              }}
              onClick={() => setOpen(false)}
            >
              Close
            </Button>
            <Button
              variant="contained"
              disabled={!rating || !comment || !check}
              loading={loading}
              sx={{
                p: '12px 20px',
                whiteSpace: 'nowrap',
                height: 48,
              }}
              onClick={sumbitHandler}
            >
              {'Submit'}
            </Button>
          </Box>
        }
        sx={{
          '.MuiPaper-root': {
            borderRadius: '24px',
            width: isMobile ? '100%' : isTablet ? '800px' : '1000px',
          },
          '.MuiDialogContent-root': {
            position: 'relative',
          },
          '.MuiDialogActions-root': {
            p: 'unset',
          },
        }}
        open={isOpen}
      >
        <Box display="flex" flexDirection="column" gap={5}>
          <Typography variant="h3" fontWeight={500}>
            Review {babeDetails?.name}
          </Typography>
          <Typography variant="body1" color="#646464">
            The credits that you sent to the user will be transferred to their bank account immediately.
          </Typography>
          <Box display="flex" gap={3} justifyContent="center">
            <Box display="flex" flexDirection="column" gap={1}>
              <Box display="flex" gap={2} alignItems="center" justifyContent="center">
                <Avatar avatars={[{ alt: 'H', src: babeDetails?.profile }]} sx={{ width: 24, height: 24 }} />
                <Box display="flex" flexDirection="column" gap={1}>
                  <Typography variant="subtitle2" fontWeight={500} color="#646464">
                    {babeDetails?.name}
                  </Typography>
                </Box>
              </Box>
              <Rating
                ratingData={undefined}
                max={5}
                size="large"
                value={rating}
                onChange={(event, newValue) => {
                  setRating(newValue);
                }}
              />
            </Box>
          </Box>
          <Box display="flex" flexDirection="column" gap={1}>
            <Typography variant="subtitle2" fontWeight={500}>
              Share your experience
            </Typography>
            <TextareaAutosize
              placeholder="Share your experience"
              className={styles.textArea}
              onChange={(e) => setComment(e.target.value)}
              value={comment}
            />
          </Box>
          <Box display="flex" flexDirection="column">
            <Toggle
              color="primary"
              label={
                <Typography variant="subtitle2" component="span">
                  Annonymous
                </Typography>
              }
              sx={{ m: 2 }}
              onChange={() => setIsAnnon((prev) => !prev)}
              checked={isAnnon}
            />
            <CheckBox
              onChange={(e, boolean) => setCheck(boolean)}
              checked={check}
              label={
                <Typography variant="body1" component="span" color={'#646464'}>
                  I understand that a refund cannot be issued
                </Typography>
              }
            />
          </Box>
        </Box>
      </Dialog>
      <Toast
        alertMessage="Thank you for your feedback"
        onClose={() => setToast(false)}
        open={openToast}
        horizontal="center"
        vertical="top"
      />
    </>
  );
};

export default ReviewModal;
