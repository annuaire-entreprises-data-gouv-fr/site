import { IRatio } from '#models/monitoring';
import { IMonitorLog } from '.';

interface ILog {
  date: Date;
  downtime: number;
  monitorExists: boolean;
  uptime: number;
}

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

  constructor(from: Date, createdAt: Date) {
    for (let i = 0; i < 90; i++) {
      const currentDate = this.addUTCDay(from, i);
      const key = this.getDDMMYYYY(currentDate);
      this._days[key] = {
        date: currentDate,
        downtime: 0,
        monitorExists: currentDate >= createdAt,
        uptime: 100,
      };
    }
  }

  feed(logs: IMonitorLog[]) {
    for (let i = 0; i < logs.length; i++) {
      const log = logs[i];

      const downStartDate = new Date(log.datetime * 1000);

      const nextDay = this.getUTCNextDay(downStartDate);
      const secondsBeforeNextDay =
        (nextDay.getTime() - downStartDate.getTime()) / 1000;

      const downtimeInSeconds = log.duration;

      const downtimeWithinDay = Math.min(
        secondsBeforeNextDay,
        downtimeInSeconds
      );

      this.logDownTime(downStartDate, downtimeWithinDay);

      const isDowntimeOverlappingDays = log.duration > secondsBeforeNextDay;

      if (isDowntimeOverlappingDays) {
        const remainingDowntime = log.duration - downtimeWithinDay;
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
          ratio: day.uptime.toFixed(2),
          isActive: day.monitorExists,
          date: this.getDDMMYYYY(day.date),
        };
      });
  }
}
