import { useColorScheme } from '@mantine/hooks';
import { createContext, useState, useContext } from 'react';
import { SettingsLocalStorage } from '../components/Settings';
import { SettingContext, SettingContextValues } from './SettingContext';

export interface ThemeContextValues {
   changeTheme: (to: ThemeSelection) => void;
   themeName: ThemeSelection;
   theme: Themes;
   toggleScrollLock: () => void;
   changeScrollLock: (to: boolean) => void;
   scrollLock: boolean;
}

export const ThemeContext = createContext<ThemeContextValues | null>(null);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
   const { editSettings, settings } = useContext(SettingContext) as SettingContextValues;

   const [scrollLock, setScrollLock] = useState<boolean>(false);
   const [theme, setTheme] = useState<Themes>(new SettingsLocalStorage().get()?.actualTheme ?? 'dark');
   const [themeName, setThemeName] = useState<ThemeSelection>(new SettingsLocalStorage().get()?.theme ?? 'dark');
   const colorScheme = useColorScheme();

   const changeTheme = (to: ThemeSelection) => {
      if (to === 'system') {
         setTheme(colorScheme);
         setThemeName('system');
         editSettings({ ...settings, theme: 'system', actualTheme: colorScheme });
         return;
      }

      editSettings({ ...settings, theme: to, actualTheme: to });
      setTheme(to);
      setThemeName(to);
   };

   const changeScrollLock = (to: boolean) => {
      setScrollLock(to);
   };

   const toggleScrollLock = () => {
      setScrollLock((prev) => prev);
   };

   return (
      <ThemeContext.Provider value={{ changeTheme, theme, themeName, toggleScrollLock, changeScrollLock, scrollLock }}>
         <div className={`mount ${theme}`} style={{ overflow: scrollLock ? 'hidden' : 'visible' }}>
            {children}
         </div>
      </ThemeContext.Provider>
   );
};
