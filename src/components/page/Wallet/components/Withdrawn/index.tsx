import Dialog from '@/components/molecules/dialogs';
import React, { ReactNode } from 'react';

interface IFooter {
  WithdrawnFooter: ReactNode;
}

const Withdrawn = ({ WithdrawnFooter }: IFooter) => {
  return <Dialog open={false} footer={WithdrawnFooter}></Dialog>;
};

export default Withdrawn;
