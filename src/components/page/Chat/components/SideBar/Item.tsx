import {
  CONVERSATION,
  deleteOnKey,
  infoKey,
  lastMessageKey,
  mobileUrlKey,
  nicknameKey,
  recipientNicknameKey,
  recipientProfileURLKey,
  senderKey,
  senderNicknameKey,
  senderProfileURLKey,
  usersKey,
} from '@/keys/firestoreKeys';
import { ListItem, ListItemProps, ListItemText } from '@mui/material';
import { User } from '../../shared/types';
import Typography from '@/components/atoms/typography';
import NextImage from '@/components/atoms/image';
import Box from '@/components/atoms/box';
import DotIcon from '@/components/atoms/icons/dotIcon';
import Badge from '@/components/atoms/badge';
import Button from '@/components/atoms/button';
import { updateDoc, doc as firebaseDoc, arrayUnion, deleteField } from 'firebase/firestore';
import { db } from '@/credentials/firebase';
import { useState } from 'react';

export interface IItem extends ListItemProps {
  uid: string;
  otherUid: string | undefined;
  isSelected: boolean;
  doc: any;
  isArchive?: boolean;
  time?: string;
  index: number;
  size?: 'large' | 'small';
  onClick?: () => void;
  badge?: string | number;
}

const Item = ({
  uid,
  isArchive = false,
  size = 'large',
  otherUid,
  isSelected,
  time,
  doc,
  index,
  onClick,
  ...props
}: IItem) => {
  const isSender = (doc.get(senderKey) as string) === uid;
  const [loading, setLoading] = useState(false);
  const user = doc?.get(infoKey) as User | undefined;

  const nickname = otherUid
    ? user?.[otherUid]?.[nicknameKey] ??
      (doc.get(isSender ? recipientNicknameKey : senderNicknameKey) as string | undefined)
    : '';
  const url = otherUid
    ? user?.[otherUid]?.[mobileUrlKey] ??
      (doc.get(isSender ? recipientProfileURLKey : senderProfileURLKey) as string | undefined)
    : '';

  const retrieve = () => {
    setLoading(true);
    const chatRoomID = doc?.id;

    if (!uid || !chatRoomID) return;

    updateDoc(firebaseDoc(db, CONVERSATION, chatRoomID), {
      [usersKey]: arrayUnion(uid),
      [`${infoKey}.${uid}.${deleteOnKey}`]: deleteField(),
    });
    setLoading(false);
  };

  return (
    <ListItem
      {...props}
      key={index}
      sx={{
        cursor: 'pointer',
        // bgcolor: isSelected ? 'rgb(62, 125, 186)' : 'white',
        bgcolor: isSelected ? '#F0F0F0' : 'white',
        padding: '12px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        height: '72px',
        borderRadius: '16px',
      }}
      onClick={onClick}
    >
      <Box width={size ? 50 : 44} height={size ? 50 : 44}>
        <Box position="relative" width={size ? 50 : 44} height={size ? 50 : 44}>
          <NextImage src={url} alt="" fill sizes="100%" style={{ borderRadius: '100px', objectFit: 'cover' }} />
        </Box>
      </Box>

      <ListItemText
        className="ellipsis"
        sx={{ color: '#1A1A1A', margin: '0px' }}
        primary={nickname}
        secondary={
          <Box
            sx={{
              // width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <Typography
              noWrap
              sx={{
                width: 'calc(100% - 60px)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                color: '#999',
              }}
              variant="body2"
              color="text.primary"
            >
              {doc?.get(lastMessageKey) as string}
            </Typography>
            {!isArchive && (
              <Typography
                noWrap
                sx={{
                  color: '#646464',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  gap: '5px',
                }}
                fontSize="12px"
                variant="body2"
                color="text.primary"
              >
                <DotIcon />
                {time}
              </Typography>
            )}
          </Box>
        }
      />

      {isArchive ? (
        <Button
          size="small"
          onClick={retrieve}
          variant="contained"
          sx={{
            width: '88px',
            minWidth: '88px',
            cursor: 'pointer',
          }}
          loading={loading}
        >
          Retrieve
        </Button>
      ) : (
        !isSelected &&
        props.badge === ' ' && (
          <Badge
            variant="dot"
            badgeContent={props.badge}
            sx={{
              '.MuiBadge-badge': {
                background: '#37AAF2',
              },
            }}
          />
        )
      )}
    </ListItem>
  );
};

export default Item;
