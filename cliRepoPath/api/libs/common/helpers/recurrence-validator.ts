import { diffUnitMapDayJs, maxCountMap } from '@api/constants/recurring';
import dayjs from 'dayjs';
import moment from 'moment-timezone';
import { RecurrencePatternDTO } from '../dto/input/recurrence-pattern.dto';
import { endTypeEnum, repeatFrequencyEnum } from '../enum/recurrence.enum';
import { isNullOrUndefined } from './genericFunction';
import { BadRequestException } from '@nestjs/common';
import {
  generateInstanceDate,
  setProperStartAndEndTime,
  weekCount,
  weekOfMonth,
} from './date-utils';
import { PartialType } from '@api/modules/auth/types/partial.type';

export type ModalType = 'task' | 'class' | 'appointment';

function modelSpecificInstance(modal: ModalType, data: any, instanceDate: Date) {
  switch (modal) {
    case 'task':
      return {
        taskId: data._id,
        orderNumber: data.orderNumber,
      };

    case 'appointment':
      return {
        appointmentId: data._id,
      };
    default:
  }
}

// Custom comparator function for daysOfWeek
const customSort = (day) => {
  if (day === 0) {
    // Sunday
    return 7; // Move Sunday to the end
  } else if (day === 1) {
    // Monday
    return -1; // Move Monday to the beginning
  } else {
    return day; // Keep other days as they are
  }
};

function getLoopUntilCount(data: any): number {
  const maxCount = Math.ceil(
    maxCountMap[data.recurrencePattern.frequency] / data.recurrencePattern.interval,
  );

  switch (data.recurrencePattern.endType) {
    case endTypeEnum.never:
      return data.recurrencePattern.frequency === repeatFrequencyEnum.week
        ? (data.recurrencePattern?.daysOfWeek?.length || 1) * maxCount
        : maxCount;
    case endTypeEnum.occurrence:
      return maxCount > data.recurrencePattern.endAfterOccurrence
        ? data.recurrencePattern.endAfterOccurrence
        : maxCount;
    case endTypeEnum.date:
      const startDate = dayjs(data.startDate);
      const endDate = dayjs(data.recurrencePattern.endDate);
      let difference = endDate.diff(startDate, diffUnitMapDayJs(data.recurrencePattern.frequency));

      if (data.recurrencePattern.frequency === repeatFrequencyEnum.week) {
        difference = (difference + 1) * +data.recurrencePattern.daysOfWeek.length;
        difference = Math.ceil(difference / data.recurrencePattern.interval) + 1;
      } else {
        difference = Math.ceil(difference + 1 / data.recurrencePattern.interval);
      }

      return maxCount > difference ? difference : maxCount;
  }
}

const getWeekInstance = (data: any, input: any, modal: ModalType, loopUntilCount: number) => {
  const { recurrencePattern } = data;

  const instances: Partial<any>[] = [];

  let counter = 0;
  let weekCounter = 0;

  while (counter < loopUntilCount) {
    const sortedDaysOfWeek = recurrencePattern.daysOfWeek.sort(
      (a, b) => customSort(a) - customSort(b),
    ); // sorts days of week input in a way such that monday is first and sunday is last i.e [1,2,3,4,5,6,0]. required for instance generation logic below to work.

    for (const weekDay of sortedDaysOfWeek) {
      const instanceDate = generateInstanceDate({
        date: input.startDate,
        index: weekCounter,
        interval: recurrencePattern.interval,
        frequency: recurrencePattern.frequency,
        weekDay,
        convertTo: 'day',
        timezoneRegion: input.timezoneRegion,
      });

      if (
        recurrencePattern.endType === endTypeEnum.occurrence &&
        instances.length >= recurrencePattern.endAfterOccurrence
      ) {
        counter++;
        break;
      }

      if (
        recurrencePattern.endType === endTypeEnum.date &&
        instanceDate > recurrencePattern.endDate
      ) {
        counter++;
        break;
      }

      if (instanceDate) {
        counter++;

        const { startTime, endTime } = setProperStartAndEndTime(
          instanceDate,
          input.startTime,
          input.endTime,
          input.timezoneRegion,
        );

        instances.push({
          ...input,
          ...modelSpecificInstance(modal, data, instanceDate),
          instanceDate: instanceDate,
          ...(input.startTime
            ? {
                startTime,
              }
            : {}),
          ...(input.endTime
            ? {
                endTime,
              }
            : {}),
        });
      }

      if (counter >= loopUntilCount) {
        break;
      }
    }

    weekCounter++;
  }

  return instances;
};

