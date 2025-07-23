import { createContext, useContext, useState, type ReactNode } from 'react';

interface INoty {
  handleNoty: (message: string, type: string) => void;
}

const NotyContext = createContext<INoty | undefined>(undefined);

export const NotyProvider = ({ children }: { children: ReactNode }) => {
  const [noty, setNoty] = useState({
    message: '',
    type: '',
  });

  const handleNoty = (message: string, type: string) => {
    setNoty({
      message,
      type,
    });
    setTimeout(() => {
        setNoty({ message: '', type: '' })
    }, 3000)
  };

  let cs = 'bg-green-100 border-green-700 text-green-700';
  if (noty.type === 'error') {
    cs = 'bg-red-100 border-red-700 text-red-700';
  }

  return (
    <NotyContext.Provider value={{ handleNoty }}>
      {noty?.message && (
        <div className={`fixed right-0 top-1 p-2 z-[1000] rounded-s w-64 border ${cs}`}>
          {noty?.message}
        </div>
      )}
      {children}
    </NotyContext.Provider>
  );
};

export const useNotyBlock = () => {
  const context = useContext(NotyContext);
  if (!context) {
    throw new Error('Context must be wrapped with provider');
  }
  return context;
};
