import {
   doc,
   getDocs,
   collection,
   query,
   where,
   updateDoc,
   arrayUnion,
   arrayRemove,
   serverTimestamp,
   increment,
} from 'firebase/firestore';
import { db } from '../firebase';

class Log {
   ls = (...e: string[]) => {
      if (import.meta.env.DEV) {
         console.log('%cLS', 'background:#1d9bf0;color: #111;border-radius:5px;padding:0 5px;', ...e);
      }
   };

   db = (...e: string[]) => {
      if (import.meta.env.DEV) {
         console.log('%cDB', 'background:#643bd7;color: #eee;border-radius:5px;padding:0 5px;', ...e);
      }
   };
}

const log = new Log();

export class MonthDB {
   /**
    * Saves to DB/LS if there is modified data.
    * @returns If save was successful.
    */
   save = async ({ month, user }: MonthProps & UserProps): Promise<boolean> => {
      if (!new MonthUtil().hasModifiedData(month)) {
         log.db('Did not save: no modified data.');
         return false;
      }

      this.forceSave({
         month: month,
         user: user,
      });

      return true;
   };

   /**
    * Saves to DB/LS unless already found.
    * @returns If save was successful.
    */
   forceSave = async ({ month, user }: MonthProps & UserProps): Promise<boolean> => {
      if (!user) {
         log.db('No user logged in while saving. Using local storage.');
         return new MonthLocalStorage().save({ month: month });
      }

      if (await this.exists({ year: month.year, month: month.month, user: user })) {
         log.db('Already in DB.');
         return false;
      }

      await updateDoc(doc(db, 'users', user.uid), {
         timestamp: serverTimestamp(),
         calls: increment(1),
         months: arrayUnion(month),
      }).catch((err) => {
         console.error(err);
         return false;
      });

      return true;
   };

   /**
    * Searches DB for month.
    * @returns Will return a month if found in db, otherwise undefined.
    */
   get = async ({ year, month, user }: MonthByDateProps & UserProps): Promise<Month | undefined> => {
      if (!user) {
         log.db(`No user logged in while getting ${month}/${year}. Using local storage.`);
         return new MonthLocalStorage().get({ year: year, month: month });
      }

      const search = query(collection(db, 'users'), where('uid', '==', user.uid));
      const res = await getDocs(search);

      let found: Month | undefined = undefined;

      res.forEach((piece) => {
         piece.data()?.months?.forEach((current: Month) => {
            if (current.year === year && current.month === month) {
               found = current;
            }
         });
      });

      await updateDoc(doc(db, 'users', user.uid), {
         timestamp: serverTimestamp(),
         calls: increment(1),
      });

      if (!found) {
         log.db('No data was found while getting.');
      }

      return found;
   };

   /**
    * Searches DB/LS for month, if not found it will make one.
    * @returns Will always return a month.
    */
   forceGet = async ({ year, month, user }: MonthByDateProps & UserProps): Promise<Month> => {
      const data = await this.get({ year: year, month: month, user: user });

      if (!data) {
         return new MonthUtil().init({ year: year, month: month });
      }

      return data;
   };

   update = async ({ user, to }: UserProps & { to: Month }): Promise<boolean> => {
      if (!user) {
         console.log('(DB) No user logged in while updating. Using local storage.');
         return new MonthLocalStorage().update({ to: to });
      }

      const res = await this.get({ year: to.year, month: to.month, user: user });

      if (!res) {
         console.warn(`(DB) No data was found for ${to.month}/${to.year} while updating.`);
         return false;
      }

      await updateDoc(doc(db, 'users', user.uid), {
         timestamp: serverTimestamp(),
         months: arrayRemove(res),
      }).catch((err) => {
         console.error(err);
         return false;
      });

      await updateDoc(doc(db, 'users', user.uid), {
         timestamp: serverTimestamp(),
         calls: increment(1),
         months: arrayUnion(to),
      }).catch((err) => {
         console.error(err);
         return false;
      });

      console.log('Saved modified data!');
      return true;
   };

   updateDay = async ({ month, user, to }: MonthProps & UserProps & { to: Day }): Promise<boolean> => {
      if (!user) {
         log.db('No user logged in while updating day. Using local storage.');
         return new MonthLocalStorage().updateDay({ month: month, to: to });
      }

      const data = new MonthUtil().editDay(month, to);

      const saved = await this.update({ to: data, user: user }).catch((err) => {
         log.db('Could not update day. ', err);
         return false;
      });

      if (!saved) {
         log.db('Since no data was found it was created with the modified day.');
         this.save({ month: data, user: user });
      }

      return true;
   };

