import { DocumentData, DocumentSnapshot, Timestamp } from 'firebase/firestore';

import {
  adminKey,
  APNSTokenKey,
  clubKey,
  currencyKey,
  dateOfBirthKey,
  emeetsKey,
  genderKey,
  geoEncodingsKey,
  legalNameKey,
  nicknameKey,
  ratingsKey,
  rejectReasonAfterKey,
  servicesKey,
  stateKey,
  stripeApprovedKey,
  stripeConnectAccountKey,
  teleIdKey,
  timeStampKey,
  urlsKey,
  videoVerificationKey,
} from '../keys/firestoreKeys';
import { ClubProps, EmeetsProps } from '../props/commonProps';
import { StarProps } from '../props/profileProps';
import { ServiceDetailProps, ServicesProps, ServiceTypeEnum } from '../props/servicesProps';
import { APNSTokenProps } from '../props/userProps';
import { CalculatorHelper } from './calculator';
import { StringHelper } from './stringHelper';

export const defaultProfileImages = [
  `https://${process.env.NEXT_PUBLIC_IMAGE_PREFIX}/IMAGES/AVATAR/kitty0.png`,
  `https://${process.env.NEXT_PUBLIC_IMAGE_PREFIX}/IMAGES/AVATAR/kitty1.png`,
  `https://${process.env.NEXT_PUBLIC_IMAGE_PREFIX}/IMAGES/AVATAR/kitty2.png`,
  `https://${process.env.NEXT_PUBLIC_IMAGE_PREFIX}/IMAGES/AVATAR/kitty3.png`,
  `https://${process.env.NEXT_PUBLIC_IMAGE_PREFIX}/IMAGES/AVATAR/kitty4.png`,
];

export const ProfileHelper = {
  /**
   * Checks if all services under "games" have a profile image.
   *
   * @param {ServicesProps} services - The services object.
   * @returns {boolean} - Returns true if all game services have a profile, false otherwise.
   */
  hasGamingProfileImageForAll(services: ServicesProps): boolean {
    return Object.entries(services).every(([serviceType, serviceDetails]) => {
      if (serviceType !== ServiceTypeEnum.games.toString()) return true;

      return Object.values(serviceDetails).every((detail) => {
        const serviceDetail = detail as ServiceDetailProps;
        return typeof serviceDetail === 'string' || Boolean(serviceDetail.profile);
      });
    });
  },
  getUserProfile(userData: DocumentSnapshot<DocumentData> | undefined): { [key: string]: any } {
    if (!userData) return {};

    const thisAdmin = userData.get(adminKey) as boolean | undefined;
    const thisNickname = userData.get(nicknameKey) as string;
    const thisTeleId = userData.get(teleIdKey) as string;
    const thisVideoVerification = userData.get(videoVerificationKey) as boolean;
    const thisStripeConnectAccount = userData.get(stripeConnectAccountKey) as string;
    const thisStripeApproved = userData.get(stripeApprovedKey) as boolean;
    const thisGender = userData.get(genderKey) as number;
    const thisDob = userData.get(dateOfBirthKey) as Timestamp | undefined;
    const thisRatings = userData.get(ratingsKey) as StarProps | undefined;
    const thisIsActive = !!(userData.get(timeStampKey) as Timestamp);
    const thisAPNSToken = userData.get(APNSTokenKey) as APNSTokenProps | undefined;
    const thisMyClub = userData.get(clubKey) as ClubProps | undefined;
    const thisRejectReasonAfter = userData.get(rejectReasonAfterKey) as string | undefined;
    const thisGeo = userData.get(geoEncodingsKey) as string[] | undefined;
    const thisEmeets = userData.get(emeetsKey) as EmeetsProps | undefined;
    const thisServices = userData.get(servicesKey) as ServicesProps | undefined;
    const thisLegalName = userData.get(legalNameKey) as string | undefined;
    const thisCurrency = userData.get(currencyKey) as string | undefined;
    const thisState = userData.get(stateKey) as string | undefined;

    const map: { [key: string]: any } = {
      isAdmin: thisAdmin,
      nickname: thisNickname,
      teleId: thisTeleId,
      verified: thisVideoVerification,
      stripeApproved: thisStripeApproved,
      stripeConnectAccount: thisStripeConnectAccount,
      inactive: thisIsActive,
      APNSToken: thisAPNSToken,
      club: thisMyClub?.name,
      clubState: thisMyClub?.state,
      rejectReasonAfter: thisRejectReasonAfter,
      services: thisServices,
      state: thisState,
    };

    if (thisRatings) {
      const weightedValue = CalculatorHelper.weightedAverageValue(thisRatings);
      const numberOfRents = CalculatorHelper.numberOfMeetups(thisRatings);
      map.ratings = weightedValue > 0 ? weightedValue : undefined;
      map.numberOfRents = numberOfRents || undefined;
    } else {
      map.numberOfRents = undefined;
      map.ratings = undefined;
    }

    if (thisLegalName) {
      map.legalName = thisLegalName;
    }

    if (thisCurrency) {
      map.currency = thisCurrency;
    }

    const thisUrls = userData.get(urlsKey) as string[];

    if (thisUrls && thisUrls.length > 0) {
      const thisUrl = StringHelper.toCloudFlareURL(thisUrls[0]);
      // _mobileUrl = _url
      map.profileImage = thisUrl;
    }
    // }

    if (thisServices) {
      const keys = Object.keys(thisServices);
      map.hasEmeets = !!keys.includes('1');
      const hasGPIFA = this.hasGamingProfileImageForAll(thisServices);
      map.hasGamingProfileImageForAll = !!hasGPIFA;
    } else {
      map.hasEmeets = false;
    }

    if (thisEmeets) {
      const thisApp = thisEmeets?.app ?? [];
      const thisPref = thisEmeets?.pref ?? [];
      map.emeetsApp = thisApp.length > 0 ? thisApp : undefined;
      map.emeetsPref = thisPref.length > 0 ? thisPref : undefined;
    } else {
      map.emeetsApp = undefined;
      map.emeetsPref = undefined;
    }

    if (thisGeo && thisGeo?.length > 0) {
      const lastIndex = thisGeo.length - 1;
      const geo = thisGeo.at(lastIndex);
      if (typeof lastIndex === 'number' && geo !== undefined) {
        map.profileAtWhichState = geo;
      }
    } else {
      map.profileAtWhichState = undefined;
    }

    if (thisGender !== undefined && !Number.isNaN(thisGender)) {
      map.gender = thisGender.toString();
    }
    if (thisDob) {
      const time = `${thisDob.toDate()?.getTime()}`;
      map.dateOfBirth = time;
    }

    return map;
  },
};
