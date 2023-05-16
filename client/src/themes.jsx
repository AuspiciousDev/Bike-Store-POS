import { createTheme } from "@mui/material/styles";
import "@fontsource/poppins";
import { createContext, useState, useMemo, useEffect } from "react";

export const tokens = (mode) => ({
  ...(mode === "dark"
    ? {
        primary: {
          100: "#a0c7e7",
          200: "#90bde3",
          300: "#81b4df",
          400: "#71aadb",
          500: "#61a1d7",
          600: "#61a1d7",
          700: "#5791c2",
          800: "#4e81ac",
          900: "#447197",
          950: "#01579b",
        },

        secondary: {
          100: "#f6cba1",
          200: "#f5c392",
          300: "#f3ba82",
          400: "#f2b273",
          500: "#f0a963",
          600: "#d89859",
          700: "#c0874f",
          800: "#a87645",
          900: "#90653b",
        },
        black: {
          50: "#ffffff",
          100: "#FBFBFB",
          200: "#cccccc",
          300: "#b2b2b2",
          400: "#999999",
          500: "#7f7f7f",
          600: "#666666",
          700: "#4c4c4c",
          800: "#333333",
          900: "#101010",
          950: "#000000",
        },
        whiteOnly: {
          500: "#ffffff",
        },
        blackOnly: {
          500: "#000000",
        },
        defaultColor: {
          500: "#01579b",
        },
        redDark: {
          500: "#EB455F",
        },
      }
    : {
        primary: {
          100: "#447197",
          200: "#4e81ac",
          300: "#5791c2",
          400: "#61a1d7",
          500: "#61a1d7",
          600: "#71aadb",
          700: "#81b4df",
          800: "#90bde3",
          900: "#a0c7e7",
          950: "#01579b",
        },

        secondary: {
          100: "#90653b",
          200: "#a87645",
          300: "#c0874f",
          400: "#d89859",
          500: "#f0a963",
          600: "#f2b273",
          700: "#f3ba82",
          800: "#f5c392",
          900: "#f6cba1",
        },
        black: {
          50: "#000000",
          100: "#191919",
          200: "#333333",
          300: "#4c4c4c",
          400: "#666666",
          500: "#7f7f7f",
          600: "#999999",
          700: "#b2b2b2",
          800: "#cccccc",
          900: "#F9F9F9",
          950: "#ffffff",
        },
        blackOnly: {
          500: "#000000",
        },
        whiteOnly: {
          500: "#ffffff",
        },
        defaultColor: {
          500: "#01579b",
        },
        redDark: {
          500: "#EB455F",
        },
      }),
});

// MUI theme Settings

export const themeSettings = (mode) => {
  const colors = tokens(mode);
  return {
    palette: {
      mode: mode,
      ...(mode === "dark"
        ? {
            primary: {
              main: colors.primary[500],
            },
            secondary: {
              main: colors.secondary[500],
            },
            neutral: {
              dark: colors.primary[100],
              main: colors.primary[100],
              light: colors.primary[100],
            },
            background: {
              default: colors.black[900],
            },
          }
        : {
            primary: {
              main: colors.primary[500],
            },
            secondary: {
              main: colors.secondary[500],
            },
            neutral: {
              dark: colors.primary[100],
              main: colors.primary[100],
              light: colors.primary[100],
            },
            background: {
              default: colors.black[950],
            },
          }),
    },
    typography: {
      fontFamily: ["Poppins", "sans-serif"].join(","),
      fontSize: 13,
      h1: {
        fontFamily: ["Poppins", "sans-serif"].join(","),
        fontSize: 40,
      },
      h2: {
        fontFamily: ["Poppins", "sans-serif"].join(","),
        fontSize: 32,
      },
      h3: {
        fontFamily: ["Poppins", "sans-serif"].join(","),
        fontSize: 24,
      },
      h4: {
        fontFamily: ["Poppins", "sans-serif"].join(","),
        fontSize: 20,
      },
      h5: {
        fontFamily: ["Poppins", "sans-serif"].join(","),
        fontSize: 16,
      },
      h6: {
        fontFamily: ["Poppins", "sans-serif"].join(","),
        fontSize: 14,
      },
    },
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 900,
        lg: 1200,
        xl: 1536,
      },
    },
  };
};

export const ColorModeContext = createContext({
  toggleColorMode: () => {},
});

export const useMode = () => {
  // const [mode, setMode] = useState("light");
  console.log("theme :", localStorage.getItem("theme"));
  const storage =
    localStorage.getItem("theme") !== "undefined"
      ? localStorage.theme
      : "light";

  const [storageTheme, setStorageTheme] = useState(storage);
  const [mode, setMode] = useState(storage);

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () =>
        setMode((prev) => (prev === "light" ? "dark" : "light")),
    }),
    []
  );
  useEffect(() => {
    localStorage.setItem("theme", mode);
    setStorageTheme(mode);
  }, [storageTheme, mode]);

  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  return [theme, colorMode];
};
