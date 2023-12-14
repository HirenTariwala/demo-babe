import React from 'react';
import {
  AvatarGroup,
  AvatarGroupProps,
  Avatar as MuiAvatar,
} from '@mui/material';

interface IAvatar extends AvatarGroupProps {
  avatars: any;
}

const Avatar = ({ sx, avatars, ...props }: IAvatar) => {
  return (
    <AvatarGroup {...props}>
      {avatars &&
        avatars.length > 0 &&
        avatars.map((avatar: any, index: number) => (
          <MuiAvatar key={index} alt={avatar?.alt} src={avatar?.src} sx={sx}>
            {avatar?.src}
          </MuiAvatar>
        ))}
    </AvatarGroup>
  );
};

export default Avatar;
