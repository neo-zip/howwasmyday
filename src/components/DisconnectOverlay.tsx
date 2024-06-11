import React from 'react';
import { useNetwork } from '@mantine/hooks';
import { motion } from 'framer-motion';
import './Overlay.css';

interface Props {
   children: React.ReactNode;
}

const DisconnectOverlay: React.FC<Props> = ({ children }) => {
   const network = useNetwork();

   return (
      <>
         {!network.online && (
            <div className='full blur' style={{ zIndex: 16 }}>
               <motion.div
                  initial={{ opacity: 0, y: 100 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: 'anticipate' }}>
                  <h2>You've disconnected.</h2>
                  <p style={{ marginTop: 10 }}>Please reconnect or check our status.</p>
               </motion.div>
            </div>
         )}
         {children}
      </>
   );
};

export default DisconnectOverlay;
