import Box from '@/components/atoms/box';
import { Timestamp } from 'firebase/firestore';

interface IPaymentBubble {
  index: number;
  chatRoomID: string;
  messageId: string;
  msg: string;
  isMine: boolean;
  seen: boolean;
  createdAt: Timestamp;
  url: string | undefined;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const PaymentBubble = ({ index, chatRoomID, messageId, seen, msg, isMine, createdAt, url }: IPaymentBubble) => {
  return (
    <Box
      sx={{
        transform: 'scaleY(-1)',
        display: 'flex',
        justifyContent: isMine ? `flex-end` : `flex-start`,
      }}
    >
      PayRequest Card Not Availabel
    </Box>
  );
};

export default PaymentBubble;
