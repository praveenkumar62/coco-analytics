import { createContext, useContext, useState } from "react";

const UserContext = createContext(undefined);

export const UserProvider = ({children}) => {
  const storedUser = JSON.parse(localStorage.getItem('coco-auth')) || {
    token: '',
    id: '',
    name: '',
    email: '',
  };
  const [userInfo, setUserInfo] = useState(storedUser);

  return (
    <UserContext.Provider value={{ userInfo, setUserInfo }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUserInfo = () => {
  const context = useContext(UserContext);
  if(!context)
    throw new Error('Usercontext must be wrapped with provider');
  return context;
}