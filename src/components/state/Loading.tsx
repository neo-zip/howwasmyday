import React, { useEffect, useState } from 'react';
import './State.css';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
   snap?: number;
   size?: 'small' | 'large';
}

const Loading: React.FC<Props> = ({ snap, size }) => {
   const [snapShown, setSnapShown] = useState(false);

   const actualSnap = snap ?? 5;

   useEffect(() => {
      const timeout = setTimeout(() => {
         setSnapShown(true);
      }, actualSnap * 1000);

      return () => clearTimeout(timeout);
   }, [snap]);

   return (
      <div className='center'>
         <div className={`loader ${size === 'small' ? 'small' : ''}`}>
            <div />
            <div />
            <div />
            <div />
         </div>
         {snapShown && size != 'small' && (
            <>
               <h3>Its been a little.</h3>
               <p>Maybe check your connection or our status.</p>
            </>
         )}
      </div>
   );
};

export default Loading;
