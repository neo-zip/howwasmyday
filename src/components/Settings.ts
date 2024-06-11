const log = (...e: string[]) => {
   if (import.meta.env.DEV) {
      console.log('%cSETTINGS', 'background:#ee0200;color: #111;border-radius:5px;padding:0 5px;', ...e);
   }
};

export class SettingsLocalStorage {
   update = (to: Settings): boolean => {
      const settings = localStorage.getItem('settings');

      if (!settings) {
         log('Settings do not exist. Creating new.');
      }

      localStorage.setItem('settings', JSON.stringify(to));
      log(`updated settings`);
      return true;
   };

   clear = (): boolean => {
      localStorage.removeItem('settings');

      return true;
   };

   get = (): Settings | undefined => {
      const settings = localStorage.getItem('settings');

      if (!settings) {
         log('Could not get settings because they do not exist.');
         return undefined;
      }

      return JSON.parse(settings);
   };
}
