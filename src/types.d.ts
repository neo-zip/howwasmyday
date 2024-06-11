type Rating = 'good' | 'okay' | 'bad' | 'none' | null;
interface Day {
   rating: Rating;
   day: number;
   note?: string;
   timestamp?: EpochTimeStamp;
   completedForm?: boolean;
   suggestions?: string[];
}
interface Month extends MonthByDateProps {
   timestamp: EpochTimeStamp;
   name: string;
   data: Day[];
}
/**
 * @param year Year should be over 1970.
 * @param month Month should be 1 - 12.
 */
type MonthByDateProps = {
   year: number;
   month: number;
};
type MonthProps = {
   month: Month;
};
type UserProps = {
   user: import('../node_modules/firebase/auth').User | null;
};
type Settings = {
   backgroundImg: URL | null;
   numberCalendar: boolean;
   theme: ThemeSelection;
   actualTheme: Themes;
};
type Themes = 'light' | 'dark';
type ThemeSelection = Themes | 'system';
