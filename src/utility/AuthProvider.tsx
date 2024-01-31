'use client';
import useOnlineStatus from '@/hooks/useOnlineStatus';
import { useUserStore } from '@/store/reducers/usersReducer';
import { useRouter } from 'next/navigation';

const AuthProvider = ({ pathName, children }: { pathName: string; children: React.ReactNode }) => {
  useOnlineStatus();
  const userStore = useUserStore();
  const router = useRouter();
  const currentUser = userStore?.currentUser;
  const uid = currentUser?.uid;
  let newPath = pathName;

  if (
    pathName?.includes('/en') ||
    pathName?.includes('/es') ||
    pathName?.includes('/zh') ||
    pathName?.includes('/in') ||
    pathName?.includes('/th')
  ) {
    const lang = pathName?.split('/')[1];
    newPath = pathName?.split(`/${lang}`)[1] || '/';
  }

  if (['/faq', '/terms', '/contact', '/rent'].includes(newPath)) {
    return children;
  }

  if (!uid && !['/login', '/'].includes(newPath) && !newPath?.includes('profile')) {
    router.push('/login');
    return;
  } else if (uid && ['/login']?.includes(newPath)) {
    router.push('/');
    return;
  }

  return children;
};

export default AuthProvider;
