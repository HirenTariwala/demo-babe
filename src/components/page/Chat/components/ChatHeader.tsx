import { FC } from 'react';
import { Avatar, Card, CardHeader, Skeleton, Typography } from '@mui/material';
import {
  arrayRemove,
  doc,
  DocumentData,
  DocumentSnapshot,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from 'firebase/firestore';
import { Helper } from '@/utility/helper';
import { useUserStore } from '@/store/reducers/usersReducer';
import { useAppDispatch } from '@/store/useReduxHook';
import { setSelectedConversation } from '@/store/reducers/conversationReducer';
import { useRouter } from 'next/navigation';
import { db } from '@/credentials/firebase';
import {
  CONVERSATION,
  PREMIUM,
  blockKey,
  deleteOnKey,
  infoKey,
  isOnlineKey,
  mobileUrlKey,
  nicknameKey,
  premiumKey,
  usersKey,
  videoVerificationKey,
} from '@/keys/firestoreKeys';
import NextImage from '@/components/atoms/image';
import Box from '@/components/atoms/box';
import Verifed from '@/components/atoms/icons/verifed';
import { useDocumentQuery } from '@/hooks/useDocumentQuery';

interface ChatHeaderProps {
  senderUUID: string | undefined;
  myBlock: boolean;
  isUserDataLoading: boolean;
  chatRoomID: string | undefined;
  openBackButton: boolean;
  online: Timestamp | undefined;
  userData?: DocumentSnapshot<DocumentData> | null | undefined;
  hasOrder: boolean;
  profileClick: () => void;
}

const ChatHeader = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  senderUUID,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  myBlock,
  isUserDataLoading,
  chatRoomID,
  openBackButton: isOpen,
  online,
  userData: data,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  hasOrder,
  profileClick,
}:ChatHeaderProps) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const isChatBox = Helper?.getQueryStringValue('cri') ? true : false;

  const { currentUser } = useUserStore();
  const [myUID] = [currentUser?.uid];

  // eslint-disable-next-line

  const { data: premiumData } = useDocumentQuery(
    `prem-data-${data?.id}`,
    data?.id ? doc(db, PREMIUM, data?.id) : undefined
  );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const deleteClick = () => {
    if (!myUID || !chatRoomID) return;

    updateDoc(doc(db, CONVERSATION, chatRoomID), {
      [usersKey]: arrayRemove(myUID),
      [`${infoKey}.${myUID}.${deleteOnKey}`]: serverTimestamp(),
    });

    const path = Helper?.getURLEnd()?.toLowerCase();
    if (path === 'chatbox') {
      router.back();
    }

    dispatch(setSelectedConversation({ data: undefined }));
  };

  // const blockClick = () => {
  //   const otherUid = data?.id;

  //   if (!myUID || !otherUid) return;

  //   if (myBlock) {
  //     if (chatRoomID) {
  //       updateDoc(doc(db, CONVERSATION, chatRoomID), {
  //         [blockKey]: arrayRemove(myUID),
  //       });
  //     }
  //   } else {
  //     if (chatRoomID) {
  //       updateDoc(doc(db, CONVERSATION, chatRoomID), {
  //         [blockKey]: arrayUnion(myUID),
  //       });
  //     }
  //   }
  // };

  return (
    <Card
      sx={{
        maxHeight: '82px',
        boxShadow: 'none',
        borderLeft: `1px solid #e6e6e6`,
        borderRight: `1px solid #e6e6e6`,
        borderBottom: `1px solid #e6e6e6`,
        borderRadius: '0',
      }}
    >
      <CardHeader
        avatar={
          <Box display="flex" alignItems="center">
            {isOpen || isChatBox ? (
              <NextImage
                onClick={() => router?.back()}
                height={16}
                width={16}
                src="https://images.rentbabe.com/assets/back.svg"
                alt=""
              />
            ) : null}

            <Avatar
              onClick={profileClick}
              // src={data?.get(mobileUrlKey)?.toCloudFlareURL() ?? ''}
              src={data?.get(mobileUrlKey) ?? ''}
              alt=""
              sx={{ width: 40, height: 40, marginLeft: '1em', cursor: 'pointer' }}
            >
              <Skeleton variant="circular" width={40} height={40}></Skeleton>
            </Avatar>
          </Box>
        }
        title={
          <Box onClick={profileClick} display="flex" gap="8px" alignItems="center">
            {isUserDataLoading || data === undefined ? (
              <Skeleton variant="text" width="100px" />
            ) : (
              <Typography
                fontWeight="bold"
                sx={{
                  textTransform: 'capitalize',
                }}
                fontSize={21}
              >
                {data?.get(nicknameKey) ?? 'Account Deleted'}
              </Typography>
            )}

            {(data?.get(videoVerificationKey) as boolean) ? (
              <>
                <div className="flex-gap" />
                <Verifed size={24} />
              </>
            ) : null}

            {(premiumData?.get(premiumKey) as boolean) && (
              <>
                <div className="flex-gap" />
                {/* <UserTag /> */}
                User Tag
              </>
            )}
          </Box>
        }
        subheader={
          <>
            {isUserDataLoading ? (
              <>
                <Skeleton variant="text" width="40px" />
              </>
            ) : (
              <>
                {data ? (
                  <Box onClick={profileClick} display="flex">
                    <Typography fontWeight={500} variant="body2" color={data?.get(isOnlineKey) ? 'secondary' : 'error'}>
                      {premiumData?.get(blockKey)
                        ? 'CAUTION: This user is being banned'
                        : data?.get(isOnlineKey)
                        ? 'Online'
                        : online
                        ? `Last seen ${Helper?.timeSince(online?.toDate(), true)}`
                        : ''}
                    </Typography>

                    <div className="flex-gap" />
                  </Box>
                ) : (
                  <Skeleton variant="text" width="40px" />
                )}
              </>
            )}
          </>
        }
        // action={
        //   <HeaderMore
        //     senderUUID={senderUUID}
        //     myBlock={myBlock}
        //     chatRoomID={chatRoomID}
        //     deleteClick={deleteClick}
        //     blockClick={blockClick}
        //     reportData={{ user: data?.id, reportBy: myUID }}
        //     openProfile={profileClick}
        //     hasOrder={hasOrder}
        //   />
        // }
      />
    </Card>
  );
};

export default ChatHeader;
