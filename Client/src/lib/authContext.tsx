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

//! Using map 

// interface DataContextType {
// 	data: Map<string, any>;
// 	setData: (key: string, value: any) => void;
// }

// const DataContext = createContext<DataContextType | undefined>(undefined);

// export const DataProvider: React.FC<{ children: React.ReactNode }> = ({
// 	children,
// }) => {
// 	const [dataState, setDataState] = useState<Map<string, any>>(new Map());

// 	const setData = (key: string, value: any) => {
// 		setDataState((prevData) => {
// 			const newData = new Map(prevData);
// 			newData.set(key, value);
// 			return newData;
// 		});
// 	};

// 	const value = React.useMemo(() => ({ data: dataState, setData }), [dataState]);

// 	return (
// 		<DataContext.Provider value={value}>
// 			{children}
// 		</DataContext.Provider>
// 	);
// };

// export const useData = () => {
// 	const context = useContext(DataContext);
// 	if (context === undefined) {
// 		throw new Error("useData must be used within a DataProvider");
// 	}
// 	return context;
// };

//! Using Object instead of Map

// interface DataContextType {
// 	data: Record<string, any>;
// 	setData: (key: string, value: any) => void;
// }

// const DataContext = createContext<DataContextType | undefined>(undefined);

// export const DataProvider: React.FC<{ children: React.ReactNode }> = ({
// 	children,
// }) => {
// 	const [dataState, setDataState] = useState<Record<string, any>>({});

// 	const setData = (key: string, value: any) => {
// 		setDataState((prevData) => ({ ...prevData, [key]: value }));
// 	};

// 	const value = React.useMemo(() => ({ data: dataState, setData }), [dataState]);

// 	return (
// 		<DataContext.Provider value={value}>
// 			{children}
// 		</DataContext.Provider>
// 	);
// };

// export const useData = () => {
// 	const context = useContext(DataContext);
// 	if (context === undefined) {
// 		throw new Error("useData must be used within a DataProvider");
// 	}
// 	return context;
// };