const getMonthInstance = (data: any, input: any, modal: ModalType, loopUntilCount: number) => {
  const { recurrencePattern } = data;

  const instances: Partial<any>[] = [];

  let counter = 0;
  let instanceGeneratedCount = 0;
  // for (let counter = 0; counter < loopUntilCount; counter++) {
  while (instanceGeneratedCount < loopUntilCount) {
    const instanceDate = generateInstanceDate({
      date: input.startDate,
      index: counter,
      interval: recurrencePattern.interval,
      frequency: recurrencePattern.frequency,
      dayOfMonth: recurrencePattern.dayOfMonth, // 26 of month date
      weekOfMonth: recurrencePattern.weekOfMonth, //1st 2nd ... last #group1
      dayOfWeek: recurrencePattern.dayOfWeek, //tuesday - 2 #group1,
      timezoneRegion: input.timezoneRegion,
    });

    if (
      recurrencePattern.endType !== endTypeEnum.occurrence &&
      instanceDate > recurrencePattern.endDate
    ) {
      break;
    }

    if (instanceDate) {
      instanceGeneratedCount++;

      const { startTime, endTime } = setProperStartAndEndTime(
        instanceDate,
        input.startTime,
        input.endTime,
        input.timezoneRegion,
      );

      instances.push({
        ...input,
        ...modelSpecificInstance(modal, data, instanceDate),
        instanceDate: instanceDate,
        ...(input.startTime
          ? {
              startTime,
            }
          : {}),
        ...(input.endTime
          ? {
              endTime,
            }
          : {}),
      });
    }

    // increase counter
    counter++;
  }

  return instances;
};

const getDayAndYearInstance = (data: any, input: any, modal: ModalType, loopUntilCount: number) => {
  const { recurrencePattern } = data;

  const instances: Partial<any>[] = [];
  for (let counter = 0; counter < loopUntilCount; counter++) {
    const instanceDate = generateInstanceDate({
      date: input.startDate,
      index: counter,
      interval: recurrencePattern.interval,
      frequency: recurrencePattern.frequency,
      timezoneRegion: input.timezoneRegion,
    });

    if (instanceDate > recurrencePattern.endDate) {
      break;
    }

    const { startTime, endTime } = setProperStartAndEndTime(
      instanceDate,
      input.startTime,
      input.endTime,
      input.timezoneRegion,
    );

    if (instanceDate) {
      instances.push({
        ...input,
        ...modelSpecificInstance(modal, data, instanceDate),
        instanceDate,
        ...(input.startTime
          ? {
              startTime,
            }
          : {}),
        ...(input.endTime
          ? {
              endTime,
            }
          : {}),
      });
    }
  }

  return instances;
};

export const calculateStartEndDate = (input: {
  startDate?: Date;
  isRecurring: boolean;
  recurrencePattern: RecurrencePatternDTO;
}) => {
  const startDate = input?.startDate ? new Date(input.startDate) : new Date();
  let endDate;

  if (!input.isRecurring) {
    return {
      startDate,
      endDate: startDate,
    };
  }

  switch (input.recurrencePattern.endType) {
    case endTypeEnum.never:
      endDate = new Date('9999-12-31');
      break;
    case endTypeEnum.date:
      endDate = new Date(input.recurrencePattern.endDate);
      break;
    case endTypeEnum.occurrence:
      // TODO calculation of end date logic needs update,
      // TODO for now end date is set after instances are generated in classInstanceService.createClassInstances method
      if (input.recurrencePattern.endAfterOccurrence === 1) {
        endDate = input.startDate;
      } else if (input.recurrencePattern.frequency === repeatFrequencyEnum.week) {
        // TODO get end date for week case.
        endDate = dayjs(input.startDate)
          .add(
            input.recurrencePattern.interval *
              Math.ceil(
                input.recurrencePattern.endAfterOccurrence /
                  (input?.recurrencePattern?.daysOfWeek?.length || 1),
              ),
            diffUnitMapDayJs(input.recurrencePattern.frequency) as dayjs.ManipulateType,
          )
          .toDate();
      } else {
        endDate = dayjs(input.startDate)
          .add(
            input.recurrencePattern.interval * input.recurrencePattern.endAfterOccurrence,
            diffUnitMapDayJs(input.recurrencePattern.frequency) as dayjs.ManipulateType,
          )
          .toDate();
      }
      break;
  }

  return {
    startDate: startDate,
    endDate: endDate,
  };
};

