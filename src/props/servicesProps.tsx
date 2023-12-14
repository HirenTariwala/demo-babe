import { Timestamp } from 'firebase/firestore';
import { UnitsEnum } from '../enum/myEnum';

export enum ServiceTypeEnum {
  meetup,
  eMeet,
  games,
  sports,
}

export interface ServiceDetailProps {
  id?: string;
  category?: string;
  serviceType?: number;
  title?: string;
  description?: string;
  image?: string;
  price?: number;
  bio?: string;
  suffix?: UnitsEnum;
  t?: Timestamp;
  rank?: number;
  dd?: string;
  profile?: string;
  uploadFile?: File | null;
  sbyprt?: number | undefined;
}

export interface ServicesProps {
  [serviceType: string]: {
    [category: string]: ServiceDetailProps | string;
  };
}

export interface UploadImageServiceProps {
  serviceType: string | undefined;
  url: string | undefined;
  category: string | undefined;
}

export interface ServiceDetails {
  id?: string;
  serviceType?: ServiceTypeEnum;
  details?: ServiceDetailProps;
}
