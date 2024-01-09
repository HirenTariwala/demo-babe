import Box from '@/components/atoms/box';
import EmeetIcon from '@/components/atoms/icons/emeetIcon';
import FireIcon from '@/components/atoms/icons/fire';
import RemoteIcon from '@/components/atoms/icons/gameremote';
import GlassesIcon from '@/components/atoms/icons/glasses';
import GlitterIcon from '@/components/atoms/icons/glitters';
import KaraokeIcon from '@/components/atoms/icons/karaokeIcon';
import ChinaLangIcon from '@/components/atoms/icons/language/china';
import EnLangIcon from '@/components/atoms/icons/language/en';
import IndoLangIcon from '@/components/atoms/icons/language/indo';
import SpainLangIcon from '@/components/atoms/icons/language/spain';
import ThaiLangIcon from '@/components/atoms/icons/language/thai';
import MealsIcon from '@/components/atoms/icons/meals';
import MobileLegendsIcon from '@/components/atoms/icons/mobileLegendsIcon';
import ProfileIcon from '@/components/atoms/icons/profile';
import Typography from '@/components/atoms/typography';

export const data = [
  {
    lable: 'table',
    content: 'Content1',
  },
  {
    lable: 'chair',
    content: 'Content2',
  },
  {
    lable: 'sofa',
    content: 'Content3',
  },
  {
    lable: 'light',
    content: 'Content4',
  },
  {
    lable: 'table',
    content: 'Content5',
  },
  {
    lable: 'table',
    content: 'Content6',
  },
  {
    lable: 'table',
    content: 'Content7',
  },
  {
    lable: 'table',
    content: 'Content8',
  },
];

export const dummy = [
  {
    text: (
      <Typography variant="subtitle2" component="span" fontWeight={500}>
        Share
      </Typography>
    ),
    id: 1,
  },
  {
    text: (
      <Typography variant="subtitle2" component="span" fontWeight={500} color="error">
        Report
      </Typography>
    ),
    id: 2,
  },
];

export const avatarData = [
  { alt: 'H', src: <EmeetIcon /> },
  { alt: 'V', src: <MealsIcon /> },
  { alt: 'C', src: <GlassesIcon /> },
  { alt: 'X', src: <GlitterIcon /> },
  { alt: 'E', src: <RemoteIcon /> },
  { alt: 'B', src: 'B' },
  { alt: 'Z', src: 'Z' },
];

export const temp: any = {
  "Meals": { alt: 'V', src: <MealsIcon /> },
  'E-Meet': { alt: 'H', src: <EmeetIcon /> },
  "Drinks": { alt: 'E', src: <GlassesIcon /> },
  'Mobile Legends: Bang Bang': { alt: 'E', src: <RemoteIcon /> },
  'Emotional support': { alt: 'C', src: `https://${process.env.NEXT_PUBLIC_IMAGE_PREFIX}/IMAGES/SERVICES/EMEET/support.jpg?` },
  'Brawl Stars': { alt: 'V', src: `https://${process.env.NEXT_PUBLIC_IMAGE_PREFIX}/IMAGES/SERVICES/GAMES/brawl.jpg?` },
  'League of Legends': { alt: 'V', src: <RemoteIcon /> },
  // "Karaoke": { alt: 'K', src: `https://${process.env.NEXT_PUBLIC_IMAGE_PREFIX}/IMAGES/SERVICES/EMEET/karaoke.jpg?` },
  "Karaoke": { alt: 'K', src: <KaraokeIcon /> },
  'Fine Dining': { alt: 'D', src: <GlitterIcon /> },
};

export const marks = [
  {
    value: 0,
    label: '0',
  },
  {
    value: 20,
    label: '20',
  },
  {
    value: 37,
    label: '37',
  },
  {
    value: 100,
    label: '100',
  },
];

export const cardData = {
  name: 'Zynx',
  status: true,
  verfied: true,
  social: 'https://instagram.com/',
  profilePic:
    'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?cs=srgb&dl=pexels-pixabay-220453.jpg&fm=jpg',
  activity: avatarData,
  voiceTag: '',
  rating: {
    rating: 4.9,
    count: 100,
  },
  priceLabel: { min: 110, max: 250, hr: 1 },
};

export const accdata = [
  {
    label: 'Lorem ipsum dolor met?',
    summary:
      'SummaryLorem ipsum dolor sit amet consectetur. Nisi sit adipiscing morbi eget a velit faucibus. Turpis maecenas facilisis blandit et lectus urna ut. Senectus rhoncus egestas duis integer quis quis pellentesque pulvinar. Volutpat viverra tempor commodo ante laoreet aliquam elit convallis urna. Luctus dui sed blandit porttitor. Elementum auctor orci ac tempor quisque neque mauris faucibus semper. Porttitor id ac fusce pretium.',
  },
  {
    label: 'Lorem ipsum dolor met 1?',
    summary:
      'SummaryLorem ipsum dolor sit amet consectetur. Nisi sit adipiscing morbi eget a velit faucibus. Turpis maecenas facilisis blandit et lectus urna ut. Senectus rhoncus egestas duis integer quis quis pellentesque pulvinar. Volutpat viverra tempor commodo ante laoreet aliquam elit convallis urna. Luctus dui sed blandit porttitor. Elementum auctor orci ac tempor quisque neque mauris faucibus semper. Porttitor id ac fusce pretium.',
  },
  {
    label: 'Lorem ipsum dolor met 23ndfvsn?',
    summary:
      'SummaryLorem ipsum dolor sit amet consectetur. Nisi sit adipiscing morbi eget a velit faucibus. Turpis maecenas facilisis blandit et lectus urna ut. Senectus rhoncus egestas duis integer quis quis pellentesque pulvinar. Volutpat viverra tempor commodo ante laoreet aliquam elit convallis urna. Luctus dui sed blandit porttitor. Elementum auctor orci ac tempor quisque neque mauris faucibus semper. Porttitor id ac fusce pretium.',
  },
];

