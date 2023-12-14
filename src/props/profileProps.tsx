import { Timestamp } from 'firebase/firestore';
import { ServiceTypeEnum, ServicesProps } from './servicesProps';
import { PostTypeEnum, GenderEnum } from '../enum/myEnum';
import { EmeetsProps, PriceLimitProps } from './commonProps';
import { APNSTokenProps } from './userProps';

export interface StarProps {
  [star: number]: number;
}

export interface Item {
  type: PostTypeEnum;
  admin: boolean;
  uid: string;
  userGender: GenderEnum;
  nickname: string;
  bio: string;
  urls: string[];
  video_urls: string[] | undefined;
  price: number;
  drinks: string;
  race: string;
  availability: string;
  time_stamp: Timestamp | undefined;
  visible: boolean;
  width: number | undefined;
  height: number | undefined;
  mHeight: number | undefined;
  vac: number | undefined;
  isgToken: string | undefined;
  age: number | undefined;
  dob: number;
  videoVerification: boolean | undefined;
  geoEncodings: string[] | undefined;
  food: string | undefined;
  state: string;
  voiceUrl: string | undefined;
  rec: string[] | undefined;
  onClose?: () => void;
  mobileUrl: string | undefined;
  isPrivate: boolean;
  gonow_servce: ServiceTypeEnum;
  gonow_bio: string | undefined;
  gonow_coming_from: string | undefined;
  start: Date | undefined;
  end: Date | undefined;
  apply_info: string | undefined;
  nor: number;
  teleId: string | undefined;
  APNSToken: APNSTokenProps | undefined;
  active: Timestamp | undefined;
  currency: string | undefined;
  choosen: boolean;
  ratings: StarProps | undefined;
  ranking?: { [uid: string]: number } | undefined;
  orientation: string[] | undefined;
  services: ServicesProps | undefined;
  isGamer: boolean;
  priceLimit: PriceLimitProps | undefined;
  selected?: {
    serviceType: number;
    id: string;
  };
  extra?: any;
  createdAt?: Timestamp | undefined;
  clubName: string | undefined;
  clubState: string | undefined;
  emeets: EmeetsProps | undefined;
  sbyprt?: { [key: string]: any } | undefined;
  isOnline: boolean;
}
