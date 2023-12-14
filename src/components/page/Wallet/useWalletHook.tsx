import Badge from '@/components/atoms/badge';
import useRentHook from '../Rent/useRentHook';
import TransactionTabContent from './components/TransactionTabContent';
import { useMemo, useState } from 'react';
import Box from '@/components/atoms/box';
import Button from '@/components/atoms/button';

interface ITabs {
  type: string;
  badge: number;
}
const useWalletHook = () => {
  const { isMobile } = useRentHook();
  const [activeCard, setActiveCard] = useState(0);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  const types: ITabs[] = useMemo(() => {
    if (activeCard === 0) {
      return [
        {
          type: 'All',
          badge: 6,
        },
        {
          type: 'Spent',
          badge: 2,
        },
        {
          type: 'Bundle Recharge',
          badge: 2,
        },
        {
          type: 'Custom Recharge',
          badge: 2,
        },
      ];
    } else if (activeCard === 1) {
      return [
        {
          type: 'All',
          badge: 4,
        },
        {
          type: 'Withdrawn',
          badge: 2,
        },
        {
          type: 'Moved from Pending',
          badge: 2,
        },
      ];
    } else {
      return [
        {
          type: 'All',
          badge: 4,
        },
        {
          type: 'Refunded',
          badge: 2,
        },
        {
          type: 'Earned',
          badge: 2,
        },
      ];
    }
    return tabs;
  }, [activeCard]);

  const WithdrawnFooter = (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'flex-end',
      }}
    >
      <Button
        color="primary"
        onClick={() => {}}
        size="medium"
        startIcon={null}
        sx={{
          borderRadius: 50,
          fontSize: '16px',
          fontWeight: 700,
          padding: '12px 20px',
          textTransform: 'none',
        }}
        variant="outlined"
      >
        Cancel
      </Button>
      <Button
        color="primary"
        onClick={() => {}}
        size="medium"
        startIcon={null}
        sx={{
          borderRadius: 50,
          fontSize: '16px',
          fontWeight: 700,
          padding: '12px 20px',
          textTransform: 'none',
        }}
        variant="contained"
      >
        {/* eslint-disable-next-line no-constant-condition */}
        {false ? 'Withdraw' : 'Done'}
      </Button>
    </Box>
  );

  const tabs = types?.map((item, index) => ({
    lable: (
      <span
        style={{
          display: 'flex',
          gap: '20px',
          alignItems: 'center',
        }}
      >
        <span>{item?.type}</span>
        <span>
          <Badge badgeContent={item?.badge} color="primary" />,
        </span>
      </span>
    ),
    content: <TransactionTabContent index={index} />,
  }));

  const onCardClick = (index: number) => {
    setActiveCard(index);
  };
  return { isMobile, activeCard, tabs, WithdrawnFooter, onCardClick };
};

export default useWalletHook;
