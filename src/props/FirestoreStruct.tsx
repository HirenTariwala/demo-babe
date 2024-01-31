import {
  babeUIDKey,
  chatRoomIdKey,
  clientUIDKey,
  gatewayKey,
  idKey,
  infoKey,
  issuedPaymentKey,
  nicknameKey,
  originKey,
  priceKey,
  rejectReasonAfterKey,
  rejectReasonKey,
  securityRangeKey,
  servicesKey,
  sessionIdKey,
  statusKey,
  stripeConnectAccountKey,
  timeStampKey,
  urlKey,
} from '@/keys/firestoreKeys';
import { Timestamp } from 'firebase/firestore';
import { ServiceDetails } from './servicesProps';
import { RequestRefundProps, UserInfoProps } from './commonProps';

export interface OrderStruct {
  [idKey]: string;
  [babeUIDKey]: string;
  [chatRoomIdKey]: string;
  [clientUIDKey]: string;
  [gatewayKey]: number;
  [nicknameKey]: string;
  [originKey]: string;
  [priceKey]: number;
  [stripeConnectAccountKey]: string;
  [sessionIdKey]: string;
  [statusKey]: number;
  [timeStampKey]: Timestamp;
  [urlKey]: string;
  [securityRangeKey]: number;
  [issuedPaymentKey]: boolean;
  [servicesKey]: ServiceDetails;
  [infoKey]: UserInfoProps | undefined;
  [rejectReasonKey]: RequestRefundProps | undefined;
  [rejectReasonAfterKey]: UserInfoProps | undefined;
}
