import * as React from 'react';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@/components/atoms/typography';
import Button from '@/components/atoms/button';
import { useEffect, useState } from 'react';
import Input from '@/components/atoms/input';
import { IBox } from '@/components/atoms/box';

type TImage = {
  name: string;
  imageString: string;
};

interface IFileUpload extends IBox {}

const FileUpload = ({ ...props }: IFileUpload) => {
  const [progress, setProgress] = React.useState(0);
  const [image, setImage] = useState<TImage>({ name: '', imageString: '' });
  const [uploading, setUploading] = useState(false);
  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setUploading(true);
      const reader = new FileReader();
      reader.onload = (e: any) => {
        setImage({ imageString: e.target.result as string, name: file.name });
      };
      reader.readAsDataURL(file);
    }
  };

  const increaseValue = () => {
    if (progress < 100) {
      setProgress((prevValue) => prevValue + 10);
    }
  };

  useEffect(() => {
    if (uploading) {
      const intervalId = setInterval(increaseValue, 1000); // Increase value every 1 second

      return () => {
        clearInterval(intervalId);
      };
    }
  }, [progress, uploading]);

  return (
    <Box bgcolor="#F0F0F0" maxWidth={552} p={3} borderRadius={6} minWidth={287}>
      <Box display="flex" alignItems="center" gap={3} {...props}>
        <Box
          sx={{
            background: '#FFF',
            display: 'flex',
            alignItems: 'center',
            p: 2,
            borderRadius: 12,
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M4.27209 20.7279L10.8686 14.1314C11.2646 13.7354 11.4627 13.5373 11.691 13.4632C11.8918 13.3979 12.1082 13.3979 12.309 13.4632C12.5373 13.5373 12.7354 13.7354 13.1314 14.1314L19.6839 20.6839M14 15L16.8686 12.1314C17.2646 11.7354 17.4627 11.5373 17.691 11.4632C17.8918 11.3979 18.1082 11.3979 18.309 11.4632C18.5373 11.5373 18.7354 11.7354 19.1314 12.1314L22 15M10 9C10 10.1046 9.10457 11 8 11C6.89543 11 6 10.1046 6 9C6 7.89543 6.89543 7 8 7C9.10457 7 10 7.89543 10 9ZM6.8 21H17.2C18.8802 21 19.7202 21 20.362 20.673C20.9265 20.3854 21.3854 19.9265 21.673 19.362C22 18.7202 22 17.8802 22 16.2V7.8C22 6.11984 22 5.27976 21.673 4.63803C21.3854 4.07354 20.9265 3.6146 20.362 3.32698C19.7202 3 18.8802 3 17.2 3H6.8C5.11984 3 4.27976 3 3.63803 3.32698C3.07354 3.6146 2.6146 4.07354 2.32698 4.63803C2 5.27976 2 6.11984 2 7.8V16.2C2 17.8802 2 18.7202 2.32698 19.362C2.6146 19.9265 3.07354 20.3854 3.63803 20.673C4.27976 21 5.11984 21 6.8 21Z"
              stroke="#1A1A1A"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Box>
        <Box display="flex" flexWrap="wrap" gap={3}>
          <Box display="flex" flexDirection="column" alignItems="flex-start" gap={2}>
            <Typography variant="subtitle2" component="span" fontWeight={500}>
              {image.name}
            </Typography>
            {uploading && (
              <Box width={289}>
                <LinearProgress variant="determinate" value={progress} sx={{ bgcolor: '#FFF', borderRadius: 16 }} />
              </Box>
            )}
          </Box>
          <Button variant="text" component="label" sx={{ p: '6px 16px', width: 'fit-content', fontSize: 14 }}>
            Choose another file
            <Input
              type="file"
              id="fileElem"
              inputProps={{ accept: 'image/*' }}
              onChange={handleFiles}
              sx={{ display: 'none' }}
            />
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default FileUpload;
