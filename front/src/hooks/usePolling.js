import { useEffect, useRef } from 'react';

const usePolling = (callback, interval) => {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!interval) return;
    
    const poll = async () => {
      try {
        await savedCallback.current();
      } catch (error) {
        console.error('Polling error:', error);
      }
    };

    poll();
    const id = setInterval(poll, interval);
    
    return () => clearInterval(id);
  }, [interval]);
};

export default usePolling;