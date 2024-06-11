import React, { useContext } from 'react';
import { AuthContext, AuthContextValues } from '../../context/AuthContext';
import Loading from '../../components/state/Loading';

const Account: React.FC = () => {
   const { userStatus, currentUser } = useContext(AuthContext) as AuthContextValues;

   if (userStatus === null) {
      return <Loading />;
   }

   return (
      <>
         <div className='space-l flex-gap flex-col'>
            <p>Very broken at the moment, don't worry, i'll fix it with the next update</p>
            <h3 className='space-s'>Management</h3>
            <p className='label'>Username</p>
            <input className='input' placeholder={currentUser?.displayName ?? 'none'} />
            <p className='label'>Email</p>
            <input className='input' placeholder={currentUser?.email ?? 'none'} />
            <p className='label'>Password</p>
            <p>Reset wip</p>
         </div>
         <h3 className='space-s'>Danger zone</h3>
         <div className='flex-gap'>
            <button
               className='btn space-right'
               style={{ '--color': '#f008' } as React.CSSProperties}
               onClick={() => currentUser?.delete()}>
               Delete Account
            </button>
         </div>
      </>
   );
};

export default Account;
