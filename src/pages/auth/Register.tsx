import React, { useState, useContext, useEffect } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../firebase';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { motion } from 'framer-motion';
import Error from '../../components/state/Error';
import './Auth.css';
import { nprogress, NavigationProgress } from '@mantine/nprogress';
import { AuthContext, AuthContextValues } from '../../context/AuthContext';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { Tooltip } from '@mantine/core';
import { useHotkeys } from '@mantine/hooks';
import IdleOverlay from '../../components/IdleOverlay';

const Register: React.FC = () => {
   const { currentUser } = useContext(AuthContext) as AuthContextValues;
   const [error, setError] = useState<any | undefined>(undefined);
   const [passwordsShown, setPasswordsShown] = useState<boolean>(false);
   const navigateTo = useNavigate();

   useEffect(() => {
      if (currentUser) {
         console.warn('Already signed in.');
         navigateTo('/');
      }
   }, []);

   useHotkeys([['Escape', () => navigateTo('/')]]);

   const form = useForm({
      initialValues: {
         email: '',
         password: '',
         confirmPassword: '',
         tos: false,
      },

      validate: {
         email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Please enter a valid email'),
         password: (value) =>
            /^(?=.*[A-Za-z])(?=.*\d)(?=.*[:;-_@$!%*#?&])[A-Za-z\d:;-_@$!%*#?&]{8,}$/.test(value)
               ? null
               : 'Must have at least 8 characters, a special character, a letter, and a number',
         confirmPassword: (value, values) => (value !== values.password ? 'Passwords did not match' : null),
         tos: (value) => (!value ? 'Must agree to TOS' : null),
      },
   });

   const handleSubmit = (values: { email: string; password: string }) => {
      notifications.clean();

      if (!values) {
         setError(values);

         return;
      }

      nprogress.start();
      createUserWithEmailAndPassword(auth, values.email, values.password)
         .then(async (res) => {
            await setDoc(doc(db, 'users', res.user.uid), {
               uid: res.user.uid,
               email: values.email,
               timestamp: serverTimestamp(),
               calls: 0,
            }).catch((err) => {
               nprogress.reset();
               setError(err.code);
               console.error(err);
            });

            nprogress.complete();

            notifications.show({
               title: 'Woohoo!',
               message: 'Your account was successfully created.',
               style: { border: 'var(--success) 2px solid' },
            });
            navigateTo('/');
         })
         .catch((err) => {
            nprogress.reset();
            setError(err.code);
            console.error(err);
         });
   };

   const handleError = (errors: typeof form.errors) => {
      if (errors.email) {
         notifications.show({
            title: 'Invalid Email',
            message: form.errors.email,
            style: { border: 'var(--error) 2px solid' },
         });
      } else if (errors.password) {
         notifications.show({
            title: 'Invalid Password',
            message: form.errors.password,
            style: { border: 'var(--error) 2px solid' },
         });
      } else if (errors.confirmPassword) {
         notifications.show({
            title: 'Invalid Confirmation Password',
            message: form.errors.confirmPassword,
            style: { border: 'var(--error) 2px solid' },
         });
      } else if (errors.tos) {
         notifications.show({
            title: 'Please agree to the Tos',
            message: form.errors.tos,
            style: { border: 'var(--error) 2px solid' },
         });
      }
   };

   return (
      <IdleOverlay timeout={10000}>
         <div className='icon-stack' style={{ right: 0 }}>
            <Tooltip label={`${passwordsShown ? 'Hide' : 'Show'} passwords`}>
               <button type='button' className='icon' onClick={() => setPasswordsShown((prev) => !prev)}>
                  {passwordsShown ? (
                     <svg xmlns='http://www.w3.org/2000/svg' height='24' viewBox='0 -960 960 960' width='24'>
                        <path d='M792-56 624-222q-35 11-70.5 16.5T480-200q-151 0-269-83.5T40-500q21-53 53-98.5t73-81.5L56-792l56-56 736 736-56 56ZM480-320q11 0 20.5-1t20.5-4L305-541q-3 11-4 20.5t-1 20.5q0 75 52.5 127.5T480-320Zm292 18L645-428q7-17 11-34.5t4-37.5q0-75-52.5-127.5T480-680q-20 0-37.5 4T408-664L306-766q41-17 84-25.5t90-8.5q151 0 269 83.5T920-500q-23 59-60.5 109.5T772-302ZM587-486 467-606q28-5 51.5 4.5T559-574q17 18 24.5 41.5T587-486Z' />
                     </svg>
                  ) : (
                     <svg xmlns='http://www.w3.org/2000/svg' height='24' viewBox='0 -960 960 960' width='24'>
                        <path d='M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Z' />
                     </svg>
                  )}
               </button>
            </Tooltip>
            <Tooltip label='Close (esc)'>
               <button className='icon' onClick={() => navigateTo('/')}>
                  <svg xmlns='http://www.w3.org/2000/svg' height='24' viewBox='0 -960 960 960' width='24'>
                     <path d='m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z' />
                  </svg>
               </button>
            </Tooltip>
         </div>
         <div className='overlay'>
            <NavigationProgress />
            <div className='page center'>
               <motion.div initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }}>
                  <form className='auth' onSubmit={form.onSubmit((values) => handleSubmit(values), handleError)}>
                     <h2>Welcome</h2>
                     <p className='label'>Email</p>
                     <input
                        type='text'
                        placeholder='your@email.com'
                        {...form.getInputProps('email')}
                        className={form.errors?.email ? 'invalid' : ''}
                     />

                     <p className='label'>Password</p>
                     <input
                        type={passwordsShown ? 'text' : 'password'}
                        placeholder='password'
                        {...form.getInputProps('password')}
                        className={form.errors?.password ? 'invalid' : ''}
                     />

                     <p className='label'>Confirm Password</p>
                     <input
                        type={passwordsShown ? 'text' : 'password'}
                        placeholder='confirm password'
                        {...form.getInputProps('confirmPassword')}
                        className={form.errors?.confirmPassword ? 'invalid' : ''}
                     />

                     <label className='checkbox-outer'>
                        <input
                           type='checkbox'
                           className={`checkbox ${form.errors?.tos && 'invalid'}`}
                           {...form.getInputProps('tos', { type: 'checkbox' })}
                        />
                        Agree to{' '}
                        <Link to='/legal' className='a'>
                           Terms
                        </Link>
                     </label>

                     <button className='btn'>Register</button>

                     {error && (
                        <Error dependants={[error]}>
                           {error?.code == 'auth/email-already-in-use' ? 'Email already in use.' : 'Something went wrong.'}
                        </Error>
                     )}

                     <p className='label center-text'>
                        Already have an account?{' '}
                        <Link to='/login' className='a'>
                           Login
                        </Link>
                     </p>
                  </form>
               </motion.div>
            </div>
         </div>
      </IdleOverlay>
   );
};

export default Register;
