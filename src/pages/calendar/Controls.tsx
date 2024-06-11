import React, { useContext } from 'react';
import { Tooltip } from '@mantine/core';
import { Link } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';
import { AuthContext, AuthContextValues } from '../../context/AuthContext';
import { SettingContext, SettingContextValues } from '../../context/SettingContext';

const Controls: React.FC = () => {
   const { userStatus } = useContext(AuthContext) as AuthContextValues;
   const { toggleSettings } = useContext(SettingContext) as SettingContextValues;

   return (
      <div style={{ display: 'flex', gap: 15 }}>
         <Tooltip label='Settings (ctrl+k)'>
            <button className='icon' onClick={toggleSettings}>
               <svg xmlns='http://www.w3.org/2000/svg' height='24' viewBox='0 -960 960 960' width='24'>
                  <path d='m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm112-260q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Z' />
               </svg>
            </button>
         </Tooltip>

         {userStatus === true ? (
            <Tooltip label='Logout'>
               <button onClick={() => signOut(auth)} className='icon'>
                  <svg xmlns='http://www.w3.org/2000/svg' height='24' viewBox='0 -960 960 960' width='24'>
                     <path d='M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z' />
                  </svg>
               </button>
            </Tooltip>
         ) : (
            <Tooltip label='Login'>
               <Link className='icon' to='/login'>
                  <svg xmlns='http://www.w3.org/2000/svg' height='24' viewBox='0 -960 960 960' width='24'>
                     <path d='M480-120v-80h280v-560H480v-80h280q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H480Zm-80-160-55-58 102-102H120v-80h327L345-622l55-58 200 200-200 200Z' />
                  </svg>
               </Link>
            </Tooltip>
         )}
      </div>
   );
};

export default Controls;