export const validateRecurrenceInput = (
  isRecurring,
  recurrencePattern,
  startDate: Date,
  timezoneRegion = 'UTC',
) => {
  if (!isRecurring) return;
  const startDateAccordingToTimezone = moment(startDate).tz(timezoneRegion);

  if (recurrencePattern.frequency === repeatFrequencyEnum.month) {
    if (
      recurrencePattern.dayOfMonth &&
      recurrencePattern.dayOfMonth !== startDateAccordingToTimezone.date()
    ) {
      throw new BadRequestException('Day of month must be equal to start date');
    } else if (!isNullOrUndefined(recurrencePattern.weekOfMonth)) {
      if (recurrencePattern.dayOfWeek !== startDateAccordingToTimezone.day())
        throw new BadRequestException('Day of week must be same as that of start date');

      // if it is last week of month allow either startDate's weekCount or 6(last week of month)
      // weekOfMonth returns 0-5, weekCount returns 1-6
      if (weekOfMonth(startDate) === weekCount(startDate, 0) - 1) {
        const allowedWeekOfMonth = [weekOfMonth(startDate), 6];
        if (!allowedWeekOfMonth.includes(recurrencePattern.weekOfMonth)) {
          throw new BadRequestException(
            `Week of month must be one of following ${allowedWeekOfMonth.join(',')}`,
          );
        }
      } else if (recurrencePattern.weekOfMonth !== weekOfMonth(startDate)) {
        throw new BadRequestException('Week of month must be same as that of start date');
      }
    }
  } else if (recurrencePattern.frequency === repeatFrequencyEnum.year) {
    if (recurrencePattern.dayOfMonth !== startDateAccordingToTimezone.date()) {
      throw new BadRequestException('Day of month must be equal to start date');
    }
    if (recurrencePattern.monthOfYear !== startDate.getMonth()) {
      throw new BadRequestException('Month of year must be equal to start date');
    }
  }
};

export const recurrencePatternValidator = (
  recurrencePattern: PartialType<RecurrencePatternDTO>,
) => {
  const {
    frequency,
    interval,
    endType,
    dayOfWeek,
    daysOfWeek,
    dayOfMonth,
    weekOfMonth,
    monthOfYear,
    endDate,
    endAfterOccurrence,
  } = recurrencePattern;

  let filteredData: any = {
    frequency,
    interval,
    endType,
  };

  switch (recurrencePattern.frequency) {
    case repeatFrequencyEnum.week:
      filteredData = {
        ...filteredData,
        daysOfWeek: [...daysOfWeek],
      };
      break;

    case repeatFrequencyEnum.month:
      filteredData = {
        ...filteredData,
        ...(dayOfMonth ? { dayOfMonth } : { weekOfMonth, dayOfWeek }),
      };
      break;

    case repeatFrequencyEnum.year:
      filteredData = {
        ...filteredData,
        dayOfMonth,
        monthOfYear,
      };
      break;
  }

  switch (recurrencePattern.endType) {
    case endTypeEnum.date:
      filteredData = {
        ...filteredData,
        endDate,
      };
      break;

    case endTypeEnum.occurrence:
      filteredData = {
        ...filteredData,
        endAfterOccurrence,
      };
      break;
  }

  return filteredData;
};

export const recurrenceInstance = (
  data: any,
  input: any,
  modal: ModalType,
  extraInstances = 0, // needed for cron job
): Partial<any>[] => {
  const { recurrencePattern } = data;
  // const loopUntilCount = getLoopUntilCount(data);
  let loopUntilCount = getLoopUntilCount(input);

  if (extraInstances) {
    loopUntilCount = loopUntilCount + extraInstances;
  }

  switch (recurrencePattern.frequency) {
    case repeatFrequencyEnum.week:
      return getWeekInstance(data, input, modal, loopUntilCount);
    case repeatFrequencyEnum.month:
      return getMonthInstance(data, input, modal, loopUntilCount);
    case repeatFrequencyEnum.year:
      return getDayAndYearInstance(data, input, modal, loopUntilCount);
    case repeatFrequencyEnum.day:
      return getDayAndYearInstance(data, input, modal, loopUntilCount);
    default:
      throw new Error('Invalid frequency');
  }
};

export const hasRecurrencePatternChanged = (oldPattern, newPattern) => {
  if (!oldPattern || !newPattern) return false;

  if (oldPattern.frequency !== newPattern.frequency) {
    return true;
  }
  if (oldPattern.interval !== newPattern.interval) {
    return true;
  }

  if (
    oldPattern.frequency === 'week' &&
    newPattern.frequency === oldPattern.frequency &&
    !(
      oldPattern?.daysOfWeek?.length === newPattern?.daysOfWeek?.length &&
      oldPattern.daysOfWeek?.every((day) => newPattern?.daysOfWeek?.includes(day))
    )
  ) {
    return true;
  }

  if (oldPattern.frequency === 'month' && newPattern.frequency === oldPattern.frequency) {
    if (
      oldPattern.dayOfMonth !== newPattern.dayOfMonth ||
      oldPattern.weekOfMonth != newPattern.weekOfMonth
    ) {
      return true;
    }
  }

  if (oldPattern.endType !== newPattern.endType) return true;

  if (oldPattern.endAfterOccurrence != newPattern.endAfterOccurrence) return true;

  if (
    oldPattern.endType === endTypeEnum.date &&
    oldPattern.endDate?.getTime() !== newPattern.endDate?.getTime()
  )
    return true;

  return false;
};
