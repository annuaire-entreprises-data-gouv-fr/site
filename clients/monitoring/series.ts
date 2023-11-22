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

  getDDMMYYYY = (d: Date): string =>
    new Intl.DateTimeFormat('fr-FR', { timeZone: 'UTC' }).format(d);

  constructor(from: Date) {
    for (let i = 0; i < 90; i++) {
      const currentDate = this.addUTCDay(from, i);
      const key = this.getDDMMYYYY(currentDate);
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

      const downStartDate = new Date(downtime.started_at);

      const nextDay = this.getUTCNextDay(downStartDate);
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

          const logDate = this.addUTCDay(downStartDate, day);
          this.logDownTime(logDate, duration);
        }
      }
    }
  }

  logDownTime(day: Date, duration: number) {
    const key = this.getDDMMYYYY(day);
    const currDay = this._days[key];
    currDay.downtime += duration;

    let secondsInDay = SECONDS_IN_A_DAY;

    const toDay = new Date();
    const isToDay = this.getDDMMYYYY(day) === this.getDDMMYYYY(toDay);

    if (isToDay) {
      secondsInDay =
        3600 * toDay.getUTCHours() +
        60 * toDay.getUTCMinutes() +
        toDay.getUTCSeconds();
    }

    currDay.uptime = 100 - (currDay.downtime / secondsInDay) * 100;

    this._days[key] = currDay;
  }

  /**
   *  For a given date, returns the Date of the next UTC day at 00:00:00
   *  ex: 19/07/2021 14:35:00 UTC => 20/07/2021 00:00:00
   *  */
  getUTCNextDay = (d: Date): Date => {
    const next = new Date(
      Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + 1)
    );
    return next;
  };

  addUTCDay = (d: Date, day: number) => {
    const logDate = new Date(d);
    logDate.setUTCDate(logDate.getUTCDate() + day);
    return logDate;
  };

  export(): IRatio[] {
    return Object.values(this._days)
      .sort((a, b) => (a.date < b.date ? -1 : 1))
      .map((day) => {
        return {
          ratioNumber: day.uptime,
          date: this.getDDMMYYYY(day.date),
        };
      });
  }
}
