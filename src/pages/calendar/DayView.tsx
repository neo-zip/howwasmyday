import React, { useContext, useState } from 'react';
import './DayView.css';
import { motion } from 'framer-motion';
import { Menu, Tooltip } from '@mantine/core';
import { useHotkeys } from '@mantine/hooks';
import { MonthDB } from '../../components/Month';
import { AuthContext, AuthContextValues } from '../../context/AuthContext';
import { CalendarContext, CalendarContextValues } from '../../context/CalendarContext';
import Loading from '../../components/state/Loading';

interface Props {
   day: Day;
   month: Month;
   close: React.Dispatch<React.SetStateAction<Day | undefined>>;
}

const DayView: React.FC<Props> = ({ day, month, close }) => {
   const { currentUser } = useContext(AuthContext) as AuthContextValues;
   const { calendar } = useContext(CalendarContext) as CalendarContextValues;

   const [editing, setEditing] = useState(false);
   const [note, setNote] = useState<string>();

   useHotkeys([['Escape', () => close(undefined)]]);

   // ...edit day

   if (!currentUser === null || !calendar) {
      return <Loading />;
   }

   return (
      <motion.div
         className='overlay dayview'
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         exit={{ opacity: 0 }}
         transition={{ type: 'spring', bounce: 0, duration: 0.3 }}>
         <div className='icon-stack' style={{ right: 0 }}>
            {day.rating && (
               <>
                  {editing ? (
                     <Tooltip label='Done editing'>
                        <button className='icon' onClick={() => setEditing(false)}>
                           <svg xmlns='http://www.w3.org/2000/svg' height='24' viewBox='0 -960 960 960' width='24'>
                              <path d='M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z' />
                           </svg>
                        </button>
                     </Tooltip>
                  ) : (
                     <Tooltip label='Edit'>
                        <button className='icon' onClick={() => setEditing(true)}>
                           <svg xmlns='http://www.w3.org/2000/svg' height='24' viewBox='0 -960 960 960' width='24'>
                              <path d='M772-603 602-771l56-56q23-23 56.5-23t56.5 23l56 56q23 23 24 55.5T829-660l-57 57Zm-58 59L290-120H120v-170l424-424 170 170Z' />
                           </svg>
                        </button>
                     </Tooltip>
                  )}
               </>
            )}
            <Tooltip label='Close (esc)'>
               <button className='icon' onClick={() => close(undefined)}>
                  <svg xmlns='http://www.w3.org/2000/svg' height='24' viewBox='0 -960 960 960' width='24'>
                     <path d='m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z' />
                  </svg>
               </button>
            </Tooltip>
         </div>
         <div className='full center'>
            <h1 className='title'>{month.month + '/' + day.day + '/' + month.year}</h1>
            {editing ? (
               <div>
                  <motion.div initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }} className='inner'>
                     <h1>Editing</h1>
                     <div>
                        {day.rating && (
                           <Menu>
                              <Menu.Target>
                                 <button className='a space-s'>Change Rating</button>
                              </Menu.Target>
                              <Menu.Dropdown>
                                 <Menu.Item
                                    disabled={day.rating === 'good'}
                                    onClick={() =>
                                       new MonthDB().updateDay({
                                          month: calendar,
                                          to: { ...day, rating: 'good' },
                                          user: currentUser,
                                       })
                                    }>
                                    Good
                                 </Menu.Item>
                                 <Menu.Item
                                    disabled={day.rating === 'okay'}
                                    onClick={() =>
                                       new MonthDB().updateDay({
                                          month: calendar,
                                          to: { ...day, rating: 'okay' },
                                          user: currentUser,
                                       })
                                    }>
                                    Okay
                                 </Menu.Item>
                                 <Menu.Item
                                    disabled={day.rating === 'bad'}
                                    onClick={() =>
                                       new MonthDB().updateDay({
                                          month: calendar,
                                          to: { ...day, rating: 'bad' },
                                          user: currentUser,
                                       })
                                    }>
                                    Bad
                                 </Menu.Item>
                              </Menu.Dropdown>
                           </Menu>
                        )}
                        <form
                           onSubmit={() =>
                              new MonthDB().updateDay({
                                 month: calendar,
                                 to: { ...day, note: note },
                                 user: currentUser,
                              })
                           }>
                           <input
                              placeholder='Change Note'
                              className='input'
                              defaultValue={day?.note}
                              onChange={(e) => setNote(e.target.value)}
                           />
                           <button className='btn'>Save</button>
                        </form>
                     </div>
                  </motion.div>
               </div>
            ) : (
               <motion.div initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }} className='inner'>
                  {day.rating === 'none' && <p>You didn't rate this day.</p>}
                  {day.rating === 'good' && <h2>You had a beautiful day!</h2>}
                  {day.rating === 'okay' && <h2>Your day was alright.</h2>}
                  {day.rating === 'bad' && <h2>You had a bad day.</h2>}
                  {!day.rating && <p>This day is yet to come.</p>}
                  {day.note && (
                     <>
                        <p className='label'>And you added this note</p>
                        <div className='note-outer'>
                           <p className='note'>{day.note}</p>
                        </div>
                     </>
                  )}
                  {day.rating === 'bad' && (
                     <>
                        <p className='label'>Some suggestions</p>
                        <div className='note' style={{ overflow: 'hidden' }}>
                           <h3 className='suggestion'>Play some games</h3>
                           <h3 className='suggestion'>Eat some fried rice</h3>
                           <h3 className='suggestion'>Build some lego</h3>
                        </div>
                     </>
                  )}
               </motion.div>
            )}
         </div>
      </motion.div>
   );
};

export default DayView;
