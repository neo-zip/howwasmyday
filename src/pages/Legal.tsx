import React from 'react';
import { useNavigate } from 'react-router-dom';

const Legal: React.FC = () => {
   const navigateTo = useNavigate();

   return (
      <div className='page center'>
         <div
            className='outline flex-gap flex-col'
            style={{ padding: 50, lineHeight: 1.2, overflowY: 'scroll', '--bg-color': 'var(--bg-h1)' } as React.CSSProperties}>
            <div className='flex-space flex-align'>
               <h1>Terms of Service</h1>
               <button className='btn' onClick={() => navigateTo('/register')}>
                  Register
               </button>
            </div>
            <h3>1. Acceptance of Terms</h3>
            <p>
               By accessing or using our website (the "Service"), you agree to be bound by these Terms of Service ("Terms"). If
               you disagree with any part of the Terms, then you may not access the Service.
            </p>

            <h3>2. Account Registration</h3>
            <p>
               To access certain features of the Service, you may need to create an account. You are responsible for providing
               accurate and complete information during the registration process. It is recommended to keep your account
               credentials confidential and not share them with any third party.
            </p>

            <h3>3. User Content</h3>
            <p>
               The Service allows you to save or upload certain data used for the Service ("User Content"). You are solely
               responsible for the User Content you upload or submit to the Service. By uploading or submitting User Content, you
               grant us a non-exclusive, royalty-free, worldwide, perpetual, and irrevocable license to use, reproduce, modify,
               adapt, publish, translate, distribute, and display such User Content for the purpose of providing and promoting the
               Service.
            </p>

            <h3>4. Intellectual Property</h3>
            <p>
               The Service and its original content (excluding User Content) are and will remain the exclusive property of{' '}
               <a className='a' href='https://neotap.net'>
                  neotap co.
               </a>{' '}
               and its licensors. Our original content may not be copied in connection with any product or service without the
               prior consent of{' '}
               <a className='a' href='https://neotap.net'>
                  neotap co
               </a>
               .
            </p>

            <h3>5. Termination</h3>
            <p>
               We may terminate or suspend your account and access to the Service immediately, without prior notice or liability,
               for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to
               use the Service will immediately cease.
            </p>

            <h3>6. Limitation of Liability</h3>
            <p>
               In no event shall{' '}
               <a className='a' href='https://neotap.net'>
                  neotap co.
               </a>
               , its directors, employees, partners, agents, suppliers, or affiliates be liable for any indirect, incidental,
               special, consequential, or punitive damages, including without limitation loss of profits, data, use, goodwill, or
               other intangible losses, resulting from your access to or use of or inability to access or use the Service.
            </p>

            <p>
               By using the Service, you agree to comply with these Terms of Service. If you do not agree to these Terms, you are
               not permitted to use the Service.
            </p>
         </div>
      </div>
   );
};

export default Legal;
