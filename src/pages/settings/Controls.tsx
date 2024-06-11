import React, { useContext } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';
import { AuthContext, AuthContextValues } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useOs } from '@mantine/hooks';
import { Page } from './Settings';

interface Props {
   changePage: (to: Page) => void;
   page: Page;
}

const Controls: React.FC<Props> = ({ changePage, page }) => {
   const { userStatus, currentUser } = useContext(AuthContext) as AuthContextValues;

   const navigateTo = useNavigate();
   const os = useOs();

   return (
      <div className='left'>
         <p className='label'>Account Settings</p>
         <div className='outline flex-col space-m'>
            <button className={page === 'Data' ? 'option active' : 'option'} onClick={() => changePage('Data')}>
               <svg xmlns='http://www.w3.org/2000/svg' height='24' viewBox='0 -960 960 960' width='24'>
                  <path d='M840-680v480q0 33-23.5 56.5T760-120H200q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h480l160 160ZM480-240q50 0 85-35t35-85q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 50 35 85t85 35ZM240-560h360v-160H240v160Z' />
               </svg>
               <p>Data</p>
            </button>
            {userStatus === true ? (
               <>
                  <button
                     className={page === 'Your Account' ? 'option active' : 'option'}
                     onClick={() => changePage('Your Account')}>
                     <svg xmlns='http://www.w3.org/2000/svg' height='24' viewBox='0 -960 960 960' width='24'>
                        <path d='M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Z' />
                     </svg>
                     <p>Your Account</p>
                  </button>
                  <button
                     className='option'
                     onClick={() => {
                        changePage('Data');
                        signOut(auth);
                     }}>
                     <svg xmlns='http://www.w3.org/2000/svg' height='24' viewBox='0 -960 960 960' width='24'>
                        <path d='M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z' />
                     </svg>
                     <p>Logout</p>
                  </button>
               </>
            ) : (
               <button className='option' onClick={() => navigateTo('/login')}>
                  <svg xmlns='http://www.w3.org/2000/svg' height='24' viewBox='0 -960 960 960' width='24'>
                     <path d='M480-120v-80h280v-560H480v-80h280q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H480Zm-80-160-55-58 102-102H120v-80h327L345-622l55-58 200 200-200 200Z' />
                  </svg>
                  <p>Login</p>
               </button>
            )}
         </div>

         <p className='label'>Customization</p>
         <div className='outline flex-col space-m'>
            <button className={page === 'Appearance' ? 'option active' : 'option'} onClick={() => changePage('Appearance')}>
               <svg xmlns='http://www.w3.org/2000/svg' height='24' viewBox='0 -960 960 960' width='24'>
                  <path d='M240-120q-45 0-89-22t-71-58q26 0 53-20.5t27-59.5q0-50 35-85t85-35q50 0 85 35t35 85q0 66-47 113t-113 47Zm230-240L360-470l358-358q11-11 27.5-11.5T774-828l54 54q12 12 12 28t-12 28L470-360Z' />
               </svg>
               <p>Appearance</p>
            </button>
            <button className={page === 'Calendar' ? 'option active' : 'option'} onClick={() => changePage('Calendar')}>
               <svg xmlns='http://www.w3.org/2000/svg' height='24' viewBox='0 -960 960 960' width='24'>
                  <path d='M200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Z' />
               </svg>
               <p>Calendar</p>
            </button>
         </div>
         <p className='label'>Info</p>
         <div className='outline flex-col space-m'>
            <button className='option' onClick={() => changePage('Whats new')}>
               <svg xmlns='http://www.w3.org/2000/svg' height='24' viewBox='0 -960 960 960' width='24'>
                  <path d='M480-120q-75 0-140.5-28.5t-114-77q-48.5-48.5-77-114T120-480q0-75 28.5-140.5t77-114q48.5-48.5 114-77T480-840q82 0 155.5 35T760-706v-94h80v240H600v-80h110q-41-56-101-88t-129-32q-117 0-198.5 81.5T200-480q0 117 81.5 198.5T480-200q105 0 183.5-68T756-440h82q-15 137-117.5 228.5T480-120Zm112-192L440-464v-216h80v184l128 128-56 56Z' />
               </svg>
               <p>What's new</p>
            </button>
            <button className='option' onClick={() => navigateTo('/legal')}>
               <svg xmlns='http://www.w3.org/2000/svg' height='24' viewBox='0 -960 960 960' width='24'>
                  <path d='M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h560v-280h80v280q0 33-23.5 56.5T760-120H200Zm188-212-56-56 372-372H560v-80h280v280h-80v-144L388-332Z' />
               </svg>
               <p>Legal</p>
            </button>
         </div>
         <p className='label'>
            {import.meta.env.MODE} {import.meta.env.VITE_APP_VERSION}
         </p>
         <p className='label'>{os}</p>
         {currentUser && <p className='label'>logged in as {currentUser?.displayName}</p>}
      </div>
   );
};

export default Controls;
