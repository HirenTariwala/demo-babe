'use client';
import React, { memo, useEffect, useState } from 'react';
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

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 200);
  }, []);
  return (
    <>
      {(loading || !src) && <SkeletonCardView radius={skeletonRadius} />}

      {src && (
        <Image
          src={src}
          alt={alt}
          onLoadingComplete={() => {
            setLoading(false);
          }}
          {...props}
        />
      )}
    </>
  );
});

export default NextImage;
