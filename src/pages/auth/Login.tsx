import React, { useState, useContext, useEffect } from 'react';
import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, db } from '../../firebase';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { motion } from 'framer-motion';
import { nprogress, NavigationProgress } from '@mantine/nprogress';
import Error from '../../components/state/Error';
import './Auth.css';
import { AuthContext, AuthContextValues } from '../../context/AuthContext';
import { Tooltip } from '@mantine/core';
import { useHotkeys } from '@mantine/hooks';
import IdleOverlay from '../../components/IdleOverlay';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';

const Login: React.FC = () => {
   const { currentUser } = useContext(AuthContext) as AuthContextValues;
   const [error, setError] = useState<any | undefined>(undefined);
   const [passwordShown, setPasswordShown] = useState<boolean>(false);
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
         name: '',
         email: '',
         password: '',
      },

      validate: {
         name: (value) => (/^[a-zA-Z0-9._-]{1,25}$/.test(value) ? null : 'Name must be <25 characters, and be on your keyboard.'),
         email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Please enter a valid email'),
         password: (value) => (value.length < 8 ? 'The password must be >8 characters' : null),
      },
   });

   const loginGoogle = () => {
      const provider = new GoogleAuthProvider();

      signInWithPopup(auth, provider)
         .then(async (result) => {
            await setDoc(doc(db, 'users', result.user.uid), {
               displayName: result.user.displayName,
               uid: result.user.uid,
               email: result.user.email,
               timestamp: serverTimestamp(),
               calls: 0,
            }).catch((err) => {
               nprogress.reset();
               setError(err.code);
               console.error(err);
            });

            nprogress.complete();

            navigateTo('/');
         })
         .catch((err) => {
            nprogress.reset();
            setError(err.code);
            console.error(err);
         });
   };

   const handleSubmit = (values: { name: string; email: string; password: string }) => {
      notifications.clean();

      if (!values) {
         setError(values);

         return;
      }

      nprogress.start();
      signInWithEmailAndPassword(auth, values.email, values.password)
         .then(async (result) => {
            await setDoc(doc(db, 'users', result.user.uid), {
               displayName: values.name,
               uid: result.user.uid,
               email: result.user.email,
               timestamp: serverTimestamp(),
               calls: 0,
            }).catch((err) => {
               nprogress.reset();
               setError(err.code);
               console.error(err);
            });

            nprogress.complete();

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
      } else if (errors.name) {
         notifications.show({
            title: 'Invalid Name',
            message: form.errors.name,
            style: { border: 'var(--error) 2px solid' },
         });
      }
   };

   return (
      <IdleOverlay timeout={10000}>
         <div className='icon-stack' style={{ right: 0 }}>
            <Tooltip label={`${passwordShown ? 'Hide' : 'Show'} passwords`}>
               <button type='button' className='icon' onClick={() => setPasswordShown((prev) => !prev)}>
                  {passwordShown ? (
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
               <button className='icon ' onClick={() => navigateTo('/')}>
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
                     <h2>Welcome back</h2>

                     <p className='label'>username</p>
                     <input
                        type='text'
                        placeholder='ladiesman127'
                        {...form.getInputProps('name')}
                        className={form.errors?.name ? 'invalid' : ''}
                     />

                     <p className='label'>email</p>
                     <input
                        type='text'
                        placeholder='your@email.com'
                        {...form.getInputProps('email')}
                        className={form.errors?.email ? 'invalid' : ''}
                     />

                     <p className='label' {...form.getInputProps('password')}>
                        password
                     </p>
                     <input
                        type={passwordShown ? 'text' : 'password'}
                        placeholder='password...'
                        {...form.getInputProps('password')}
                        className={form.errors?.password ? 'invalid' : ''}
                     />

                     <button className='btn'>Login</button>
                     <button type='button' className='btn' onClick={loginGoogle}>
                        Login with Google
                     </button>
                     {error && (
                        <Error dependants={[error]}>
                           {error?.code == 'auth/user-not-found' ? 'Email already in use.' : 'Something went wrong.'}
                        </Error>
                     )}

                     <p className='label center-text'>
                        Don't have an account?{' '}
                        <Link to='/register' className='a'>
                           Register
                        </Link>
                     </p>
                  </form>
               </motion.div>
            </div>
         </div>
      </IdleOverlay>
   );
};

export default Login;
