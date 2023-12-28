'use client';
import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import useSubscribeHook from './useSubscribeHook';
import SubscribeForm from './SubscribeForm';

const Subscribe = () => {
  const { stripePromise } = useSubscribeHook();
  // 'stripeBuyCreditNONPremV2'
  return (
    <Elements stripe={stripePromise}>
      <SubscribeForm />
    </Elements>
  );
};

export default Subscribe;
