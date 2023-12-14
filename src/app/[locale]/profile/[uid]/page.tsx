import Box from '@/components/atoms/box';
import Profile from '@/components/page/Profile';

type PageProps = {
  params: {
    uid: string;
  };
};

const page = ({ params: { uid } }: PageProps) => {
  return (
    <Box display="flex" justifyContent="center">
      <Profile uid={uid} />
    </Box>
  );
};

export default page;
