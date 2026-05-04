import { useRouter } from 'expo-router';
import { useEffect } from 'react';

export default function BookTable() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dine-in');
  }, []);

  return null;
}
