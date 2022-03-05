import React, { useContext, useState } from "react";
import {
  LightTheme,
  DarkTheme,
  ThemeProvider as BaseThemeProvider,
} from "baseui";

type THEME = "dark" | "light";

interface IThemeContextValue {
  theme: THEME;
  changeTheme: (theme: THEME) => void;
}

const defaultValues: IThemeContextValue = {
  theme: "light",
  changeTheme: () => {},
};

export const ThemeContext = React.createContext(defaultValues);

const ThemeProvider: React.FC<{ theme: THEME }> = (props) => {
  const [theme, setTheme] = useState<THEME>(props.theme);
  const changeTheme = setTheme;
  return (
    <ThemeContext.Provider value={{ theme, changeTheme }}>
      <BaseThemeProvider theme={theme === "light" ? LightTheme : DarkTheme}>
        {props.children}
      </BaseThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

export default ThemeProvider;
