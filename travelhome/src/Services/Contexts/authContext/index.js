import React, { useContext, useState, useEffect } from "react";
import { auth } from "../firebase/firebase";
import { onAuthStateChanged, updateProfile } from "firebase/auth";

export const AuthContext = React.createContext();
export const useAuth = () => useContext(AuthContext);


export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [userLoggedIn, setUserLoggedIn] = useState(false);
    const [isEmailUser, setIsEmailUser] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, initializeUser);
        return unsubscribe;
    }, []);

    async function initializeUser(user) {
        if (user) {

            setCurrentUser({ ...user });

            // check if provider is email and password login
            const isEmail = user.providerData.some(
                (provider) => provider.providerId === "password"
            );
            setIsEmailUser(isEmail);

            setUserLoggedIn(true);
        } else {
            setCurrentUser(null);
            setUserLoggedIn(false);
        }

        setLoading(false);
    }

    async function updateDisplayName(displayName) {
        try {
            await updateProfile(auth.currentUser, { displayName });
            setCurrentUser((prevUser) => ({ ...prevUser, displayName }));
        } catch (error) {
            console.error("Error updating displayName:", error);
        }
    }

    const value = {
        userLoggedIn,
        isEmailUser,
        currentUser,
        setCurrentUser,
        updateDisplayName
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}