   exists = async ({ year, month, user }: MonthByDateProps & UserProps): Promise<boolean> => {
      if (!user) {
         log.db('No user logged in while checking existance.');
         return false;
      }

      const res = await this.get({ year: year, month: month, user: user });

      if (res) {
         return true;
      }

      return false;
   };
}

export class MonthUtil {
   init = ({ year, month }: MonthByDateProps): Month => {
      const date = new Date(year, month - 1);

      const final: Month = {
         timestamp: new Date().valueOf(),
         year: date.getFullYear(),
         month: date.getMonth() + 1,
         name: date.toLocaleString('default', { month: 'long' }).toLowerCase(),
         data: [],
      };

      const monthLength = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

      let rating: Rating = 'none';

      for (let i = 1; i <= monthLength; i++) {
         switch (this.isWhen(final)) {
            case 'current':
               if (new Date().getDate() < i) {
                  rating = null;
               }

               break;
            case 'future':
               rating = null;
               break;
         }

         final.data.push({
            day: i,
            rating: rating,
            completedForm: false,
         });
      }

      return final;
   };

   editDay = (month: Month, to: Day): Month => {
      const data = month;

      data.data.splice(to.day - 1, 1, to);

      return data;
   };

   isWhen = (month: Month): 'past' | 'future' | 'current' => {
      const now = new Date();
      const mnth = now.getMonth() + 1;
      const yr = now.getFullYear();

      if (month.year > yr) {
         return 'future';
      }

      if (month.year === yr && month.month > mnth) {
         return 'future';
      }

      if (month.year === yr && month.month === mnth) {
         return 'current';
      }

      return 'past';
   };

   hasModifiedData = (month: Month): boolean => {
      for (const day of month.data) {
         if (day.rating === 'good' || day.rating === 'okay' || day.rating === 'bad') {
            return true;
         }
      }

      return false;
   };
}

export class MonthLocalStorage {
   save = ({ month }: MonthProps): boolean => {
      if (this.exists({ year: month.year, month: month.month })) {
         log.ls('Already in LS.');
         return false;
      }

      const prev = localStorage.getItem('months');

      if (!prev) {
         localStorage.setItem('months', JSON.stringify([month]));
         return true;
      }

      localStorage.setItem('months', JSON.stringify([...JSON.parse(prev), month]));
      log.ls(`saved ls month`);

      return true;
   };

   get = ({ year, month }: MonthByDateProps): Month | undefined => {
      const data = localStorage.getItem('months');

      if (!data) {
         log.ls('No data exists while getting.');
         return undefined;
      }

      let found: Month | undefined = undefined;

      JSON.parse(data).forEach((current: Month) => {
         if (current.year === year && current.month === month) {
            found = current;
         }
      });

      if (!found) {
         log.ls('No data was found while getting.');
      }

      log.ls(`got month ${month}/${year}`);
      return found;
   };

   update = ({ to }: { to: Month }): boolean => {
      const res = this.get({ year: to.year, month: to.month });
      const storage = localStorage.getItem('months');

      if (!storage || !res) {
         log.ls('Could not update month because it does not exist.');
         return false;
      }

      const data = [JSON.parse(storage)];

      data.splice(data.indexOf(res), 1, to);

      localStorage.setItem('months', JSON.stringify(data));
      log.ls(`updated month ${to.month}/${to.year}`);
      return true;
   };

   updateDay = ({ month, to }: MonthProps & { to: Day }): boolean => {
      const data = new MonthUtil().editDay(month, to);

      const saved = this.update({ to: data });

      if (!saved) {
         log.ls('Since no data was found it was created with the modified day.');
         this.save({ month: data });
      }

      log.ls(`updated day ${month.month}/${to.day}/${month.year}`);
      return true;
   };

   exists = ({ year, month }: MonthByDateProps): boolean => {
      const res = this.get({ year: year, month: month });

      if (res) {
         return true;
      }

      return false;
   };

   clear = (): boolean => {
      localStorage.removeItem('months');

      return true;
   };

   getAll = () => {
      return localStorage.getItem('months');
   };
}
