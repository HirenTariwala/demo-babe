import { ServiceDetailProps, ServicesProps, ServiceTypeEnum } from '../props/servicesProps';
import { serviceTypeStorageLocalKey } from '../keys/localStorageKeys';
import { UnitsEnum } from '../enum/myEnum';
// import { temp } from '@/common/utils/data';
// import MealsIcon from '@/components/atoms/icons/meals';
// import EmeetIcon from '@/components/atoms/icons/emeet-icon';
// import GlassesIcon from '@/components/atoms/icons/glasses';
// import RemoteIcon from '@/components/atoms/icons/gameremote';
// import GlitterIcon from '@/components/atoms/icons/glitters';

export type UnitType = '15Min' | '1Hr' | 'Game';

export const ServiceHelper = {
  /**
   * Get the type and category of the cheapest service.
   *
   * @param {number} cheapest - The cheapest service cost
   * @param {ServicesProps | undefined} services - The services object
   * @returns {[string, string]} - A tuple containing the type and category of the cheapest service
   */
  getCheapestService(cheapest: number, services: ServicesProps | undefined): [string, string] {
    if (!cheapest || !services) return ['', ''];

    let cheapestServiceType = '';
    let cheapestCategory: string | ServiceDetailProps = '';

    Object.entries(services).forEach(([, categories]) => {
      const foundCategory = Object.entries(categories).find(
        ([, details]) => typeof details === 'object' && details.sbyprt === cheapest
      );

      if (foundCategory) [cheapestServiceType, cheapestCategory] = foundCategory;
    });

    return [cheapestServiceType, cheapestCategory];
  },

  /**
   * Scrolls to a specific service based on the provided parameters.
   *
   * @param {HTMLElement} elementToScroll - The HTML element to scroll.
   * @param {ServicesProps} services - The services object.
   * @param {ServiceTypeEnum} serviceType - The service type to scroll to.
   * @param {string} serviceId - The service ID to scroll to.
   */
  scrollToService(
    elementToScroll: HTMLElement,
    services: ServicesProps,
    serviceType: ServiceTypeEnum,
    serviceId: string
  ) {
    if (!services || !serviceType || !serviceId) return;

    let index = -1;

    Object.entries(services).some(([thisCategory, thisKey]) => {
      if (thisCategory !== `${serviceType}`) return false;

      index = Object.values(thisKey).findIndex((value) => {
        const id = typeof value === 'string' ? value : value.id ?? '';
        return id === serviceId;
      });

      return index !== -1;
    });

    if (index === -1) return;

    const targetElement = elementToScroll.firstChild?.firstChild?.childNodes[index] as HTMLDivElement;
    // eslint-disable-next-line no-param-reassign
    if (targetElement) elementToScroll.scrollLeft = targetElement.offsetLeft;
  },

  /**
   * Checks if a service type has non-string service details.
   *
   * @param {ServicesProps | undefined} services - The services object.
   * @param {ServiceTypeEnum | undefined} serviceType - The service type to check.
   * @returns {boolean} - Returns true if the service type has non-string service details, false otherwise.
   */
  hasServiceType(services: ServicesProps | undefined, serviceType: ServiceTypeEnum | undefined): boolean {
    if (!services || serviceType === undefined) {
      return false;
    }

    const serviceDetails = services[serviceType];
    if (!serviceDetails) {
      return false;
    }

    return Object.values(serviceDetails).some((thisValue) => typeof thisValue !== 'string');
  },

  /**
   * Retrieves the default service type based on the given services.
   * @param {ServicesProps | undefined} services - The services to evaluate.
   * @returns {ServiceTypeEnum} The default service type.
   */
  getDefaultType(services?: ServicesProps): ServiceTypeEnum {
    if (!services) return ServiceTypeEnum.meetup;

    const numOfServices = this.getNumberOfServices(services);

    if (numOfServices === 1) return this.getFirstServiceType(services);

    if (numOfServices > 1) {
      const item = localStorage.getItem(serviceTypeStorageLocalKey);
      const parsedItem = item === null ? -1 : Number.parseInt(item, 10);
      const prefer = parsedItem as ServiceTypeEnum;

      return this.hasServiceType(services, prefer) ? prefer : this.getFirstServiceType(services);
    }

    return ServiceTypeEnum.meetup;
  },

  /**
   * Retrieves the default unit suffix based on the given service type.
   * @param {ServiceTypeEnum | undefined} serviceType - The service type to evaluate.
   * @returns {UnitsEnum | undefined} The default unit suffix.
   */
  getDefaultSuffix(serviceType?: ServiceTypeEnum): UnitsEnum | undefined {
    switch (serviceType) {
      case ServiceTypeEnum.meetup:
      case ServiceTypeEnum.sports: {
        return UnitsEnum.hr;
      }
      case ServiceTypeEnum.eMeet: {
        return UnitsEnum.min;
      }
      case ServiceTypeEnum.games: {
        return UnitsEnum.game;
      }
      default: {
        return undefined;
      }
    }
  },

  /**
   * Converts the given units to their respective unit types.
   * @param {UnitsEnum | undefined} units - The units to convert.
   * @returns {UnitType} The converted unit type.
   */
  convertUnits(units?: UnitsEnum): UnitType {
    switch (units) {
      case UnitsEnum.hr: {
        return '1Hr';
      }
      case UnitsEnum.min: {
        return '15Min';
      }
      case UnitsEnum.game: {
        return 'Game';
      }
      default: {
        return '15Min'; // Default to '15Min' if units are undefined or not recognized
      }
    }
  },

  /**
   * Creates default services with given price and bio.
   * @param {number | undefined} price - The price for the service.
   * @param {string | undefined} bio - The bio for the service.
   * @returns {ServicesProps | undefined} The default services or undefined.
   */
  createDefault(price?: number, bio?: string): ServicesProps | undefined {
    if (!price || !bio) return undefined;

    const services: ServicesProps = {
      [ServiceTypeEnum.meetup]: {
        0: {
          id: '0',
          title: 'Meals',
          description: 'Dinner, lunch or breakfast together',
          image: `https://${process.env.NEXT_PUBLIC_IMAGE_PREFIX}/IMAGES/SERVICES/MEETUP/meals.jpg?`,
          price: price * 100,
          bio,
          suffix: UnitsEnum.hr,
        },
        id: '0',
      },
    };

    return services;
  },

  getServiceSuffix(id: string): string {
    if (id === '0') return '1Hr';
    if (id === '1') return '15Min';
    return '1Hr';
  },

  /**
   * Get the number of services in the services object.
   * @param {ServicesProps | undefined} services - The services object.
   * @returns {number} The number of services.
   */
  getNumberOfServices(services?: ServicesProps): number {
    if (!services) return 0;

    let counter = 0;

    // Using Array.some to break out of the loop when the condition is met
    Object.values(services).some((value) =>
      Object.values(value).some((detail) => {
        if (typeof detail !== 'string' && Object.values(detail).length > 0) {
          counter += 1;
          return true; // Break the loop
        }
        return false;
      })
    );

    return counter;
  },

  /**
   * Get the first service detail from the services object.
   * @param {ServicesProps | undefined} services - The services object.
   * @returns {ServiceDetailProps | undefined} The first service detail or undefined.
   */
  getFirstServiceDetail(services?: ServicesProps): ServiceDetailProps | undefined {
    if (!services) return undefined;

    const firstKey = Object.keys(services)[0];

    if (firstKey) {
      const firstDetail = Object.values(services[firstKey])[0];
      return typeof firstDetail === 'string' ? undefined : firstDetail;
    }

    return undefined;
  },

  /**
   * Gets the type of the first available service.
   * @param services - The services object containing details of each service
   * @returns {ServiceTypeEnum} - Returns the type of the first available service,
   * or ServiceType.meetup if none is available
   */
  getFirstServiceType(services: ServicesProps | undefined): ServiceTypeEnum {
    // Return default service type if no services object is provided
    if (!services) {
      return ServiceTypeEnum.meetup;
    }

    const firstService = Object.entries(services).find(([, details]) => {
      // Clone details and remove the id field
      const detailsWithoutID = { ...details };
      delete detailsWithoutID.id;

      // Check if any other fields are present in the details
      return Object.values(detailsWithoutID).length > 0;
    });

    if (firstService) {
      return Number.parseInt(firstService[0], 10);
    }

    // Return default service type if no suitable service is found
    return ServiceTypeEnum.meetup;
  },

  /**
   * Gets the suffix of the first available service.
   * @param services - The services object containing details of each service
   * @returns {string} - Returns the suffix of the first available service,
   * or '1Hr' if none is available
   */
  getFirstServiceSuffix(services: ServicesProps | undefined): string {
    if (!services) return '1Hr';

    const firstServiceKey = Object.keys(services)[0];
    if (firstServiceKey) {
      return this.getServiceSuffix(firstServiceKey);
    }

    return '1Hr';
  },

  /**
   * Get the first service detail of a specific type.
   *
   * @param {ServicesProps | undefined} services - The services object.
   * @param {ServiceTypeEnum | undefined} whichService - The type of service.
   * @returns {ServiceDetailProps | undefined} - The first service detail of the specified type.
   */
  getFirstDetailByType(
    services: ServicesProps | undefined,
    whichService: ServiceTypeEnum | undefined
  ): ServiceDetailProps | undefined {
    if (!services || !whichService) {
      return undefined;
    }

    const details = services[whichService];

    if (!details) {
      return undefined;
    }

    const detailArray = Object.values(details);

    let firstNonStringDetail: ServiceDetailProps | undefined;

    detailArray.some((detail) => {
      if (typeof detail !== 'string') {
        firstNonStringDetail = detail;
        return true; // Stop iteration once a non-string detail is found.
      }
      return false;
    });

    return firstNonStringDetail;
  },

  /**
   * Get the price of a specific service by its type and ID.
   *
   * @param {ServicesProps | undefined} services - The services object.
   * @param {ServiceTypeEnum} serviceType - The type of service.
   * @param {number} id - The ID of the service.
   * @returns {number | undefined} - The price of the service, or undefined if not found.
   */
  getServicePriceById(
    services: ServicesProps | undefined,
    serviceType: ServiceTypeEnum,
    id: number
  ): number | undefined {
    if (!services) {
      return undefined;
    }

    const serviceDetails = services[serviceType]?.[id] as ServiceDetailProps | undefined;

    return serviceDetails?.price;
  },

  /**
   * Get the price of the first service of a specific type.
   *
   * @param {ServicesProps | undefined} services - The services object.
   * @param {ServiceTypeEnum} serviceType - The type of service.
   * @returns {number | undefined} - The price of the first service, or undefined if not found.
   */
  getFirstServicePriceByType(services: ServicesProps | undefined, serviceType: ServiceTypeEnum): number | undefined {
    if (!services || !services[serviceType]) {
      return undefined;
    }

    const firstServiceDetails = Object.values(services[serviceType])[0] as ServiceDetailProps | undefined;

    return firstServiceDetails?.price;
  },

  /**
   * Get the price of the first service found in the services object.
   *
   * @param {ServicesProps | undefined} services - The services object.
   * @returns {number | undefined} - The price of the first service, or undefined if not found.
   */
  getFirstServicePrice(services: ServicesProps | undefined): number | undefined {
    if (!services) {
      return undefined;
    }

    const firstService = Object.values(services)
      .flatMap((value) => Object.values(value))
      .find((thisValue) => {
        const v = thisValue as ServiceDetailProps;
        return typeof v.price === 'number';
      });

    return firstService ? (firstService as ServiceDetailProps).price : undefined;
  },

  /**
   * Get the bio of the first service found in the services object.
   *
   * @param {ServicesProps | undefined} services - The services object.
   * @returns {string | undefined} - The bio of the first service, or undefined if not found.
   */
  getFirstServiceBio(services: ServicesProps | undefined): string | undefined {
    if (!services) {
      return undefined;
    }

    const bio = Object.values(services)
      .flatMap((value) => Object.values(value))
      .map((thisValue) => {
        const v = thisValue as ServiceDetailProps;
        return v.bio;
      })
      .find((v) => v !== undefined);

    return bio ?? undefined;
  },

  /**
   * Get the minimum price among all services.
   *
   * @param {ServicesProps | undefined} services - The services object.
   * @returns {number | undefined} - The minimum price, or undefined if no valid price is found.
   */
  getMinPrice(services: ServicesProps | undefined): number | undefined {
    if (!services) {
      return undefined;
    }

    const prices: number[] = [];

    Object.values(services).forEach((serviceTypeDetails) => {
      Object.values(serviceTypeDetails).forEach((serviceDetail) => {
        const v = serviceDetail as ServiceDetailProps;
        if (v.price && v.price >= 1) {
          prices.push(v.price);
        }
      });
    });

    if (prices.length === 0) {
      return undefined;
    }

    return Math.min(...prices);
  },
  /**
   * Get the maximum price among all services.
   *
   * @param {ServicesProps | undefined} services - The services object.
   * @returns {number | undefined} - The maximum price, or undefined if no valid price is found.
   */
  getMaxPrice(services: ServicesProps | undefined): number | undefined {
    if (!services) {
      return undefined;
    }

    const prices: number[] = [];

    Object.values(services).forEach((serviceTypeDetails) => {
      Object.values(serviceTypeDetails).forEach((serviceDetail) => {
        const v = serviceDetail as ServiceDetailProps;
        if (v.price && v.price >= 1) {
          prices.push(v.price);
        }
      });
    });

    if (prices.length === 0) {
      return undefined;
    }

    return Math.max(...prices);
  },

  /**
   * Get the minimum price among all services.
   *
   * @param {ServicesProps | undefined} services - The services object.
   * @returns {string[]}
   */
  getServices(
    services: ServicesProps | undefined,
    category?: string,
    categoryTitle?: string,
    favouritesV2?: any,
    allServicesArr?: ServiceDetailProps[]
  ): { alt: string; src: string | undefined }[] | undefined {
    if (!services || !allServicesArr || allServicesArr?.length == 0) {
      return undefined;
    }
    let serviceArr: string[] = [];

    if (category) {
      serviceArr = [categoryTitle || ''];
      // serviceArr = Object.values(services?.[category])?.filter(e=> e?.id == category)?.map(e=> e?.title)
    } else {
      // serviceArr = Object.values(services).map((item: any) => (Object.values(item)?.[0] as ServiceDetailProps)?.title);
      serviceArr = [];
      Object.values(services).forEach((item: any) => {
        Object.values(item)?.forEach((e: any) => {
          if(e?.title) {
            serviceArr.push(e?.title);
          }
        })
      })
    }

    if (serviceArr?.length == 0) {
      return undefined;
    }

    const data = serviceArr?.map((item) => {
      const singleService = allServicesArr?.find((ser) => ser?.title === item);
      return {
        alt: '',
        src: singleService?.image,
      };
    });

    return data;
  },
};