export const emeetOrder = {
  rating: {
    rating: 4.9,
    count: 100,
  },

  priceLabel: { min: 110, max: 250, hr: 1 },
};

export const transactionInfo = {
  time: 'Sep 12, 9:41 AM',
  status: 'Bundled Recharge',
  transactionID: 123456788,
  amount: 340,
};

export const transactionStatusInfo = {
  time: 'Sep 12, 9:41 AM',
  status: 'cancelled',
  transactionID: 123456788,
  amount: 340,
  profilePic: <ProfileIcon />,
  remainingTime: '',
  name: 'limblake',
};

const labelComp = (icon: any, text: string) => {
  return (
    <Box display="flex" alignItems="center" gap={2}>
      {icon}
      <Typography>{text}</Typography>
    </Box>
  );
};
export const languageData = [
  {
    value: 'en',
    label: labelComp(<EnLangIcon />, 'EN'),
  },
  {
    value: 'es',
    label: labelComp(<SpainLangIcon />, 'Español'),
  },
  {
    value: 'zh',
    label: labelComp(<ChinaLangIcon />, '中文'),
  },
  {
    value: 'in',
    label: labelComp(<IndoLangIcon />, 'INDO'),
  },
  {
    value: 'th',
    label: labelComp(<ThaiLangIcon />, 'ภาษาไทย'),
  },
];

export const termsImage = "https://images.rentbabe.com/TERMS/termsv2.png"
export const FBLogo = "https://images.rentbabe.com/assets/fb_logo.svg"
export const ISGBlackLogo = "https://images.rentbabe.com/assets/insta_logo_black.svg"
export const TiktokLogo = "https://images.rentbabe.com/assets/tiktok.svg"
export const TelegramLogo = "https://images.rentbabe.com/assets/app/telegram.svg"
export const WhatsAppLogo = "https://images.rentbabe.com/assets/app/whatsapp.svg"
export const DiscordAppLogo = "https://images.rentbabe.com/assets/app/discord.svg"
export const ViberAppLogo = "https://images.rentbabe.com/assets/app/viber.svg"
export const LineAppLogo = "https://images.rentbabe.com/assets/app/line.svg"
export const WechatAppLogo = "https://images.rentbabe.com/assets/app/wechat.svg"
export const KakaotalkAppLogo = "https://images.rentbabe.com/assets/app/kakaotalk.svg"

export const mediaLinks = [
  'https://www.youtube.com/embed/Hj4HWnXe8vk',
  'https://www.youtube.com/embed/8IwThm4Fizo',
  'https://www.youtube.com/embed/z7dQzkKrXTk',
  'https://www.youtube.com/embed/9Nug7n1CuRs',
  'https://www.youtube.com/embed/Fp0ykAVyulk',
  'https://www.youtube.com/embed/afkr_fLi3tE',
  'https://www.facebook.com/plugins/video.php?height=314&href=https%3A%2F%2Fwww.facebook.com%2Fdoubleupsg%2Fvideos%2F598883757878310%2F&show_text=false&width=560&t=0',
  'https://www.youtube.com/embed/WYplgVAxMv4',
  'https://www.youtube.com/embed/T-qRwQ5D0e0',
  'https://www.youtube.com/embed/cSz4m15Y0sc',
  'https://www.youtube.com/embed/_FZb1mFdPoI',
  'https://www.youtube.com/embed/kDMV7scaLvk',
];

export const tabsData = [
  {
    content: 'Content1',
    lable: 'Meet up',
  },
  {
    content: 'Content2',
    lable: 'E-Meet',
  },
  {
    content: 'Content3',
    lable: 'Games',
  },
  {
    content: 'Content4',
    lable: 'Sports',
  },
];

export const serviceIcon = {
  0: <MealsIcon />,
  1: <EmeetIcon />,
  2: <RemoteIcon />,
  3: <GlitterIcon />,
};

export const CountryLookUpTable: { [country: string] : string } = {
  Singapore: 'sg',
  Philippines: 'ph',
  'Metro Manila': 'ph',
  Jakarta: 'id',
  Indonesia: 'id',
  India: 'in',
  Malaysia: 'my',
  USA: 'us',
  Netherlands: 'nl',
  Canada: 'ca',
  Germany: 'de',
  Brazil: 'br',
  'South Africa': 'za',
  'Timor-Leste': 'tl',
  Macaristan: 'hu',
  Hungary: 'hu',
  'United Kingdom': 'uk',
  Portugal: 'pt',
  Serbia: 'rs',
  Colombia: 'co',
  'South Korea': 'kr',
};


export const tabs = [
  {
    icon: <FireIcon />,
    label: 'For you',
  },
  {
    icon: <RemoteIcon />,
    label: 'Games',
  },
  {
    icon: <EmeetIcon />,
    label: 'E-Meet',
  },
  {
    icon: <MealsIcon />,
    label: 'Meals',
  },
  {
    icon: <GlassesIcon />,
    label: 'Drinks',
  },
  {
    icon: <GlitterIcon />,
    label: 'Relationship Advice',
  },
  {
    icon: <MobileLegendsIcon />,
    label: 'Mobile Legends: Bang Bang',
  },
];
