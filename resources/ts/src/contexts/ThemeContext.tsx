import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";

export const THEME_STORAGE_KEY = "household-accounting-theme";

type ThemeContextValue = {
    isDarkMode: boolean;
    setIsDarkMode: (value: boolean) => void;
    toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const getInitialDarkMode = () => {
    if (typeof window === "undefined") {
        return true;
    }

    const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);

    if (savedTheme === "light") {
        return false;
    }

    if (savedTheme === "dark") {
        return true;
    }

    return document.documentElement.classList.contains("dark");
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [isDarkMode, setIsDarkMode] = useState<boolean>(() =>
        getInitialDarkMode(),
    );

    useEffect(() => {
        document.documentElement.classList.toggle("dark", isDarkMode);
        window.localStorage.setItem(
            THEME_STORAGE_KEY,
            isDarkMode ? "dark" : "light",
        );
    }, [isDarkMode]);

    return (
        <ThemeContext.Provider
            value={{
                isDarkMode,
                setIsDarkMode,
                toggleTheme: () => setIsDarkMode((prev) => !prev),
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);

    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }

    return context;
};
