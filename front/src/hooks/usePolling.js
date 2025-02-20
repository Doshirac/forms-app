import { useEffect, useRef } from 'react';

const usePolling = (callback, delay = []) => {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) return;
    
    const poll = async () => {
      await savedCallback.current();
    };

    const id = setInterval(poll, delay);
    return () => clearInterval(id);
  }, [delay]);
};

export default usePolling;