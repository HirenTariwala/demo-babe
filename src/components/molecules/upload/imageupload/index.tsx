import Box, { IBox } from '@/components/atoms/box';
import Button from '@/components/atoms/button';
import NextImage from '@/components/atoms/image';
import Input from '@/components/atoms/input';
// import Image from 'next/image';
import React, { useState } from 'react';

interface IImageUpload extends IBox {}

const ImageUpload = ({ ...props }: IImageUpload) => {
  const [image, setImage] = useState<string | null>(null);
  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        setImage(e.target.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  return (
    <Box display="flex" alignItems="center" minWidth={311} maxWidth="552px" gap={4}>
      <Box {...props}>
        <Box borderRadius="50%">
          {image ? (
            <NextImage
              src={image}
              alt="Uploaded"
              style={{
                borderRadius: '50%',
                objectFit: 'cover',
              }}
              width={100}
              height={100}
            />
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100" fill="none">
              <circle cx="50" cy="50" r="50" fill="#F0F0F0" />
              <path
                d="M46.228 35.7273H52.2734L64.7734 68.1818H58.6825L55.6371 59.5909H42.6825L39.6371 68.1818H33.7734L46.228 35.7273ZM44.228 55.2727H54.1371L49.2734 41.3182H49.1371L44.228 55.2727Z"
                fill="#646464"
              />
            </svg>
          )}
        </Box>
      </Box>
      <Box display="flex" flexWrap="wrap" gap={2}>
        <Button
          variant="outlined"
          component="label"
          sx={{
            p: '8px 16px',
            fontSize: 14,
            border: '1px solid #CCC',
            width: 'fit-content',
          }}
        >
          {image ? 'Choose another photo' : 'Upload photo'}
          <Input
            hidden
            type="file"
            id="fileElem"
            inputProps={{ accept: 'image/*' }}
            onChange={handleFiles}
            sx={{ display: 'none' }}
          />
        </Button>
        {image && (
          <Button
            variant="outlined"
            component="label"
            sx={{
              p: '8px 16px',
              fontSize: 14,
              border: '1px solid #CCC',
              width: 'fit-content',
            }}
            onClick={() => setImage(null)}
          >
            Remove
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default ImageUpload;
