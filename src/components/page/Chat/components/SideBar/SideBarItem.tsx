import { Badge } from '@mui/material';

import { Timestamp } from 'firebase/firestore';
import { User } from '../../shared/types';
import {
  infoKey,
  lastSeenKey,
  recipientLastSeenKey,
  senderKey,
  senderLastSeenKey,
  updatedAtKey,
} from '@/keys/firestoreKeys';
import Item, { IItem } from './Item';

const SideBarItem = ({ ...props }: IItem) => {
  const isSender = (props?.doc?.get(senderKey) as string) === props?.uid;
  const user = props?.doc?.get(infoKey) as User;
  const isUpdatedAt = props?.doc?.get(updatedAtKey) as Timestamp;

  const myLastSeen =
    user?.[props?.uid]?.[lastSeenKey] ??
    (props?.doc?.get(isSender ? senderLastSeenKey : recipientLastSeenKey) as Timestamp);

  return (
    <>
      <Item
        {...props}
        secondaryAction={
          <>
            {!props.isSelected && (
              <Badge
                variant="dot"
                badgeContent={!myLastSeen ? ' ' : myLastSeen < isUpdatedAt ? ' ' : 0}
                color="secondary"
              />
            )}
          </>
        }
      />
    </>
  );
};

export default SideBarItem;
