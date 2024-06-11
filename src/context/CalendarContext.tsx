import { createContext, useContext, useEffect, useState } from 'react';
import { AuthContext, AuthContextValues } from './AuthContext';
import { MonthDB } from '../components/Month';

export interface CalendarContextValues {
   editToday: (to: Day) => void;
   editCalendar: ({ year, month }: MonthByDateProps) => void;
   currentCalendar: MonthByDateProps;
   calendarState: boolean | null;
   today: Day | undefined;
   calendar: Month | undefined;
}

export const CalendarContext = createContext<CalendarContextValues | null>(null);

export const CalendarProvider = ({ children }: { children: React.ReactNode }) => {
   const { currentUser, userStatus } = useContext(AuthContext) as AuthContextValues;

   const monthDB = new MonthDB();
   const now = new Date();
   const current = {
      month: now.getMonth() + 1,
      year: now.getFullYear(),
      day: now.getDate(),
   };

   const [currentCalendar, setCurrentCalendar] = useState<MonthByDateProps>({ year: current.year, month: current.month });
   const [calendar, setCalendar] = useState<Month | undefined>(undefined);
   const [calendarState, setCalendarState] = useState<boolean | null>(null);
   const [today, setToday] = useState<Day | undefined>(undefined);

   const editToday = (to: Day) => {
      setToday(to);
   };

   const editCalendar = ({ year, month }: MonthByDateProps) => {
      setCurrentCalendar({ year: year, month: month });
   };

   const getCalendar = async ({ year, month }: MonthByDateProps) => {
      console.log(`Refreshed calendar to ${currentCalendar.month}/${currentCalendar.year}! user ${userStatus}`);
      setCalendarState(null);

      if (userStatus == null) {
         setCalendar(undefined);
         return;
      }

      const res = await monthDB.forceGet({ year: year, month: month, user: currentUser });

      if (res.month === current.month || res.year === current.year) {
         setToday(today ?? res.data[current.day - 1]);
      }

      setCalendar(res);
      setCalendarState(true);
   };

   useEffect(() => {
      getCalendar({ year: currentCalendar.year, month: currentCalendar.month });
   }, [userStatus, currentCalendar]);

   useEffect(() => {
      const getDay = async () => {
         if (!today || !calendar) {
            return;
         }

         await monthDB.updateDay({ month: calendar, user: currentUser, to: today });
      };

      if (!today) {
         return;
      }

      if (today.completedForm) {
         // TODO: trigger only on change after first get
         getDay();
      }
   }, [today]);

   return (
      <CalendarContext.Provider value={{ editToday, editCalendar, calendarState, currentCalendar, today, calendar }}>
         {children}
      </CalendarContext.Provider>
   );
};
