import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.js';
import './index.css';
import { ThemeProvider } from './context/ThemeContext.tsx';
import { CalendarProvider } from './context/CalendarContext.tsx';
import { Notifications } from '@mantine/notifications';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Error from './components/state/Error.tsx';
import { SettingProvider } from './context/SettingContext.tsx';
import Login from './pages/auth/Login.tsx';
import Register from './pages/auth/Register.tsx';
import { AuthContextProvider } from './context/AuthContext.tsx';
import DisconnectOverlay from './components/DisconnectOverlay.tsx';
import Legal from './pages/Legal.tsx';
import { ModalsProvider } from '@mantine/modals';

const router = createBrowserRouter([
   {
      path: '/',
      element: <App />,
      errorElement: <Error className='full center'>404, page not found.</Error>,
   },
   {
      path: 'login',
      element: <Login />,
   },
   {
      path: 'legal',
      element: <Legal />,
   },
   {
      path: 'register',
      element: <Register />,
   },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
   <React.StrictMode>
      <AuthContextProvider>
         <CalendarProvider>
            <SettingProvider>
               <ThemeProvider>
                  <DisconnectOverlay>
                     <ModalsProvider>
                        <Notifications autoClose={5000} />
                        <RouterProvider
                           router={router}
                           fallbackElement={<Error>the application has crashed. Please refresh the page.</Error>}
                        />
                     </ModalsProvider>
                  </DisconnectOverlay>
               </ThemeProvider>
            </SettingProvider>
         </CalendarProvider>
      </AuthContextProvider>
   </React.StrictMode>
);
