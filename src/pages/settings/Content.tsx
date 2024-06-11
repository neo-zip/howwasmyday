import React, { useContext } from 'react';
import { ThemeContext, ThemeContextValues } from '../../context/ThemeContext';
import { Page } from './Settings';
import { SettingContext, SettingContextValues } from '../../context/SettingContext';
import Data from './Data';
import Account from './Account';

interface Props {
   page: Page;
}

const Content: React.FC<Props> = ({ page }) => {
   const { changeTheme, themeName } = useContext(ThemeContext) as ThemeContextValues;
   const { editSettings, settings } = useContext(SettingContext) as SettingContextValues;

   return (
      <div className='right solid'>
         <div className='inner'>
            <h2 className='space-s'>{page}</h2>
            {page === 'Whats new' && (
               <>
                  <p className='suggestion'>Everything</p>
                  <hr className='space-l' />
                  <h2>Whats to come?</h2>
                  <p className='suggestion'>Light theme revamp</p>
                  <p className='suggestion'>Image/File upload for notes</p>
                  <p className='suggestion'>Markdown for notes</p>
                  <p className='suggestion'>Optimization</p>
                  <p className='suggestion'>Overlay revamp</p>
                  <p className='suggestion'>Actual Suggestions</p>
                  <p className='suggestion'>Customization</p>
                  <p className='suggestion'>Time of day</p>
                  <p className='suggestion'>Language</p>
                  <p className='suggestion'>More accessibility</p>
                  <p className='suggestion'>UI updates</p>
                  <p className='suggestion'>UI revamp for mobile</p>
                  <p className='suggestion'>Day view revamp</p>
                  <p className='suggestion'>Account system revamp</p>
                  <p className='suggestion'>More colors & branded</p>
                  <p className='suggestion'>Reset of API calls each day or a cooldown instead</p>
                  <p className='suggestion'>More colors & branded</p>
                  <p className='suggestion'>Legal update</p>
                  <p className='suggestion'>Background images / gradients</p>
                  <p className='suggestion'>Fix rendering issues with calendar</p>
                  <p className='suggestion'>Mobile settings</p>
                  <p className='suggestion'>Settings save in account</p>
                  <p className='suggestion'>Form submission revamp</p>
                  <p className='suggestion'>Ads (Don't worry, they wont be annoying)</p>
                  <hr className='space-s' />
                  <p className='label'>
                     {import.meta.env.VITE_APP_STATE} {import.meta.env.VITE_APP_VERSION}
                  </p>
               </>
            )}
            {page === 'Appearance' && (
               <>
                  <div className='selection flex-gap'>
                     <button
                        className={`btn ${themeName === 'dark' && 'active'}`}
                        onClick={() => {
                           changeTheme('dark');
                        }}>
                        Dark
                     </button>
                     <button className={`btn ${themeName === 'light' && 'active'}`} onClick={() => changeTheme('light')}>
                        Light
                     </button>
                     <button className={`btn ${themeName === 'system' && 'active'}`} onClick={() => changeTheme('system')}>
                        System
                     </button>
                  </div>
               </>
            )}
            {page === 'Calendar' && (
               <>
                  <label className='checkbox-outer'>
                     <input
                        type='checkbox'
                        className='checkbox'
                        defaultChecked={settings.numberCalendar}
                        onChange={(e) => editSettings({ ...settings, numberCalendar: e.target.checked })}
                     />
                     <p>Number Calendar</p>
                  </label>
               </>
            )}
            {page === 'Your Account' && <Account />}
            {page === 'Data' && <Data />}
         </div>
      </div>
   );
};

export default Content;
