import { Card, CardHeader, Skeleton, Typography, useMediaQuery } from '@mui/material';
import {
  arrayRemove,
  arrayUnion,
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
  usersKey,
  videoVerificationKey,
} from '@/keys/firestoreKeys';
import NextImage from '@/components/atoms/image';
import Box from '@/components/atoms/box';
import Verifed from '@/components/atoms/icons/verifed';
import { useDocumentQuery } from '@/hooks/useDocumentQuery';
import Badge from '@/components/atoms/badge';
import HeaderMore from './HeaderMore';
import ArrowForwardIcon from '@/components/atoms/icons/arrowForwardIcon';

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
  revalidate: () => void;
  onLockChat: () => void;
  lockUnlockChatLoading: boolean;
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
  revalidate,
  onLockChat,
  lockUnlockChatLoading,
}: ChatHeaderProps) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const isMobile = useMediaQuery('(max-width:600px)');
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

  const blockClick = () => {
    const otherUid = data?.id;

    if (!myUID || !otherUid) return;

    if (myBlock) {
      if (chatRoomID) {
        updateDoc(doc(db, CONVERSATION, chatRoomID), {
          [blockKey]: arrayRemove(myUID),
        });
      }
    } else {
      if (chatRoomID) {
        updateDoc(doc(db, CONVERSATION, chatRoomID), {
          [blockKey]: arrayUnion(myUID),
        });
      }
    }
    revalidate();
  };

  return (
    <Card
      sx={{
        maxHeight: '82px',
        minHeight: '77px',
        boxShadow: 'none',
        borderLeft: `1px solid #e6e6e6`,
        borderRight: `1px solid #e6e6e6`,
        borderBottom: `1px solid #e6e6e6`,
        borderRadius: '0',
      }}
    >
      <CardHeader
        title={
          <Box display="flex" gap={isMobile ? '12px' : '16px'} alignItems="center">
            <Box
              display="flex"
              alignItems="center"
              width={isMobile ? 'auto' : 44}
              height={44}
              position={'relative'}
              gap={'8px'}
            >
              {isOpen || isChatBox ? (
                <Box
                  onClick={() => router?.back()}
                  sx={{ transform: 'scaleX(-1)', display: 'flex', alignItems: 'center' }}
                >
                  <ArrowForwardIcon size={16} />
                </Box>
              ) : null}

              <NextImage
                onClick={profileClick}
                // fill={isMobile ? false : true}
                width={isMobile ? 36 : 44}
                height={isMobile ? 36 : 44}
                sizes="100%"
                style={{ borderRadius: '100px', objectFit: 'cover', cursor: 'pointer' }}
                src={data?.get(mobileUrlKey) ?? ''}
                alt=""
              />
            </Box>
            <Box flex="1 0 0">
              <Box
                sx={{
                  display: 'flex',
                  gap: '8px',
                  alignItems: 'center',
                  cursor: 'pointer',
                }}
                onClick={profileClick}
              >
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
                  <Box display="flex">
                    <Verifed size={24} />
                  </Box>
                ) : null}

                {/* {(premiumData?.get(premiumKey) as boolean) && (
                  <Box display="flex">
                    
                    User Tag
                  </Box>
                )} */}
              </Box>
              <Box>
                {isUserDataLoading ? (
                  <>
                    <Skeleton variant="text" width="40px" />
                  </>
                ) : (
                  <>
                    {data ? (
                      <Box
                        onClick={profileClick}
                        sx={{ display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer' }}
                      >
                        {data?.get(isOnlineKey) && (
                          <Badge
                            variant="dot"
                            badgeContent={''}
                            sx={{
                              '.MuiBadge-badge': {
                                backgroundColor: '#4CAF4F',
                                left: '-4px',
                              },
                            }}
                          />
                        )}
                        <Typography
                          fontWeight={500}
                          variant="body2"
                          color={premiumData?.get(blockKey) ? '#E32D2D' : data?.get(isOnlineKey) ? '#4CAF4F' : '#999'}
                        >
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
              </Box>
            </Box>
            <HeaderMore
              senderUUID={senderUUID}
              myBlock={myBlock}
              deleteClick={deleteClick}
              blockClick={blockClick}
              openProfile={profileClick}
              hasOrder={hasOrder}
              onLockChat={onLockChat}
              lockUnlockChatLoading={lockUnlockChatLoading}
            />
          </Box>
        }
      />
    </Card>
  );
};

export default ChatHeader;
