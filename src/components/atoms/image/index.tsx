'use client';
import React, { memo, useState } from 'react';
import Image, { ImageProps } from 'next/image';
import { SkeletonCardView } from '@/components/page/Rent/components/SkeletonCardView';

interface IImage extends ImageProps {
  src: string | any;
  alt: string;
  skeletonRadius?: number | string;
}

// eslint-disable-next-line react/display-name
const NextImage = memo(({ src, alt, skeletonRadius, ...props }: IImage) => {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {loading && <SkeletonCardView radius={skeletonRadius} />}
      {src && (
        <Image
          src={src}
          alt={alt}
          onLoad={() => {
            setLoading(false);
          }}
          {...props}
        />
      )}
    </>
  );
});

export default NextImage;
