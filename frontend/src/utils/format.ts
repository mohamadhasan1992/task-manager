import { default as dayjs } from 'dayjs';

export const formatDate = (date: string) =>
  dayjs(date).format('MMMM D, YYYY ');
