import React, { useState, useEffect, useContext } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Tooltip } from '@mantine/core';
import { CalendarContext, CalendarContextValues } from '../../context/CalendarContext';
import Controls from './Controls';
import DayView from './DayView';
import Loading from '../../components/state/Loading';
import Error from '../../components/state/Error';
import ScrollCalendar from './ScrollCalendar';
import './Calendar.css';
import { SettingContext, SettingContextValues } from '../../context/SettingContext';
import { useViewportSize } from '@mantine/hooks';

const Calendar: React.FC = () => {
   const { calendar, today } = useContext(CalendarContext) as CalendarContextValues;
   const { settings } = useContext(SettingContext) as SettingContextValues;
   const { width } = useViewportSize();

   const [openDay, setOpenDay] = useState<Day | undefined>(undefined);
   const [render, setRender] = useState<boolean>(false);

   useEffect(() => {
      setRender((prev) => !prev);
   }, [calendar]);

   if (!calendar || !today) {
      return (
         <div className='page center'>
            <Loading />
         </div>
      );
   }

   return (
      <>
         <AnimatePresence>{openDay && <DayView day={openDay} month={calendar} close={setOpenDay} />}</AnimatePresence>
         <div className='page center calendar'>
            <motion.div
               initial={{ opacity: 0, y: 100 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.5, ease: 'anticipate' }}>
               <ScrollCalendar />

               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 15 }}>
                  <h2>Here's {calendar.name} so far</h2>
                  {width > 800 && <Controls />}
               </div>
               {calendar.data[0] ? (
                  <div className='actual'>
                     {calendar.data.map((day: Day, idx: number) => {
                        return (
                           <div key={idx} className='day'>
                              <Tooltip
                                 label={day.rating ? day.rating : 'day is yet to come'}
                                 events={{ hover: true, focus: true, touch: render }}>
                                 <button className={`rating ${day.rating}`} onClick={() => setOpenDay(day)} />
                              </Tooltip>
                              {settings.numberCalendar && <p>{day.day}</p>}
                           </div>
                        );
                     })}
                  </div>
               ) : (
                  <div className='buffer'>
                     <Error dependants={[calendar]}>There was an error loading the Calendar.</Error>
                  </div>
               )}
            </motion.div>
         </div>
      </>
   );
};

export default Calendar;
