import Box, { IBox } from '@/components/atoms/box';
import Button from '@/components/atoms/button';
import Chip from '@/components/atoms/chip';
import PriceLogo from '@/components/atoms/icons/priceLogo';
import RefundIcon from '@/components/atoms/icons/refundIcon';
import ReviewSingleStarIcon from '@/components/atoms/icons/reviewSingleStarIcon';
import TipIcon from '@/components/atoms/icons/tipIcon';
import Typography from '@/components/atoms/typography';
import { OrderStatusEnum } from '@/enum/orderEnum';
import {
  amountKey,
  commentsKey,
  createdAtKey,
  idKey,
  infoKey,
  nicknameKey,
  ratings2Key,
  senderKey,
  shortLinkKey,
  statusKey,
  teleIdKey,
  typeKey,
} from '@/keys/firestoreKeys';
import { useSelectedConversationStore } from '@/store/reducers/conversationReducer';
import { useUserStore } from '@/store/reducers/usersReducer';
import { Card, CardContent, useMediaQuery } from '@mui/material';
import { DocumentData, DocumentSnapshot, QueryDocumentSnapshot, Timestamp } from 'firebase/firestore';
import React, { memo } from 'react';
import Rating from '../../ratings';

interface IBabeMessageCard extends IBox {
  index: number;
  data: QueryDocumentSnapshot<DocumentData>;
  tipOnClick: () => void;
  reviewOnClick: (arg: number) => void;
  refundOnClick: (arg: any) => void;
  orderData: DocumentSnapshot<DocumentData, DocumentData> | null;
  reviewData: DocumentSnapshot<DocumentData, DocumentData> | null;
}
interface IStruct {
  [idKey]: string;
  [createdAtKey]: Timestamp;
  [typeKey]: number;
  [amountKey]: number;
  [infoKey]: {
    [uid: string]: {
      [idKey]: string | undefined;
      [shortLinkKey]: string | undefined;
      [senderKey]: string | undefined;
      [nicknameKey]: string | undefined;
      [teleIdKey]: string | undefined;
    };
  };
}

