import Calendar from './pages/calendar/Calendar';
import Today from './pages/today/Today';
import { CalendarContext, CalendarContextValues } from './context/CalendarContext';
import React, { useContext } from 'react';
import Loading from './components/state/Loading';
import Settings from './pages/settings/Settings';

const App: React.FC = () => {
   const { calendar, today } = useContext(CalendarContext) as CalendarContextValues;

   if (!calendar || !today) {
      return (
         <div className='page center'>
            <Loading />
         </div>
      );
   }

   return (
      <>
         <Settings />
         {today.completedForm ? <Calendar /> : <Today />}
      </>
   );
};

export default App;
