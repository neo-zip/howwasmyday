import React from 'react';
import { useIdle } from '@mantine/hooks';
import { motion } from 'framer-motion';
import './Overlay.css';

interface Props {
   children: React.ReactNode;
   timeout: number;
}

const IdleOverlay: React.FC<Props> = ({ children, timeout }) => {
   const idle = useIdle(timeout, { initialState: false });

   return (
      <>
         {idle && (
            <div className='full blur'>
               <motion.div
                  initial={{ opacity: 0, y: 100 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: 'anticipate' }}>
                  <h2>We've detected you idle</h2>
                  <p style={{ marginTop: 10 }}>Move your mouse to confirm you're here.</p>
               </motion.div>
            </div>
         )}
         {children}
      </>
   );
};

export default IdleOverlay;
