/*
 * Copyright (c) 2024. 
 * @49nhn 
 */

import { createContext } from 'react';

export interface AuthContextProps {
    rolePermission: string[];
}

export const AuthContext = createContext<AuthContextProps>({
    rolePermission: [''],
});

export const AuthProvider = AuthContext.Provider;
export const AuthConsumer = AuthContext.Consumer;

