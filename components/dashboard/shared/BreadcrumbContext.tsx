"use client";
import { createContext, useContext, useState, useCallback, ReactNode } from "react";

type Overrides = Record<string, string>;

const BreadcrumbContext = createContext<{
	overrides: Overrides;
	setLabel: (segment: string, label: string) => void;
}>({ overrides: {}, setLabel: () => { } });

export function BreadcrumbProvider({ children }: { children: ReactNode }) {
	const [overrides, setOverrides] = useState<Overrides>({});

	// useCallback ensures setLabel is stable across renders — no infinite loops
	const setLabel = useCallback((segment: string, label: string) => {
		setOverrides((prev) => {
			if (prev[segment] === label) return prev; // bail out if unchanged
			return { ...prev, [segment]: label };
		});
	}, []);

	return (
		<BreadcrumbContext.Provider value={{ overrides, setLabel }}>
			{children}
		</BreadcrumbContext.Provider>
	);
}

export const useBreadcrumbContext = () => useContext(BreadcrumbContext);