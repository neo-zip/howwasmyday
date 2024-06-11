import { useContext, useState } from 'react';
import './Today.css';
import Slides from './Slides';
import { CalendarContext, CalendarContextValues } from '../../context/CalendarContext';
import { Tooltip } from '@mantine/core';
import Loading from '../../components/state/Loading';
import { AuthContext, AuthContextValues } from '../../context/AuthContext';

const Today: React.FC = () => {
   const { editToday, today } = useContext(CalendarContext) as CalendarContextValues;
   const { currentUser } = useContext(AuthContext) as AuthContextValues;

   const [slide, setSlide] = useState<number>(0);

   if (!today) {
      return (
         <div className='page center'>
            <Loading />
         </div>
      );
   }

   const previousSlide = () => {
      setSlide((prev) => prev - 1);
   };

   const nextSlide = () => {
      setSlide((prev) => prev + 1);
   };

   const completeForm = () => {
      editToday({ ...today, completedForm: true });
   };

   return (
      <div className='center full'>
         <div className='today'>
            {slide > 0 && (
               <Tooltip label='Previous'>
                  <button className='icon icon-stack' onClick={() => previousSlide()}>
                     <svg xmlns='http://www.w3.org/2000/svg' height='24' viewBox='0 -960 960 960' width='24'>
                        <path d='M480-160 160-480l320-320 57 56-224 224h487v80H313l224 224-57 56Z' />
                     </svg>
                  </button>
               </Tooltip>
            )}
            <Slides slide={slide} form={{ previousSlide, nextSlide, completeForm }} />
            {currentUser && <p className='label center'>logged in as {currentUser?.displayName}</p>}
         </div>
      </div>
   );
};

export default Today;
