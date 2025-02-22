import { useEffect, useRef } from 'react';

export const usePolling = (callback, interval = 3000, dependencies = []) => {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    const tick = () => savedCallback.current();
    const id = setInterval(tick, interval);
    
    tick();
    
    return () => clearInterval(id);
  }, [interval, ...dependencies]);
};