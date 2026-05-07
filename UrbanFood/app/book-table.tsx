import { ROUTES } from '@/src/constants/navigation';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';

export default function BookTable() {
  const router = useRouter();

  useEffect(() => {
    router.replace(ROUTES.DINE_IN);
  }, []);

  return null;
}
