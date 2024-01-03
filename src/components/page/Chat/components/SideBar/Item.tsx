import {
  infoKey,
  lastMessageKey,
  mobileUrlKey,
  nicknameKey,
  recipientNicknameKey,
  recipientProfileURLKey,
  senderKey,
  senderNicknameKey,
  senderProfileURLKey,
} from '@/keys/firestoreKeys';
import { ListItem, ListItemProps, ListItemText } from '@mui/material';
import { Fragment } from 'react';
import { User } from '../../shared/types';
import Typography from '@/components/atoms/typography';
import NextImage from '@/components/atoms/image';
import Box from '@/components/atoms/box';

export interface IItem extends ListItemProps {
  uid: string;
  otherUid: string | undefined;
  isSelected: boolean;
  doc: any;
  index: number;
  onClick?: () => void;
}

const Item = ({ uid, otherUid, isSelected, doc, index, onClick, ...props }: IItem) => {
  const isSender = (doc.get(senderKey) as string) === uid;
  const user = doc?.get(infoKey) as User | undefined;

  const nickname = otherUid
    ? user?.[otherUid]?.[nicknameKey] ??
      (doc.get(isSender ? recipientNicknameKey : senderNicknameKey) as string | undefined)
    : '';
  const url = otherUid
    ? user?.[otherUid]?.[mobileUrlKey] ??
      (doc.get(isSender ? recipientProfileURLKey : senderProfileURLKey) as string | undefined)
    : '';

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
      <Box width={50} height={50}>
        <Box position="relative" width={50} height={50}>
          <NextImage src={url} alt="" fill sizes="100%" style={{ borderRadius: '100px', objectFit: 'cover' }} />
        </Box>
      </Box>

      <ListItemText
        className="ellipsis"
        sx={{ color: '#1A1A1A', margin: '0px' }}
        primary={nickname}
        secondary={
          <Fragment>
            <Typography
              noWrap
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                color: '#999',
              }}
              variant="body2"
              color="text.primary"
            >
              {doc.get(lastMessageKey) as string}
            </Typography>
          </Fragment>
        }
      />
    </ListItem>
  );
};

export default Item;
