import {
  deleteField,
  // doc,
  DocumentData,
  DocumentSnapshot,
  QueryDocumentSnapshot,
  // serverTimestamp,
  Timestamp,
  // updateDoc,
} from 'firebase/firestore';
// import { logEvent } from '@firebase/analytics';
import {
  // areaLocalKey,
  availabilityLocalKey,
  bioLocalKey,
  foodPrefLocalKey,
  pageAreaLocalKey,
  priceLocalKey,
  privacyLocalKey,
  urlsLocalKey,
} from '../keys/localStorageKeys';
import { GenderEnum, PostTypeEnum, RaceEnum } from '../enum/myEnum';
import { Item, StarProps } from '../props/profileProps';
// import { db } from '../credentials/firebase';

import {
  additionalInfoKey,
  choosenKey,
  currencyKey,
  dateOfBirthKey,
  geoEncodingsKey,
  isgAccessTokenKey,
  mobileUrlKey,
  nicknameKey,
  numberOfRentsKey,
  privacyTimeStampKey,
  raceNameKey,
  stateKey,
  teleIdKey,
  timeStampKey,
  vaccinatedKey,
  videoUrlsKey,
  videoUrls2Key,
  videoVerificationKey,
  voiceUrlKey,
  drinksKey,
  comingFromKey,
  endKey,
  gonowBioKey,
  startKey,
  heightKey,
  orientationKey,
  ratingsKey,
  servicesKey,
  adminKey,
  genderKey,
  gamer,
  gonowServiceKey,
  raceKey,
  priceLimitKey,
  // USERS,
  APNSTokenKey,
  clubKey,
  myServicesKey,
  emeetsKey,
  createdAtKey,
  // sortByRatingsKey,
  sortByPricingKey,
  lowestKey,
  highestKey,
  isOnlineKey,
} from '../keys/firestoreKeys';
import { ServiceDetailProps, ServicesProps, ServiceTypeEnum } from '../props/servicesProps';
import { defaultProfileImages } from './profileHelper';
import { ClubProps, EmeetsProps, PriceLimitProps } from '../props/commonProps';
import { APNSTokenProps } from '../props/userProps';

