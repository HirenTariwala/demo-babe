import { DocumentData, QueryDocumentSnapshot, QuerySnapshot } from 'firebase/firestore';
import { ListItemProps } from '@mui/material';
import { ConversationInfo } from '@/components/page/Chat/shared/types';

export interface ConvoProps {
  notification?: number | undefined;
  data?: QuerySnapshot<DocumentData> | null;
}

export interface ConversationProps {
  data: ConversationInfo | undefined;
}

export interface ChatItemProps extends ListItemProps {
  uid: string;
  otherUid: string | undefined;
  isSelected: boolean;
  doc: QueryDocumentSnapshot<DocumentData> | undefined;
  index: number;
  onClick?: () => void;
}
