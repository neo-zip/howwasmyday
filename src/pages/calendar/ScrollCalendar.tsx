import React, { useContext } from 'react';
import { CalendarContext, CalendarContextValues } from '../../context/CalendarContext';
import Loading from '../../components/state/Loading';
import './ScrollCalendar.css';
import { MonthUtil } from '../../components/Month';
import { Tooltip } from '@mantine/core';

const ScrollCalendar: React.FC = () => {
   const { calendar, editCalendar, currentCalendar, calendarState } = useContext(CalendarContext) as CalendarContextValues;

   if (!calendar) {
      return <Loading />;
   }

   const increase = () => {
      if (currentCalendar.month >= 12) {
         editCalendar({ year: currentCalendar.year + 1, month: 1 });
         return;
      }

      editCalendar({ ...currentCalendar, month: currentCalendar.month + 1 });
   };

   const decrease = () => {
      if (currentCalendar.month <= 1) {
         editCalendar({ year: currentCalendar.year - 1, month: 12 });
         return;
      }

      editCalendar({ ...currentCalendar, month: currentCalendar.month - 1 });
   };

   const jumpToToday = () => {
      const now = new Date();

      editCalendar({ year: now.getFullYear(), month: now.getMonth() + 1 });
   };

   const isToday = new MonthUtil().isWhen(calendar) != 'current';
   const lockNext = currentCalendar.year >= new Date().getFullYear() && currentCalendar.month >= new Date().getMonth() + 1;
   const lockPrev = currentCalendar.year <= 2023 && currentCalendar.month <= 1;

   return (
      <div className='scroll'>
         <p>{currentCalendar.year}</p>
         <Tooltip label='Previous Month' disabled={lockPrev}>
            <button onClick={decrease} disabled={lockPrev} className={lockPrev ? 'disabled' : ''}>
               <svg xmlns='http://www.w3.org/2000/svg' height='24' viewBox='0 -960 960 960' width='24'>
                  <path d='M480-160 160-480l320-320 57 56-224 224h487v80H313l224 224-57 56Z' />
               </svg>
            </button>
         </Tooltip>
         <Tooltip label='Next Month' disabled={lockNext}>
            <button onClick={increase} disabled={lockNext} className={lockNext ? 'disabled' : ''}>
               <svg xmlns='http://www.w3.org/2000/svg' height='24' viewBox='0 -960 960 960' width='24'>
                  <path d='m480-160-57-56 224-224H160v-80h487L423-744l57-56 320 320-320 320Z' />
               </svg>
            </button>
         </Tooltip>

         <Tooltip label='Jump to Today' disabled={!isToday}>
            <button onClick={jumpToToday} disabled={!isToday} className={!isToday ? 'disabled' : ''}>
               <svg xmlns='http://www.w3.org/2000/svg' height='24' viewBox='0 -960 960 960' width='24'>
                  <path d='M200-120q-33 0-56.5-23.5T120-200v-160h80v160h560v-560H200v160h-80v-160q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm220-160-56-58 102-102H120v-80h346L364-622l56-58 200 200-200 200Z' />
               </svg>
            </button>
         </Tooltip>
         {calendarState === null && <Loading size='small' />}
      </div>
   );
};

export default ScrollCalendar;
