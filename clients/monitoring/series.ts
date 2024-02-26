import { IRatio } from '#models/monitoring';
import { IUpdownIODowntimes } from '.';

type ILog = {
  date: Date;
  downtime: number;
  uptime: number;
};

const SECONDS_IN_A_DAY = 3600 * 24;

/**
 * Converts a series of downtime into a series of daily uptimeRatio
 */
export class DailyUptimeRatioConverter {
  private _days: {
    [key: string]: ILog;
  } = {};
  private _from: Date;

  constructor(from: Date) {
    this._from = from;
    for (let i = 0; i < 90; i++) {
      const currentDate = addUTCDay(from, i);
      const key = getDDMMYYYY(currentDate);
      this._days[key] = {
        date: currentDate,
        downtime: 0,
        uptime: 100,
      };
    }
  }

  feed(downtimes: IUpdownIODowntimes[]) {
    for (let i = 0; i < downtimes.length; i++) {
      const downtime = downtimes[i];
      let downStartDate = new Date(downtime.started_at);

      if (downStartDate.getTime() < this._from.getTime()) {
        downStartDate = this._from;
      }

      const nextDay = getUTCNextDay(downStartDate);
      const secondsBeforeNextDay =
        (nextDay.getTime() - downStartDate.getTime()) / 1000;

      const timeSinceDownStartDate = Math.floor(
        (new Date().getTime() - downStartDate.getTime()) / 1000
      );
      const downtimeInSeconds = downtime.duration || timeSinceDownStartDate;

      const downtimeWithinDay = Math.min(
        secondsBeforeNextDay,
        downtimeInSeconds
      );

      this.logDownTime(downStartDate, downtimeWithinDay);

      const isDowntimeOverlappingDays =
        downtimeInSeconds > secondsBeforeNextDay;

      if (isDowntimeOverlappingDays) {
        const remainingDowntime = downtimeInSeconds - downtimeWithinDay;
        const remainingDays = Math.ceil(remainingDowntime / SECONDS_IN_A_DAY);

        for (let day = 1; day <= remainingDays; day++) {
          const isLastDay = day === remainingDays;

          const duration = isLastDay
            ? remainingDowntime % SECONDS_IN_A_DAY
            : SECONDS_IN_A_DAY;

          const logDate = addUTCDay(downStartDate, day);
          this.logDownTime(logDate, duration);
        }
      }
    }
  }

  logDownTime(day: Date, duration: number) {
    const key = getDDMMYYYY(day);

    const currDay = this._days[key];
    currDay.downtime += duration;

    let secondsInDay = SECONDS_IN_A_DAY;

    const toDay = new Date();
    const isToDay = getDDMMYYYY(day) === getDDMMYYYY(toDay);

    if (isToDay) {
      secondsInDay =
        3600 * toDay.getUTCHours() +
        60 * toDay.getUTCMinutes() +
        toDay.getUTCSeconds();
    }

    currDay.uptime = 100 - (currDay.downtime / secondsInDay) * 100;

    this._days[key] = currDay;
  }

  export(): IRatio[] {
    return Object.values(this._days)
      .sort((a, b) => (a.date < b.date ? -1 : 1))
      .map((day) => {
        return {
          ratioNumber: day.uptime,
          date: getDDMMYYYY(day.date),
        };
      });
  }
}

function getDDMMYYYY(d: Date): string {
  return new Intl.DateTimeFormat('fr-FR', { timeZone: 'UTC' }).format(d);
}

function addUTCDay(d: Date, day: number) {
  const logDate = new Date(d);
  logDate.setUTCDate(logDate.getUTCDate() + day);
  return logDate;
}

/**
 *  For a given date, returns the Date of the next UTC day at 00:00:00
 *  ex: 19/07/2021 14:35:00 UTC => 20/07/2021 00:00:00
 *  */
function getUTCNextDay(d: Date): Date {
  const next = new Date(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + 1)
  );
  return next;
}
