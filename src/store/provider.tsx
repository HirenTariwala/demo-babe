'use client';
import { PersistGate } from 'redux-persist/integration/react';
import store, { persistor } from './index';
import { Provider } from 'react-redux';
// import LoadingIcon from '@/components/atoms/icons/loading';
// import Box from '@/components/atoms/box';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate
        persistor={persistor}
        // loading={
        // 	<Box width={'100%'} height={'100vh'} display={'flex'} justifyContent={'center'} alignItems={'center'}>
        // 		<LoadingIcon />
        // 	</Box>
        // }
      >
        {children}
      </PersistGate>
    </Provider>
  );
}
