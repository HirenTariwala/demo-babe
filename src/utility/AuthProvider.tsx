'use client';
import { useUserStore } from '@/store/reducers/usersReducer';
import { useRouter } from 'next/navigation';

const AuthProvider = ({ pathName, children }: { pathName: string; children: React.ReactNode }) => {
  const userStore = useUserStore();
  const router = useRouter();
  const currentUser = userStore?.currentUser;
  const uid = currentUser?.uid;

  if (['/faq', '/terms', '/contact', '/rent'].includes(pathName)) {
    return children;
  }
  if (!uid && !['/login', '/'].includes(pathName) && !pathName?.includes('profile')) {
    router.push('/login');
    return;
  } else if (uid && ['/login']?.includes(pathName)) {
    router.push('/');
    return;
  }
  return children;
};

export default AuthProvider;
