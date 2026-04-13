import dayjs from 'dayjs';
import moment from 'moment-timezone';
import { repeatFrequencyEnum } from '../enum/recurrence.enum';

export type InstanceDateType = {
  date: any;
  index: number;
  interval: number;
  frequency: keyof typeof repeatFrequencyEnum;
  weekDay?: number;
  convertTo?: dayjs.ManipulateType;
  dayOfMonth?: any;
  weekOfMonth?: any;
  dayOfWeek?: any;
  timezoneRegion?: string;
};

export const DEFAULT_LOCATION_TIMEZONE = 'Australia/Brisbane';

export const weekOfMonth = (d: Date) => {
  const startOfMonth = dayjs(d).startOf('month');
  const dayOfWeek = d.getDay();
  const endDate = d.getDate(); // 1 - 31

  let weekOfMonthCounter = 0;

  for (let i = 0; i <= endDate; i++) {
    const day = startOfMonth.add(i, 'day');
    if (day.day() === dayOfWeek) {
      weekOfMonthCounter++;
    }
  }

  return weekOfMonthCounter > 0 ? weekOfMonthCounter - 1 : 0;
};

export const weekCount = (date: Date, startDayOfWeek: number) => {
  if (startDayOfWeek < 0 || startDayOfWeek > 6) {
    throw new Error('Invalid startDayOfWeek');
  }

  const year = date.getFullYear();
  const month = date.getMonth();
  // Get the first day of week week day (0: Sunday, 1: Monday, ...)
  const firstDayOfWeek = startDayOfWeek || 0;

  const firstOfMonth = new Date(year, month, 1);
  const lastOfMonth = new Date(year, month + 1, 0);

  const numberOfDaysInMonth = lastOfMonth.getDate();
  const firstWeekDay = (firstOfMonth.getDay() - firstDayOfWeek + 7) % 7;

  const used = firstWeekDay + numberOfDaysInMonth;

  return Math.ceil(used / 7);
};

export const generateInstanceDate = ({
  date,
  index,
  interval,
  frequency,
  weekDay,
  convertTo,
  dayOfMonth,
  dayOfWeek,
  weekOfMonth,
  timezoneRegion,
}: InstanceDateType) => {
  switch (frequency) {
    case 'week': {
      // if (index === 0 && weekDay < dayjs(date).get('day')) {
      //   return false;
      // }

      // preserve time portion of date when generating instances
      const dateMoment = moment(date).tz(timezoneRegion);
      const hour = dateMoment.hours();
      const minute = dateMoment.minutes();
      // handle so that monday is start of the week, so if sunday add next week
      const instanceDate =
        weekDay === 0
          ? moment(date)
              .tz(timezoneRegion)
              .add(index * interval, frequency)
              .startOf('week')
              .add(1, 'week') // get next sunday as our weekday starts from monday in calendar
              .add(weekDay, convertTo as any)
              .hour(hour)
              .minute(minute)
              .toDate()
          : moment(date)
              .tz(timezoneRegion)
              .add(index * interval, frequency)
              .startOf('week')
              .add(weekDay, convertTo as any)
              .hour(hour)
              .minute(minute)
              .toDate();

      return instanceDate >= moment(date).tz(timezoneRegion).startOf('day').toDate()
        ? instanceDate
        : false;
    }

    case 'month': {
      // preserve time portion of date when generating instances
      const dateMoment = moment(date).tz(timezoneRegion);
      const hour = dateMoment.hours();
      const minute = dateMoment.minutes();

      if (dayOfMonth) {
        const instanceDate = moment(date)
          .tz(timezoneRegion)
          .add(index * interval, frequency);

        if (instanceDate.date() !== dayOfMonth) {
          return false;
        }
        return instanceDate.toDate();
      } else if (!isNaN(weekOfMonth) && !isNaN(dayOfWeek)) {
        const nextMonth = moment(date)
          .tz(timezoneRegion)
          .add(index * interval, frequency)
          .toDate();

        let instanceDate;

        if (weekOfMonth === 6) {
          instanceDate = moment(date)
            .tz(timezoneRegion)
            .add(index * interval, frequency)
            .endOf('month');

          for (let i = 0; i < 7; i++) {
            const day = instanceDate.clone().subtract(i, 'day');
            if (day.day() === dayOfWeek) {
              instanceDate = day;
              break;
            }
          }
          instanceDate = instanceDate.hour(hour).minute(minute).toDate();
        } else if (weekOfMonth === 0) {
          instanceDate = moment(date)
            .tz(timezoneRegion)
            .add(index * interval, frequency)
            .startOf('month');

          for (let i = 0; i < 7; i++) {
            const day = instanceDate.clone().add(i, 'day');
            if (day.day() === dayOfWeek) {
              instanceDate = day;
              break;
            }
          }
          instanceDate = instanceDate.hour(hour).minute(minute).toDate();
        } else {
          const nextInstanceDateMonth = moment(date)
            .tz(timezoneRegion)
            .add(index * interval, frequency)
            .startOf('month');

          const endOfNextInstanceMonthDate = nextInstanceDateMonth.clone().endOf('month').date(); // 1 - 31

          let weekOfMonthCounter = 0;
          let instanceDate;

          for (let i = 0; i < endOfNextInstanceMonthDate; i++) {
            const day = nextInstanceDateMonth.clone().add(i, 'day');
            if (day.day() === dayOfWeek) {
              weekOfMonthCounter++;
              if (weekOfMonthCounter === weekOfMonth + 1) {
                instanceDate = day.hour(hour).minute(minute).toDate();
                break;
              }
            }
          }
          return instanceDate || false;
        }

        if (instanceDate.getMonth() !== nextMonth.getMonth()) return false;
        return instanceDate;
      } else {
        return false;
      }
    }

    default: {
      return moment(date)
        .tz(timezoneRegion)
        .add(index * interval, frequency)
        .toDate();
    }
  }
};

export const setProperStartAndEndTime = (
  instanceDateHavingStartTime: Date, // since instance date is now starttime
  scheduleStartTime: Date,
  scheduleEndTime: Date,
  timezoneRegion: string,
) => {
  let startTime;
  let endTime;

  if (scheduleStartTime && scheduleStartTime) {
    startTime = instanceDateHavingStartTime;

    const startTimeMoment = moment(scheduleStartTime).tz(timezoneRegion);
    const endTimeMoment = moment(scheduleEndTime).tz(timezoneRegion);
    const diffMinutes = endTimeMoment.diff(startTimeMoment, 'minutes');

    endTime = moment(startTime).add(diffMinutes, 'minutes').toDate();
  }
  return { startTime, endTime };
};

export const addTimeToDate = (value: number, date: Date, unit: dayjs.ManipulateType) =>
  dayjs(date).add(value, unit).toDate();

export const checkIfFutureDate = (date: Date) => dayjs(date).isAfter(new Date());

export const isSameDate = (prevDate: Date, newDate: Date) => dayjs(prevDate).isSame(newDate);
