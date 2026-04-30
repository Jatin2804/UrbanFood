import { useEffect, useState } from 'react';

/**
 * Custom hook to calculate time remaining for an order
 * @param estimatedTime - ISO string of estimated delivery time
 * @returns Object with minutes and seconds remaining, and formatted string
 */
export const useOrderTimer = (estimatedTime: string | undefined) => {
  const [timeLeft, setTimeLeft] = useState<{
    minutes: number;
    seconds: number;
    totalSeconds: number;
    formatted: string;
  }>({
    minutes: 0,
    seconds: 0,
    totalSeconds: 0,
    formatted: '0 mins',
  });

  useEffect(() => {
    if (!estimatedTime) {
      setTimeLeft({
        minutes: 0,
        seconds: 0,
        totalSeconds: 0,
        formatted: '0 mins',
      });
      return;
    }

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const estimated = new Date(estimatedTime).getTime();
      const difference = estimated - now;

      if (difference <= 0) {
        return {
          minutes: 0,
          seconds: 0,
          totalSeconds: 0,
          formatted: 'Arriving now',
        };
      }

      const totalSeconds = Math.floor(difference / 1000);
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;

      return {
        minutes,
        seconds,
        totalSeconds,
        formatted: minutes > 0 ? `${minutes} mins` : `${seconds} secs`,
      };
    };

    // Initial calculation
    setTimeLeft(calculateTimeLeft());

    // Update every second
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, [estimatedTime]);

  return timeLeft;
};