// eslint-disable-next-line react/display-name
const BabeMessageCard = memo(
  ({ index, data, tipOnClick, reviewOnClick, refundOnClick, orderData, reviewData, ...props }: IBabeMessageCard) => {
    const isMobile = useMediaQuery('(max-width:600px)');

    const conversation = useSelectedConversationStore();

    const documentData = data?.data() as IStruct;
    const googleLink = 'https://g.page/r/CbGyPSjHcdeWEAI/review';

    const { currentUser } = useUserStore();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const [isAdmin] = [currentUser?.isAdmin || currentUser?.a];
    const orderId = documentData?.[idKey];

    const sender = conversation?.sender;
    const name = sender ? documentData?.[infoKey]?.[sender]?.[nicknameKey] : '';

    const reviewComment = reviewData?.get(commentsKey);
    const reviewStar = reviewData?.get(ratings2Key);

    let header = '';
    let subHeader = null;
    let isRefundButtonVisible = false;
    let refundButtonText = 'Refund';

    if (orderData?.get(statusKey) === OrderStatusEnum?.pending_refund) {
      header = `Pending refund: `;
      subHeader = isAdmin ? (
        <>
          The transaction has been requested for refunded by{' '}
          <span
            style={{
              color: '#1A1A1A',
              fontWeight: 700,
            }}
          >
            {name}.
          </span>
        </>
      ) : (
        <>
          The transaction has been requested for refunded by{' '}
          <span
            style={{
              color: '#1A1A1A',
              fontWeight: 700,
            }}
          >
            you.
          </span>
        </>
      );
    } else if (orderData?.get(statusKey) === OrderStatusEnum?.refunded) {
      header = 'Refunded: ';
      subHeader = isAdmin ? (
        <>
          The transaction has been refunded to your{' '}
          <span
            style={{
              color: '#1A1A1A',
              fontWeight: 700,
            }}
          >
            {name}.
          </span>
        </>
      ) : (
        <>
          The transaction has been requested for refunded by{' '}
          <span
            style={{
              color: '#1A1A1A',
              fontWeight: 700,
            }}
          >
            you.
          </span>
        </>
      );
    } else if (orderData?.get(statusKey) === OrderStatusEnum?.refund_rejected) {
      header = 'Reject refund: ';
      subHeader = isAdmin ? (
        <>
          The refund process has been rejected by{' '}
          <span
            style={{
              color: '#1A1A1A',
              fontWeight: 700,
            }}
          >
            {name}.
          </span>
        </>
      ) : (
        <>
          The refund process has been rejected by{' '}
          <span
            style={{
              color: '#1A1A1A',
              fontWeight: 700,
            }}
          >
            you.
          </span>
        </>
      );
    } else if (reviewComment) {
      header = isAdmin ? `Payment received: ` : 'Sucessful payment: ';
      subHeader = (
        <>
          {reviewComment}
          <br />
          <Typography
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Rating ratingData={undefined} max={5} size="small" value={reviewStar} readOnly />
          </Typography>
        </>
      );
    } else {
      header = isAdmin ? `Payment received: ` : 'Sucessful payment: ';
      subHeader = isAdmin ? (
        <>
          You have received{' '}
          <span
            style={{
              color: '#1A1A1A',
            }}
          >
            <PriceLogo size={16} />
            {(documentData[amountKey] / 100).toFixed(2)}
          </span>{' '}
          from{' '}
          <span
            style={{
              color: '#1A1A1A',
            }}
          >
            {name}
          </span>
        </>
      ) : (
        <>
          The transaction is successfully completed! <br />
          Please tip/review or issue a refund in 72 hours
        </>
      );
    }

    if (!isAdmin && !(orderData?.get(statusKey) === OrderStatusEnum?.refunded)) {
      isRefundButtonVisible = true;
      if (orderData?.get(statusKey) === OrderStatusEnum?.pending_refund) {
        refundButtonText = 'Update refund request';
      }
    } else if (isAdmin && orderData?.get(statusKey) === OrderStatusEnum?.pending_refund) {
      isRefundButtonVisible = true;
      refundButtonText = 'View refund request';
    }

    return (
      <Box sx={{ transform: 'scaleY(-1)', display: 'flex', justifyContent: 'center' }}>
        <Box>
          <Card
            sx={{
              borderRadius: 4,
              maxWidth: '400px',
              width: isMobile ? '100%' : '400px',
              boxShadow: 'none',
              border: '1px solid #F0F0F0',
            }}
          >
            <CardContent sx={{ p: 0 }}>
              <Box
                p="16px 0"
                bgcolor="#1A1A1A"
                display="flex"
                justifyContent="center"
                flexDirection="column"
                alignItems="center"
                gap={1}
                {...props}
              >
                <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                  <PriceLogo size={24} />
                  <Typography variant="h4" component="span" fontWeight={500} color="#FFF">
                    {header}
                    {(documentData[amountKey] / 100).toFixed(2)}
                  </Typography>
                </Box>
                <Typography variant="caption" color={'#999999'}>{`Order ID: ${orderId} `}</Typography>
              </Box>
              <Box
                sx={{
                  padding: '12px 12px 16px 12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                <Box>
                  <Typography variant="body1" color="#999" textAlign="center">
                    {subHeader}
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  fontWeight={700}
                  sx={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}
                >
                  {!isAdmin && (
                    <Chip
                      onClick={tipOnClick}
                      sx={{ cursor: 'pointer', padding: '8px 16px' }}
                      variant="outlined"
                      icon={
                        <Box display="flex" justifyContent="center" alignItems="center" width={24} height={24}>
                          <TipIcon size={16} />
                        </Box>
                      }
                      label="Tip"
                    />
                  )}
                  <Chip
                    onClick={() => reviewOnClick(index)}
                    variant="outlined"
                    sx={{ cursor: 'pointer', padding: '8px 16px' }}
                    icon={<ReviewSingleStarIcon size={16} />}
                    label={reviewComment ? 'Update review' : 'Review'}
                  />
                  {isRefundButtonVisible && (
                    <Chip
                      sx={{ cursor: 'pointer', padding: '8px 16px' }}
                      variant="outlined"
                      onClick={() => refundOnClick(documentData[idKey])}
                      icon={<RefundIcon />}
                      label={refundButtonText}
                    />
                  )}
                </Typography>
                <Box textAlign="center">
                  <Button
                    variant="text"
                    onClick={() => {
                      if (typeof window !== 'undefined') {
                        window?.open(googleLink, '_blank');
                      }
                    }}
                  >
                    Rate RentBabe
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    );
  }
);

export default BabeMessageCard;
