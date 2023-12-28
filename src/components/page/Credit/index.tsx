'use client';
import React from 'react';
import useCreditHook from './useCreditHook';
import { Elements } from '@stripe/react-stripe-js';
import CreditCard from './components/StripeCard/CreditCard';

const Credit = () => {
  const { stripePromise, functionName, promoMapState } = useCreditHook();
  // 'stripeBuyCreditNONPremV2'
  return (
    <Elements stripe={stripePromise}>
      <CreditCard functionName={functionName} promoMapState={promoMapState} />
    </Elements>
  );
};

export default Credit;
