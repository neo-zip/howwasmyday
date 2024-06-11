import React, { useContext, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { SettingContext, SettingContextValues } from '../../context/SettingContext';
import { useViewportSize } from '@mantine/hooks';
import { Tooltip } from '@mantine/core';
import Controls from './Controls';
import Content from './Content';
import './Settings.css';

export type Page = 'Data' | 'Appearance' | 'Calendar' | 'Your Account' | 'Whats new';

const Settings: React.FC = () => {
   const { settingsOpen, toggleSettings } = useContext(SettingContext) as SettingContextValues;
   const [currentPage, setCurrentPage] = useState<Page>('Appearance');
   const { width } = useViewportSize();

   const changeCurrentPage = (to: Page) => {
      setCurrentPage(to);
   };

   return (
      <AnimatePresence>
         {settingsOpen && (
            <motion.div
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className='overlay settings center'
               style={{ zIndex: 50 }}>
               <motion.div
                  initial={{ opacity: 0, y: 100 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 100 }}
                  className='actual'>
                  <div className='flex-space flex-align space'>
                     <h2>Settings</h2>
                     <Tooltip label='Close (ctrl+k)'>
                        <button className='icon' onClick={toggleSettings}>
                           <svg xmlns='http://www.w3.org/2000/svg' height='24' viewBox='0 -960 960 960' width='24'>
                              <path d='m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z' />
                           </svg>
                        </button>
                     </Tooltip>
                  </div>

                  <div className='full main'>
                     <Controls changePage={changeCurrentPage} page={currentPage} />
                     {width > 800 && <Content page={currentPage} />}
                  </div>
               </motion.div>
            </motion.div>
         )}
      </AnimatePresence>
   );
};

export default Settings;
