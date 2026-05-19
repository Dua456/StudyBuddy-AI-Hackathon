import { useState, useEffect } from 'react';

export const useQuiz = (timeLimit) => {
  const [timeLeft, setTimeLeft] = useState(timeLimit || 0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  const start = () => setIsRunning(true);
  const stop = () => setIsRunning(false);
  const reset = (newTime) => {
    setTimeLeft(newTime || timeLimit);
    setIsRunning(false);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return { timeLeft, isRunning, start, stop, reset, formatTime };
};
