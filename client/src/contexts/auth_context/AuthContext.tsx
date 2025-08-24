import React, { createContext, useState, useEffect, type ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import type { AuthContextType } from '../../types/auth/AuthContext';
import type { AuthUser } from '../../types/auth/AuthUser';
import type { JwtTokenClaims } from '../../types/auth/JwtTokenClaims';
import { DeleteValueByKey, ReadValueByKey, SaveValueByKey } from '../../helpers/local_storage';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper funkcija za dekodiranje JWT tokena
const decodeJWT = (token: string): JwtTokenClaims | null => {
    try {
        const decoded = jwtDecode<JwtTokenClaims>(token);

        // Proveri da li token ima potrebna polja
        if (decoded.id && decoded.username && decoded.role) {
            return {
                id: decoded.id,
                username: decoded.username,
                role: decoded.role
            };
        }

        return null;
    } catch (error) {
        console.error('Error while decoding JWT token:', error);
        return null;
    }
};

// Helper funkcija za proveru da li je token istekao
const isTokenExpired = (token: string): boolean => {
    try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        return decoded.exp ? decoded.exp < currentTime : false;
    } catch {
        return true;
    }
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Učitaj token iz localStorage pri pokretanju
    useEffect(() => {
        const savedToken = localStorage.getItem("authToken");
        const savedUser = localStorage.getItem("authUser");

        if (savedToken && savedUser) {
            setToken(savedToken);
            setUser(JSON.parse(savedUser));
        }

        setIsLoading(false);

        /*const savedToken = ReadValueByKey("authToken");
        const savedUser = localStorage.getItem("authUser");

        if (savedToken && savedUser) {
            // Proveri da li je token istekao
            if (isTokenExpired(savedToken)) {
                DeleteValueByKey("authToken");
                setIsLoading(false);
                return;
            }
            
            const claims = decodeJWT(savedToken);
            if (claims) {
                setToken(savedToken);
                setUser({
                    id: claims.id,
                    username: claims.username,
                    role: claims.role
                });
            } else {
                DeleteValueByKey("authToken");
            }
        }
        
        setIsLoading(false);*/
    }, []);
    const login = (user: AuthUser, token: string) => {
        setUser(user);
        setToken(token);
        localStorage.setItem("authToken", token);
        localStorage.setItem("authUser", JSON.stringify(user));
    };

    /*const login = (newToken: string) => {
        const claims = decodeJWT(newToken);

        if (claims && !isTokenExpired(newToken)) {
            setToken(newToken);
            setUser({
                id: claims.id,
                username: claims.username,
                role: claims.role
            });
            SaveValueByKey("authToken", newToken);
        } else {
            console.error('Invalid or expired token');
        }
    };*/

    /*const logout = () => {
        setToken(null);
        setUser(null);
        DeleteValueByKey("authToken");
    };*/
    const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
  };

    //const isAuthenticated = !!user && !!token;

    /*const value: AuthContextType = {
        user,
        token,
        login,
        logout,
        isAuthenticated,
        isLoading
    };*/

    /*return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );*/

    return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated: !!token,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;