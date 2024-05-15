import React, { useState, createContext,useEffect } from 'react';
import { ChildContainerProps, MenuContextProps } from '@/types';
import { useRouter } from 'next/navigation';

export const MenuContext = createContext({} as MenuContextProps);

export const MenuProvider = ({ children }: ChildContainerProps) => {
    const [activeMenu, setActiveMenu] = useState('');
    
    const router = useRouter();
    useEffect(() => {
        const account = localStorage.getItem('account');
        if (!account) {
          router.push('/auth/login');
        }
      }, []);
    const value = {
        activeMenu,
        setActiveMenu
    };
    
    return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
};
