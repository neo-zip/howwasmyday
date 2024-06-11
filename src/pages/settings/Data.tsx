import { useClipboard } from '@mantine/hooks';
import React from 'react';
import { Link } from 'react-router-dom';
import { MonthLocalStorage } from '../../components/Month';
import { notifications } from '@mantine/notifications';
import { SettingsLocalStorage } from '../../components/Settings';
import { modals } from '@mantine/modals';

const Data: React.FC = () => {
   const clipboardMonth = useClipboard({ timeout: 2000 });
   const clipboardSettings = useClipboard({ timeout: 2000 });

   const deleteSavedData = () => {
      new MonthLocalStorage().clear();
      notifications.show({
         title: 'Woohoo!',
         message: <p>We've deleted your saved data. Refresh the page for effect.</p>,
         style: { border: 'var(--success) 2px solid' },
      });
   };

   const deleteSavedSettings = () => {
      new SettingsLocalStorage().clear();
      notifications.show({
         title: 'Woohoo!',
         message: <p>We've deleted your saved settings. Refresh the page for effect.</p>,
         style: { border: 'var(--success) 2px solid' },
      });
   };

   const deleteSavedDataModal = () =>
      modals.openConfirmModal({
         title: <p>Delete saved data?</p>,
         children: (
            <p>
               This action can't be undone. It will remove all saved data from your device. (Not your Account, for that use the my
               account tab)
            </p>
         ),
         centered: true,
         confirmProps: { style: { backgroundColor: 'red' } },
         labels: { confirm: 'Confirm', cancel: 'Cancel' },
         onConfirm: () => deleteSavedData(),
      });

   const deleteSavedSettingsModal = () =>
      modals.openConfirmModal({
         title: <p>Delete saved settings?</p>,
         children: (
            <p>
               This action can't be undone. It will remove all saved settings from your device. (Not your Account, for that use
               the my account tab)
            </p>
         ),
         centered: true,
         confirmProps: { style: { backgroundColor: 'red' } },
         labels: { confirm: 'Confirm', cancel: 'Cancel' },
         onConfirm: () => deleteSavedSettings(),
      });

   return (
      <>
         <p>For account data login & use the My Account tab.</p>
         <p className='space-l'>
            Learn more about how data is managed{' '}
            <Link to='/legal' className='a'>
               here
            </Link>
            .
         </p>
         <h3 className='space-s'>Data saved on this device</h3>
         <div className='flex-align flex-gap space-l'>
            <button className='btn space-right' onClick={() => clipboardMonth.copy(new MonthLocalStorage().getAll())}>
               {clipboardMonth.copied ? 'Copied' : 'Copy'} saved data
            </button>
            <button
               className='btn space-right'
               style={{ '--color': '#f008' } as React.CSSProperties}
               onClick={deleteSavedDataModal}>
               Clear saved data
            </button>
         </div>
         <h3 className='space-s'>Settings saved on this device</h3>
         <div className='flex-align flex-gap space'>
            <button className='btn space-right' onClick={() => clipboardSettings.copy(new SettingsLocalStorage().get())}>
               {clipboardSettings.copied ? 'Copied' : 'Copy'} saved settings
            </button>
            <button
               className='btn space-right'
               style={{ '--color': '#f008' } as React.CSSProperties}
               onClick={deleteSavedSettingsModal}>
               Clear saved settings
            </button>
         </div>
      </>
   );
};

export default Data;
