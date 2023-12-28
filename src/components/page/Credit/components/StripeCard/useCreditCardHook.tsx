import { functions } from '@/credentials/firebase';
import { PayByEnum } from '@/enum/myEnum';
import { useUserStore } from '@/store/reducers/usersReducer';
import { Helper } from '@/utility/helper';
import { useMediaQuery } from '@mui/material';
import { useStripe } from '@stripe/react-stripe-js';
import { httpsCallable } from 'firebase/functions';
import { useRouter } from 'next/navigation';
// import { useSearchParams } from 'next/navigation';
import { ChangeEvent, useState } from 'react';

interface promoMap {
  [key: string]: {
    [amt: string]: number;
  };
}
interface ICreditCard {
  functionName: string;
  promoMapState: promoMap | undefined;
}
const useCreditCardHook = ({ functionName, promoMapState }: ICreditCard) => {
  const router = useRouter();
  const rechargeData = [
    {
      credit: 4,
      price: 384.1,
      amount: 250,
    },
    {
      credit: 4,
      price: 384.1,
      amount: 250,
    },
    {
      credit: 4,
      price: 384.1,
      amount: 250,
    },
    {
      credit: 4,
      price: 384.1,
      amount: 250,
    },
    {
      credit: 4,
      price: 384.1,
      amount: 250,
    },
    {
      credit: 4,
      price: 384.1,
      amount: 250,
    },
  ];
  const isMobile = useMediaQuery('(max-width:600px)');
  const funnel = Helper?.getQueryStringValue('funnel');

  const stripe = useStripe();

  const [activeRechargePlan, setActiveRechargePlan] = useState(0);
  const [check, setCheck] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [pay, setPay] = useState<string>(PayByEnum.paynow);
  const [amount, setAmount] = useState<number>(0);
  const userStore = useUserStore();
  const currentUser = userStore?.currentUser;
  const isPremium = currentUser?.isPremium ?? false;
  const uid = currentUser?.uid ?? '';

  const onClickRechargeCard = (index: number) => {
    setActiveRechargePlan(index);

    setAmount(promoMapState?.[index]?.amt || 0);
  };

  if (amount === 0 && promoMapState) {
    setAmount(promoMapState?.['0']?.amt || 0);
  }

  const onPayChange = (value: string) => {
    setPay(value);
  };
  const onChangeCheck = (event: ChangeEvent<HTMLInputElement>, checked: boolean) => {
    setCheck(checked);
  };

  const buyCredits = async () => {
    setLoading(true);

    try {
      const map: { [key: string]: any } = {
        payBy: pay,
        origin: `${window?.location?.origin}`,
        // origin: `https://rb-dev-819c4.web.app/`,
        index: activeRechargePlan,
        amount: amount,
        funnel: funnel,
        isPremium,
      };

      if (!functionName) {
        // setOpen(true);
        // return;
      }
      // stripeBuyCredit2
      // stripeBuyCreditNONPremV2
      // stripeBuyCredit
      // stripeBuyCreditNONPrem
      const stripeBuyCredit = httpsCallable(functions, 'stripeBuyCredit');

      const res = await stripeBuyCredit(map);

      const data = res?.data as {
        status: number;
        sessionId: string;
      };
      const { status, sessionId } = data;

      if (status === 200) {
        const result = await stripe?.redirectToCheckout({ sessionId });

        if (result?.error) {
          // handle checkout error
          // setOpen(true);
        }
      } else {
        console.log('stripeBuyCredit ==>', res?.data);

        // setOpen(true);
      }
    } catch (error) {
      console.log('Get Credit Error => ', error);

      //   setOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const goToPremium = () => {
    router.push(`/subscribe?uid=${uid}`);
  };

  return {
    isMobile,
    isPremium,
    pay,
    rechargeData,
    activeRechargePlan,
    check,
    loading,
    currentUser,
    onClickRechargeCard,
    onPayChange,
    onChangeCheck,
    buyCredits,
    goToPremium,
  };
};

export default useCreditCardHook;
