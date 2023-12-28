import { loadStripe } from '@stripe/stripe-js';
import { isTEST } from '@/keys/functionNames';

const useSubscribeHook = () => {
  const key = isTEST ? 'pk_test_Wy45sQqUs0fLxhB6Z87PfAUf' : 'pk_live_2MGVUBzqFSWgJgPK1G5sUXqv';
  const stripePromise = loadStripe(key);

  return { stripePromise };
};

export default useSubscribeHook;
