import { ServicesProps } from './servicesProps';
import { RBACType } from './types/rbacType';

export interface APNSTokenProps {
  [deviceId: string]: string;
}

export enum UserType {
  NEW_USER,
  SPORTS,
  DOUBLE_DATES,
  MOST_POTENTIAL,
}

export interface UserProps {
  uid?: string | undefined | null;
  gender?: string | undefined | null;
  profileImage?: string | undefined | null;
  nickname?: string | undefined | null;
  nick?: string | undefined | null;
  phoneNumber?: string | undefined | null;
  isAdmin?: boolean | null | undefined;
  isPremium?: boolean;
  clientRecords?: number | undefined | null;
  teleId?: string | null | undefined;
  APNSToken?: APNSTokenProps;
  verified?: boolean;
  countryCode?: string | null | undefined;
  stripeConnectAccount?: string | null | undefined;
  stripeApproved?: boolean;
  isActive?: boolean;
  balance?: number | undefined;
  isBlock?: boolean;
  blockBroadcast?: boolean;
  userRBAC?: RBACType;
  email?: string | null | undefined;
  numberOfRents?: number | undefined | null;
  points?: number | undefined | null;
  incomeCredits?: number | undefined | null;
  pendingCredits?: number | undefined | null;
  penaltyCredits?: number | undefined | null;
  club?: string | null | undefined;
  clubState?: string | null | undefined;
  clubsRBAC?: string | null | undefined;
  profileAtWhichState?: string | null | undefined;
  rejectedReasonAfter?: string | null | undefined;
  ipaddress?: string | null | undefined;
  paynow?: string | null | undefined;
  dateOfBirth?: string | null | undefined;
  emeetsPref?: string[] | null | undefined;
  emeetsApp?: string[] | null | undefined;
  hasEmeets?: boolean;
  hasGamingProfileImageForAll?: boolean;
  legalName?: string | null | undefined;
  currency?: string | null | undefined;
  state?: string | null | undefined;
  ratings?: number | null | undefined;
  services?: ServicesProps | null | undefined;
}
