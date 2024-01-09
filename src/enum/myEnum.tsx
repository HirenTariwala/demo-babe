export enum OrientationEnum {
  straight = 'Straight',
  gay = 'Gay',
  lesbian = 'Lesbian',
  bisexual = 'Bisexual',
  asexual = 'Asexual',
  demisexual = 'Demisexual',
  hemoflexible = 'Hemoflexible',
  heteroflexible = 'Heteroflexible',
  pansexual = 'Pansexual',
  queer = 'Queer',
  questioning = 'Questioning',
  grayAsexual = 'Gray-asexual',
  reciprosexual = 'Reciprosexual',
  akiosexual = 'Akiosexual',
  aceflux = 'Aceflux',
  grayromantic = 'Grayromantic',
  demiromantic = 'Demiromantic',
  recipromantic = 'Recipromantic',
  akioromantic = 'Akioromantic',
  aroflux = 'Aroflux',
}

export enum PostTypeEnum {
  version0 = 0,
  normal = 1,
  topten = 2,
  suggested = 3,
  places = 4,
  gonow = 5,
  privateProfile = 6,
  dummy = 7,
  skeleton = 8,
}

export enum ProfileEnum {
  public = 0,
  private = 1,
  emeet = 2,
  gamer = 3,
}

export enum meetupEnum {
  meals,
  hiking,
  dining,
  drinks,
  photoshoot,
  gathering,
  movies,
  sports,
}

export enum RaceEnum {
  chinese = 0,
  malay = 1,
  indian = 2,
  caucasian = 3,
  eurasian = 4,
  japan = 6,
  korean = 5,
  viet = 12,
  black = 13,
  mixed = 14,
  asian = 15,
  others = 99,
  all = 999,
}

export enum GenderEnum {
  female = 0,
  male = 1,
}

export enum DrinksEnum {
  sure = 'Sure',
  social = 'Social',
  nope = 'Nope',
  all = 'All',
}

export enum PriceRangeEnum {
  lowest = 0,
  highest = Number.POSITIVE_INFINITY,
}

export enum MessageEnum {
  text = 0,
  requestReview = 1,
  payRequest = 2,
  warning = 3,
  paid = 4,
  order = 5,
}

export enum option {
  pending, accept, reject, paid
}

export enum NewMessageEnum {
  checkAvailability,
  directMessage,
}

export enum PayByEnum {
  paynow = 'paynow',
  grabpay = 'grabpay',
  card = 'card',
}

export enum RBACEnum {
  admin = 'admin',
  babe = 'babe',
  user = 'user',
}

export enum UnitsEnum {
  min,
  hr,
  game,
}

export enum OperatorEnum {
  either,
  both,
}

export enum ChannelsEnum {
  GLOBAL_SG = 0,
  KL_ONLY = 1,
}

export enum SortByEnum {
  RECENTLY,
  HIGHEST_RATINGS,
  LOWEST_PRICE,
  HIGHEST_PRICE,
}

export enum CancelOrRejectEnum {
  CANCEL,
  REJECT,
}

export enum ReviewStateEnum {
  noRepliesYet,
  goingToReply,
  replied,
}