export const Helper = {
  /**
   * Upgrade a user to premium.
   * If the user is not logged in, redirect to the Login page.
   * Otherwise, redirect to the Subscribe page with uid and current time as query parameters.
   *
   * @param {string | null | undefined} uid - The user ID
   */

  isMobileBrowser() {
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
    const mobileRegex =
      /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i;
    return mobileRegex.test(userAgent.slice(0, 4));
  },
  getQueryParamValueFromURL(key: string) {
    const url = new URL(window.location.href);
    return url.searchParams.get(key) ?? '';
  },
  getURLEnd(location: Location) {
    const last = decodeURIComponent(location.pathname.split('/').pop() ?? '');
    const endings = last.split('?')[0];
    return endings;
  },
  getQueryStringValue(key: string) {
    const url = new URL(window.location.href);
    return url.searchParams.get(key) ?? '';
  },

  randomInt(min: number, max: number) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
  },

  capitalize(string: string | undefined): string | undefined {
    if (string === undefined) {
      return undefined;
    }
    return string.charAt(0).toUpperCase() + string.slice(1);
  },

  ageFromDateOfBirthday(birthDate: Date | undefined): number {
    if (birthDate === undefined) return Number.NaN;

    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age -= 1;
    }

    return age;
  },

  /**
   * Get the string representation of a vaccination status based on a numerical code.
   *
   * @param {number | undefined} vac - The numerical code for the vaccination status.
   * @returns {string} - The string representation ('Yes', 'No', or '-')
   */
  getVacValue(vac: number | undefined): string {
    switch (vac) {
      case 0: {
        return 'No';
      }
      case 1: {
        return 'Yes';
      }
      default: {
        return '-';
      }
    }
  },

  /**
   * Get the domain extension from the current window's URL.
   *
   * @returns {string} - The domain extension (e.g., 'com', 'org').
   */
  getDomainExtension(): string {
    return window.location.href.split('//')[1].split('/')[0].split('.').at(-1) ?? '';
  },

  getCurrentPageState(): string[] | undefined {
    const area = localStorage.getItem(pageAreaLocalKey);

    if (area) {
      return area.split(', ');
    }

    return undefined;
  },

  getDummyItems(minBoxWidth: number): {
    width: number;
    height: number;
  }[] {
    const dummyItems: {
      width: number;
      height: number;
    }[] = [];

    const w = window.innerWidth;
    let myLimit = Math.floor(w / minBoxWidth) * 2;

    myLimit = myLimit < 10 ? 10 : myLimit * 2;

    Array.from({ length: myLimit }).forEach(() => {
      dummyItems.push({
        width: this.randomInt(200, 300),
        height: this.randomInt(150, 350),
      });
    });

    return dummyItems;
  },

  setTodayMidnightHours(midnight: Date) {
    midnight?.setTime(midnight?.getTime() + 24 * 60 * 60 * 1000);
    // today.setTime( today.getTime() + (2*60*60*1000) );
  },

  /**
   * Determines if the current user is free today based on the provided end timestamp.
   *
   * @param {Timestamp | undefined} end - The end timestamp.
   * @returns {boolean} - Returns `true` if the user is free today, otherwise `false`.
   */
  amIFreeToday(end: Timestamp | undefined): boolean {
    if (end !== undefined) {
      const now = new Date();
      const midnight = new Date(now);
      const today = new Date(now);

      this.setTodayMidnightHours(midnight);

      const endDate = end?.toDate();
      if (endDate > today && endDate < midnight) {
        return true;
      }
    }
    return false;
  },

  serviceValidation(data: ServicesProps | undefined): boolean {
    if (!data) return false;
    let found = false;

    Object.values(data).forEach((value) => {
      Object.values(value).forEach((thisValue) => {
        const v = thisValue as ServiceDetailProps;
        if (v.price && v.bio) {
          found = true;
        }
      });
    });

    return found;
  },

  /**
   * Configures URL data based on various conditions.
   *
   * @param {any} data - Data object which may contain URLs.
   * @param {boolean} join - Indicates whether the operation is a "join" operation.
   * @param {boolean | null | undefined} isAdmin - Indicates if the user is an admin.
   * @returns {string[]} - An array of URLs.
   */
  configureURL(data: any, join: boolean, isAdmin: boolean | null | undefined): string[] {
    const numberOfPhotosRequired = 6;
    const defaultArray = Array.from({ length: numberOfPhotosRequired }).fill('') as string[];
    const normalUser = typeof isAdmin !== 'boolean';

    const defaultImage = defaultProfileImages[this.randomInt(0, defaultProfileImages.length - 1)];

    const urls = (data?.get(urlsLocalKey) as string[] | undefined) || (normalUser ? [defaultImage] : defaultArray);

    if (join) {
      return urls.length < 6 ? [...urls, ...defaultArray.slice(urls.length)] : urls;
    }

    return normalUser ? [urls[0]] : urls.length === 1 ? defaultArray : urls;
  },

  validateGender(gender: number | undefined): string | null {
    if (gender === undefined) {
      return 'Gender is required';
    }
    return 'null';
  },

  validateNickname(nickname: string | undefined): string | null {
    if (!nickname) {
      return 'Nickname is required or invalid';
    }
    if (nickname?.length < 3) {
      return 'Nickname min. 3 letter';
    }
    return '';
  },

  validateDOB(DOB: Date | undefined): string | null {
    if (!DOB) return 'Date of birth is required';

    const age = Number.parseInt(this.ageFromDateOfBirthday(DOB).toString(), 10);
    if (age < 18) {
      return 'Must be 18 and above';
    }
    if (age > 100) {
      return 'Invalid age';
    }

    return '';
  },

  validateBio(bio: string | undefined): string | null {
    if (!bio) {
      return 'Bio is required';
    }
    if ((bio?.length ?? 0) < 10) {
      return 'Bio must be more than 10 characters';
    }

    return '';
  },

  /**
   * Calculates the time elapsed since the given date and returns a human-readable string.
   *
   * @param {Date} date - The date to compare.
   * @param {boolean} [addAgo=false] - Whether to add the word 'ago' at the end.
   * @returns {string} - The human-readable time elapsed.
   */
  timeSince(date: Date | undefined | any, addAgo = false): string {
    if (!date) return '';

    // const now = new Date();
    // const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    // const intervals = [
    //   { name: 'year', value: 31_536_000 },
    //   { name: 'month', value: 2_592_000 },
    //   { name: 'day', value: 86_400 },
    //   { name: 'hour', value: 3600 },
    //   { name: 'minute', value: 60 },
    // ];

    // intervals.forEach(({ name, value }) => {
    //   const interval = seconds / value;
    //   if (interval >= 1) {
    //     const num = Math.floor(interval);
    //     return `${num} ${name}${num === 1 ? '' : 's'}${addAgo ? ' ago' : ''}`;
    //   }
    //   return '';
    // });

    // return 'Recently';
    const now: any = new Date();
    const seconds = Math.floor((now - date) / 1000);

    let interval = seconds / 31536000;

    if (interval > 1) {
      const num = Math.floor(interval);
      return `${num} year${num === 1 ? '' : 's'}${addAgo ? ' ago' : ''}`;
    }
    interval = seconds / 2592000;
    if (interval > 1) {
      const num = Math.floor(interval);
      return `${num} month${num === 1 ? '' : 's'}${addAgo ? ' ago' : ''}`;
    }
    interval = seconds / 86400;
    if (interval > 1) {
      const num = Math.floor(interval);
      return `${num} day${num === 1 ? '' : 's'}${addAgo ? ' ago' : ''}`;
    }
    interval = seconds / 3600;
    if (interval > 1) {
      const num = Math.floor(interval);
      return `${num} hour${num === 1 ? '' : 's'}${addAgo ? ' ago' : ''}`;
    }
    interval = seconds / 60;
    if (interval > 1) {
      const num = Math.floor(interval);
      return `${num} minute${num === 1 ? '' : 's'}${addAgo ? ' ago' : ''}`;
    }

    return 'Recently'; //Math.floor(seconds) + " seconds";
  },

  sortByPricesValue(price: number, ratings: number, numberOfRents: number, epoch: number = Date.now()) {
    return (
      1 * price +
      1 /
        (Math.exp(0.5 * Math.log10(ratings)) +
          Math.exp(0.03 * Math.log10(numberOfRents)) +
          Math.exp(0.001 * Math.log10(epoch)))
    );
  },

  deleteAllServicesPricing(myServices: ServicesProps | null | undefined): { [key: string]: any } | undefined {
    // const myServices = user?.services
    if (myServices) {
      const map: { [key: string]: any } = {};
      const mainServices = Object.entries(myServices);

      mainServices.forEach(([serviceType, category]) => {
        const values = Object.entries(category);

        values.forEach(([id, value]) => {
          if (typeof value === 'string') return;
          const { price } = value;

          if (price) {
            map[`${servicesKey}.${serviceType}.${id}.${sortByPricingKey}`] = deleteField();
          }
        });
      });

      if (Object.keys(map).length > 0) {
        return map;
      }
      return undefined;
    }

    return undefined;
  },

  updateLowestHighestPricing(
    myServices: ServicesProps | null | undefined,
    ratings: number,
    numberOfRents: number,
    epoch: number = Date.now()
  ): { [key: string]: any } | undefined {
    if (myServices) {
      const map: { [key: string]: any } = {};
      const prices: number[] = [];
      const mainServices = Object.entries(myServices);
      mainServices.forEach(([serviceType, category]) => {
        const values = Object.values(category);
        const typePrices: number[] = [];

        values.forEach((value) => {
          if (typeof value === 'string') return;
          const { price } = value;

          if (price) {
            typePrices.push(price);
            prices.push(price);
          }
        });

        const min = Math.min(...typePrices);
        const max = Math.max(...typePrices);
        if (min) {
          map[`${sortByPricingKey}.${serviceType}.${lowestKey}`] = this.sortByPricesValue(
            min,
            ratings,
            numberOfRents,
            epoch
          );
        }

        if (max) {
          map[`${sortByPricingKey}.${serviceType}.${highestKey}`] = this.sortByPricesValue(
            max,
            ratings,
            numberOfRents,
            epoch
          );
        }
      });

      const min = Math.min(...prices);
      const max = Math.max(...prices);
      if (min) {
        map[`${sortByPricingKey}.${lowestKey}`] = this.sortByPricesValue(min, ratings, numberOfRents, epoch);
      }

      if (max) {
        map[`${sortByPricingKey}.${highestKey}`] = this.sortByPricesValue(max, ratings, numberOfRents, epoch);
      }

      if (Object.keys(map).length > 0) {
        return map;
      }
      return undefined;
    }

    return undefined;
  },

  updateAllServicesPricing(
    myServices: ServicesProps | null | undefined,
    ratings: number,
    numberOfRents: number,
    epoch: number = Date.now()
  ): { [key: string]: any } | undefined {
    if (myServices) {
      const map: { [key: string]: any } = {};
      const prices: number[] = [];
      const mainServices = Object.entries(myServices);
      mainServices.forEach(([serviceType, category]) => {
        const values = Object.entries(category);
        const typePrices: number[] = [];

        values.forEach(([id, value]) => {
          if (typeof value === 'string') return;
          const { price } = value;

          if (price) {
            map[`${servicesKey}.${serviceType}.${id}.${sortByPricingKey}`] = this.sortByPricesValue(
              price,
              ratings,
              numberOfRents,
              epoch
            );
            typePrices.push(price);
            prices.push(price);
          }
        });

        const min = Math.min(...typePrices);
        const max = Math.max(...typePrices);
        if (min) {
          map[`${sortByPricingKey}.${serviceType}.${lowestKey}`] = this.sortByPricesValue(
            min,
            ratings,
            numberOfRents,
            epoch
          );
        }

        if (max) {
          map[`${sortByPricingKey}.${serviceType}.${highestKey}`] = this.sortByPricesValue(
            max,
            ratings,
            numberOfRents,
            epoch
          );
        }
      });

      const min = Math.min(...prices);
      const max = Math.max(...prices);
      if (min) {
        map[`${sortByPricingKey}.${lowestKey}`] = this.sortByPricesValue(min, ratings, numberOfRents, epoch);
      }

      if (max) {
        map[`${sortByPricingKey}.${highestKey}`] = this.sortByPricesValue(max, ratings, numberOfRents, epoch);
      }

      if (Object.keys(map).length > 0) {
        return map;
      }
      return undefined;
    }

    return undefined;
  },

  getVideoURL(doc: QueryDocumentSnapshot<DocumentData> | DocumentSnapshot<DocumentData>) {
    const video2: { [key: string]: string } = doc.get(videoUrls2Key);

    let video2URL: string[] | undefined;

    if (video2) {
      Object.entries(video2).forEach(([key, value]) => {
        if (!video2URL) {
          video2URL = Array.from({ length: Object.keys(video2).length }).fill('') as string[];
        }
        video2URL[Number.parseInt(key, 10)] = value;
      });
    }

    let getVideoUrls: string[] = [];

    if (video2URL && video2URL.length === 1) {
      getVideoUrls.push(video2URL[0]);
      const remaining = (doc.get(videoUrlsKey) as string[]) ?? [];

      if (remaining.length === 2) {
        getVideoUrls.push(remaining[1]);
      }
    } else if (video2URL && video2URL.length === 2) {
      getVideoUrls = video2URL;
    } else {
      getVideoUrls = (doc.get(videoUrlsKey) as string[]) ?? [];
    }

    return getVideoUrls;
  },

  createItemFromDocument(doc: DocumentSnapshot<DocumentData> | null | undefined): Item | undefined {
    if (!doc) return undefined;

    const uid = doc.id;

    const isAdmin = doc.get(adminKey) as boolean;
    const isgAccessToken = doc.get(isgAccessTokenKey) as string;

    const availability = doc.get(availabilityLocalKey) as string;

    const race2 = doc.get(`${raceKey}2`) as { [key: string]: boolean } | undefined;
    const raceKeys = race2 ? Object.keys(race2).length > 0 : false;
    const raceK = race2 && raceKeys ? Object.keys(race2)[0] : Number.NaN;

    const race = this.raceEnumToName(Number.parseInt(raceK as string, 10)) ?? (doc.get(raceNameKey) as string);

    const food = doc.get(foodPrefLocalKey) as string;
    const videoVerification = doc.get(videoVerificationKey) as boolean;
    const createdAt = doc.get(createdAtKey) as Timestamp | undefined;

    const geoEncodings = doc.get(geoEncodingsKey) as string[];

    switch (geoEncodings?.[0]) {
      case 'Metro Manila': {
        geoEncodings.push('Phillipines');
        break;
      }
      case 'Jakarta': {
        geoEncodings.push('Indonesia');
        break;
      }
      case 'Kuala Lumpur':
      case 'Johor Bahru': {
        geoEncodings.push('Malaysia');
        break;
      }
      default: {
        break;
      }
    }

    const thisState = doc.get(stateKey) as string;

    const mobileUrl = doc.get(mobileUrlKey) as string;
    const urls = doc.get(urlsLocalKey) as string[];

    const vurls = this.getVideoURL(doc);

    const price = doc.get(priceLocalKey) as number;

    const gender = doc.get(genderKey) as GenderEnum;
    const nickname = doc.get(nicknameKey) as string;
    const bio = doc.get(bioLocalKey) as string;
    const drinks = doc.get(drinksKey) as string;

    const myPersonalHeight = doc.get(heightKey) as number;
    const isVaccinated = doc.get(vaccinatedKey) as number;
    const voiceUrl = doc.get(voiceUrlKey) as string;
    const dateOfBirth = doc.get(dateOfBirthKey) as Timestamp | undefined;
    const timeStamp = (doc.get(timeStampKey) as Timestamp) ?? (doc.get(privacyTimeStampKey) as Timestamp);

    const applyInfo = doc.get(additionalInfoKey) as string | undefined;
    const numberOfRents = (doc.get(numberOfRentsKey) as number) ?? 0;

    const isPrivate = ((doc.get(privacyLocalKey) as number) ?? 0) !== 0;

    const teleId = doc.get(teleIdKey) as string;
    const APNSToken = doc.get(APNSTokenKey) as APNSTokenProps;

    const currency = doc.get(currencyKey) as string;
    const choosen = (doc.get(choosenKey) as boolean) ?? false;

    let gonowBio: string | undefined;
    const gonowStart = doc.get(startKey) as Timestamp | undefined;
    const gonowEnd = doc.get(endKey) as Timestamp | undefined;
    const gonowComing = doc.get(comingFromKey) as string | undefined;
    const gonowService = doc.get(gonowServiceKey) as ServiceTypeEnum | undefined;

    const orientation = doc.get(orientationKey) as string[] | undefined;
    const services =
      (doc.get(servicesKey) as ServicesProps | undefined) ?? (doc.get(myServicesKey) as ServicesProps | undefined);
    const priceLimit = doc.get(priceLimitKey) as PriceLimitProps | undefined;
    const ratings = doc.get(ratingsKey) as StarProps;

    const club = doc.get(clubKey) as ClubProps | undefined;
    const clubName = club?.name;
    const clubState = club?.state;

    const free = this.amIFreeToday(gonowEnd);
    if (free && !applyInfo) {
      gonowBio = doc.get(gonowBioKey) as string | undefined;
    }

    const isGamer = doc.get(gamer) as boolean;
    const isOnline = doc.get(isOnlineKey) as boolean;
    const emeets = doc.get(emeetsKey) as EmeetsProps | undefined;

    return {
      type: PostTypeEnum.version0,
      admin: isAdmin,
      isGamer,
      userGender: gender,
      uid,
      nickname,
      bio,
      urls,
      video_urls: vurls,
      availability,
      race,
      price,
      drinks,
      time_stamp: timeStamp,
      visible: false,
      width: undefined,
      height: undefined,
      mHeight: myPersonalHeight,
      isgToken: isgAccessToken,
      age: Number.NaN,
      videoVerification,
      geoEncodings,
      food,
      state: thisState,
      voiceUrl,
      rec: undefined,
      dob: this.ageFromDateOfBirthday(dateOfBirth?.toDate()),
      mobileUrl,
      vac: isVaccinated,
      gonow_servce: gonowService ?? ServiceTypeEnum.meetup,
      gonow_bio: gonowBio,
      gonow_coming_from: gonowComing,
      start: gonowStart?.toDate(),
      end: gonowEnd?.toDate(),
      apply_info: applyInfo,
      isPrivate,
      nor: numberOfRents,
      teleId,
      APNSToken,
      active: timeStamp,
      currency,
      choosen,
      orientation,
      ratings,
      services,
      priceLimit,
      clubName,
      clubState,
      emeets,
      createdAt,
      isOnline,
    };
  },

  /**
   * Converts a raceEnum to its corresponding name.
   *
   * @param {RaceEnum | undefined} rEnum - The raceEnum value to convert.
   * @returns {string} The race name.
   */
  raceEnumToName(rEnum: RaceEnum | undefined): string {
    const raceMap: Record<RaceEnum, string> = {
      [RaceEnum.chinese]: 'Chinese',
      [RaceEnum.malay]: 'Malay',
      [RaceEnum.indian]: 'Indian',
      [RaceEnum.caucasian]: 'White / Caucasian',
      [RaceEnum.eurasian]: 'Eurasian',
      [RaceEnum.japan]: 'Korean / Japanese',
      [RaceEnum.korean]: 'Korean',
      [RaceEnum.viet]: 'Viet',
      [RaceEnum.black]: 'Black',
      [RaceEnum.mixed]: 'Mixed',
      [RaceEnum.asian]: 'Asian',
      [RaceEnum.others]: 'Others',
      [RaceEnum.all]: 'All',
    };

    return raceMap[rEnum || RaceEnum.others];
  },

  /**
   * Store a key-value pair to local storage.
   *
   * @param {string} key - The key under which the value is stored in local storage.
   * @param {string | null} value - The value to be stored. If null, nothing is stored.
   */
  storeToLocal(key: string, value: string | null | undefined) {
    if (value) {
      localStorage.setItem(key, value);
    }
  },

  /**
   * Redirects to a specified path with optional query parameters.
   *
   * @param {string} path - The path to which the user will be redirected.
   * @param {Record<string, string | number>} [query = {}] - The query parameters to be added to the URL.
   */
  redirectTo(path: string, query: Record<string, string | number> = {}) {
    let queryString = '';

    Object.entries(query).forEach(([key, value]) => {
      if (queryString === '') {
        queryString = `?${key}=${value}`;
      } else {
        queryString += `&${key}=${value}`;
      }
    });

    window.location.href = `${path}${queryString}`;
  },
};
