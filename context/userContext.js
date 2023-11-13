'use client'

import { createContext, useContext } from 'react';
import useUserData from '@/lib/useUserData'


export const UserContext = createContext({});

export function UserProvider({ children }) {
	const userData = useUserData();

	return <UserContext.Provider value={userData}>{children}</UserContext.Provider>
}

export const useUserContext = () => useContext(UserContext);
