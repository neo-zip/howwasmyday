import { createContext, useEffect, useState } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

export interface AuthContextValues {
   currentUser: User | null;
   userStatus: boolean | null;
}

export const AuthContext = createContext<AuthContextValues | null>(null);

export const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
   const [currentUser, setCurrentUser] = useState<User | null>(null);
   const [userStatus, setUserStatus] = useState<boolean | null>(null);

   useEffect(() => {
      const unsub = onAuthStateChanged(auth, (user) => {
         setCurrentUser(user);
         setUserStatus(!!user);
      });

      return () => unsub();
   }, []);

   return <AuthContext.Provider value={{ currentUser, userStatus }}>{children}</AuthContext.Provider>;
};
