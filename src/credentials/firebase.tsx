import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
// import { getAnalytics } from 'firebase/analytics';
import { getFunctions } from 'firebase/functions';

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID,
};

// export const firebaseApp = initializeApp(config);
export const app = initializeApp(firebaseConfig);
// export const storage = getStorage(firebaseApp);
export const storage = getStorage(app);
export const db = getFirestore(app);
export const auth = getAuth(app);
// export const analytics = getAnalytics(app);
// export const analytics = getAnalytics(firebaseApp);
export const functions = getFunctions(app);
// export const functions = getFunctions(firebaseApp);
