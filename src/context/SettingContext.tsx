import { createContext, useState, useEffect } from 'react';
import { useHotkeys } from '@mantine/hooks';
import { SettingsLocalStorage } from '../components/Settings';

export interface SettingContextValues {
   toggleSettings: () => void;
   changeSettingsOpen: (to: boolean) => void;
   editSettings: (to: Settings) => void;
   settingsOpen: boolean;
   settings: Settings;
}

export const SettingContext = createContext<SettingContextValues | null>(null);

export const SettingProvider = ({ children }: { children: React.ReactNode }) => {
   const settingsLS = new SettingsLocalStorage();

   const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
   const [settings, setSettings] = useState<Settings>(
      settingsLS.get() ?? {
         backgroundImg: null,
         numberCalendar: false,
         theme: 'dark',
         actualTheme: 'dark',
      }
   );

   useHotkeys([['ctrl+k', () => setSettingsOpen((prev) => !prev)]]);

   const changeSettingsOpen = (to: boolean) => {
      setSettingsOpen(to);
   };

   const toggleSettings = () => {
      setSettingsOpen((prev) => !prev);
   };

   const editSettings = (to: Settings) => {
      setSettings(to);
   };

   useEffect(() => {
      settingsLS.update(settings);
   }, [settings]);

   return (
      <SettingContext.Provider value={{ toggleSettings, changeSettingsOpen, editSettings, settingsOpen, settings }}>
         {children}
      </SettingContext.Provider>
   );
};
