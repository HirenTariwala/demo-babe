import Box from '@/components/atoms/box';
import NextImage from '@/components/atoms/image';
import Typography from '@/components/atoms/typography';

interface IWarningBubble {
  index: number;
  msg: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const WarningBubble = ({ index, msg }: IWarningBubble) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        transform: 'scaleY(-1)',
      }}
    >
      <Box height={21} width={21}>
        <NextImage height={21} width={21} src="https://images.rentbabe.com/assets/mui/warning.svg" alt="" />
      </Box>

      <Typography sx={{ margin: '.5rem 1rem', maxWidth: 600 }} variant="body2" textAlign="center">
        {`${msg}`}
      </Typography>
    </Box>
  );
};

export default WarningBubble;
