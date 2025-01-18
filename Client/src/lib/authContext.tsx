"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface AuthContextType {
	isSignedIn: boolean;
	setIsSignedIn: (isSignedIn: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [isSignedIn, setIsSignedIn] = useState<boolean>(false);

	useEffect(() => {
		const token = localStorage.getItem("accessToken");
		if (token) {
			setIsSignedIn(true);
		}
	}, []);

	const value = React.useMemo(() => ({ isSignedIn, setIsSignedIn }), [isSignedIn, setIsSignedIn]);

	return (
		<AuthContext.Provider value={value}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};
