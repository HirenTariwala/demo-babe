import Box from '@/components/atoms/box';
import Chip from '@/components/atoms/chip';
import Typography from '@/components/atoms/typography';
import styles from '../rent.module.css';
// import Image from 'next/image';
import NextImage from '@/components/atoms/image';

interface ITabChip {
  icon?: string;
  label: string | undefined;
  isActive?: boolean;
  onClick: () => void;
}

const TabChip = ({ icon, label, isActive, ...props }: ITabChip) => {
  return (
    <span>
      <Chip
        {...props}
        icon={
          <Box className={`${styles.tabChipIcon} ${isActive ? styles.activeTabChipIcon : ''}`}>
            <NextImage
              src={icon||""}
              alt=""
              width={22}
              height={22}
              style={{
                borderRadius: '100px',
              }}
            />
          </Box>
        }
        label={
          <Typography variant="subtitle1" color="#1A1A1A">
            {label}
          </Typography>
        }
        className={`${styles.tabChipItem} ${isActive ? styles.activeChip : ''}`}
        sx={{
          '.MuiChip-label': {
            paddingRight: '0px',
            paddingLeft: '0px',
          },
        }}
      />
    </span>
  );
};

export default TabChip;
