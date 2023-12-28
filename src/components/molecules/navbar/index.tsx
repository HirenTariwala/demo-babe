import Box from '@/components/atoms/box';
import Typography from '@/components/atoms/typography';
import Link from 'next/link';
import React from 'react';

const activeLinkStyle = {
  textDecoration: 'none',
  color: '#1A1A1A',
  borderBottom: '2px solid #1A1A1A',
};

type TNav = {
    path: string;
    name: string;
}

const NavBar = ({ pathName, nav }: { pathName: string; nav: TNav[] }) => {
  return (
    <Box display="flex" gap={8}>
      {nav.map((item: TNav, index: number) => (
        <Link
          key={index}
          href={item.path}
          shallow
          style={item.path === pathName ? activeLinkStyle : { textDecoration: 'none', color: '#1A1A1A' }}
        >
          <Typography variant="h4" component="span" fontWeight={500}>
            {item.name}
          </Typography>
        </Link>
      ))}
    </Box>
  );
};

export default NavBar;
