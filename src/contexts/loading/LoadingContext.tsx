'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
} from 'react';

interface LoadingContextValue {
  isLoading: boolean;
  showLoading: () => void;
  hideLoading: () => void;
}

const LoadingContext = createContext<LoadingContextValue>({
  isLoading: false,
  showLoading: () => {},
  hideLoading: () => {},
});

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  // カウンター方式: 複数の呼び出しがあっても全部終わるまで表示し続ける
  const counter = useRef(0);

  const showLoading = useCallback(() => {
    counter.current += 1;
    setIsLoading(true);
  }, []);

  const hideLoading = useCallback(() => {
    counter.current = Math.max(0, counter.current - 1);
    if (counter.current === 0) {
      setIsLoading(false);
    }
  }, []);

  return (
    <LoadingContext.Provider value={{ isLoading, showLoading, hideLoading }}>
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  return useContext(LoadingContext);
}
