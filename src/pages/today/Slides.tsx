import { useContext, useState } from 'react';
import { CalendarContext, CalendarContextValues } from '../../context/CalendarContext';
import Error from '../../components/state/Error';
import { motion } from 'framer-motion';

const Slides = ({ slide, form }: { slide: number; form: any }) => {
   const { editToday, today } = useContext(CalendarContext) as CalendarContextValues;
   const phrases: string[] = ['How was today?', "Hey, how's today?", "How's today?", "How's your day?", 'How was your day?'];
   const [charCount, setCharCount] = useState<number>(0);
   const [noteContent, setNoteContent] = useState<string | undefined>(undefined);

   // const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
   //    if (e.key === 'Tab' && charCount <= 0) {
   //       e.preventDefault();
   //       setTextareaContent(`Today was ${today?.rating} because `);
   //       ...if 0 char re set default value
   //       ...focus on last char
   //    }
   // };

   if (!today) {
      return <Error>Couldn't load today.</Error>;
   }

   const slides = [
      <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, type: 'spring' }}>
         <h1 className='center-text'>{phrases[Math.floor(Math.random() * phrases.length)]}</h1>
         <div className='options'>
            <div>
               <button
                  onClick={() => {
                     editToday({ ...today, rating: 'good' });
                     form.nextSlide();
                  }}>
                  <svg xmlns='http://www.w3.org/2000/svg' height='24' viewBox='0 -960 960 960' width='24'>
                     <path d='M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z' />
                  </svg>
               </button>
               <h3 className='center-text'>Good</h3>
            </div>
            <div>
               <button
                  onClick={() => {
                     editToday({ ...today, rating: 'okay' });
                     form.nextSlide();
                  }}>
                  <svg xmlns='http://www.w3.org/2000/svg' height='24' viewBox='0 -960 960 960' width='24'>
                     <path d='M200-440v-80h560v80H200Z' />
                  </svg>
               </button>
               <h3 className='center-text'>Okay</h3>
            </div>
            <div>
               <button
                  onClick={() => {
                     editToday({ ...today, rating: 'bad' });
                     form.nextSlide();
                  }}>
                  <svg xmlns='http://www.w3.org/2000/svg' height='24' viewBox='0 -960 960 960' width='24'>
                     <path d='m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z' />
                  </svg>
               </button>
               <h3 className='center-text'>Bad</h3>
            </div>
         </div>
      </motion.div>,
      <div>
         <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, type: 'spring' }}>
            <h2 className='center-text'>Would you like to add a note?</h2>
            <div className='center'>
               <div className='notes'>
                  <div className='left'>
                     <textarea
                        maxLength={1000}
                        placeholder={`Today was ${today.rating} because...`}
                        defaultValue={today.note}
                        onChange={(e) => {
                           setNoteContent(e.target.value);
                           setCharCount(e.target.value.length);
                        }}
                        // onKeyDown={handleKeyDown}
                     />
                     {charCount > 900 && <p className={`label ${charCount >= 1000 && 'error'}`}>{charCount}</p>}
                  </div>
                  <div className='right'>
                     {charCount > 0 ? (
                        <button
                           className='btn-label'
                           onClick={() => {
                              editToday({ ...today, note: noteContent });
                              today.rating === 'bad'
                                 ? form.nextSlide()
                                 : editToday({ ...today, note: noteContent, completedForm: true });
                           }}>
                           All done
                        </button>
                     ) : (
                        <button
                           className='btn-label'
                           onClick={today.rating === 'bad' ? () => form.nextSlide() : () => form.completeForm()}>
                           No thanks
                        </button>
                     )}
                  </div>
               </div>
            </div>
         </motion.div>
      </div>,
      today.rating === 'bad' && (
         <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, type: 'spring' }}
            className='center'>
            <div>
               <h2>Since your day was bad</h2>
               <motion.div style={{ margin: '30px 0' }}>
                  <h3 className='suggestion'>Play some games</h3>
                  <h3 className='suggestion'>Eat some fried rice</h3>
                  <h3 className='suggestion'>Build some lego</h3>
               </motion.div>
               <button className='btn-label' onClick={() => form.completeForm()}>
                  Alright, thanks
               </button>
            </div>
         </motion.div>
      ),
   ];

   if (!slides[slide]) {
      return (
         <Error dependants={[slide, today]} className='center full'>
            There was an error loading today's form.
         </Error>
      );
   }

   return slides[slide];
};
export default Slides;
