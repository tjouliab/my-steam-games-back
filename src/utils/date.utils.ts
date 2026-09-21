export abstract class DateUtils {
  static parseSteamDate(value: string): Temporal.PlainDate {
    const date = new Date(`${value} UTC`);

    if (Number.isNaN(date.getTime())) return Temporal.Now.plainDateISO();

    return Temporal.PlainDate.from({
      year: date.getUTCFullYear(),
      month: date.getUTCMonth() + 1,
      day: date.getUTCDate(),
    });
  }

  static now(): string {
    return Temporal.Now.instant().toString({ smallestUnit: 'second' });
  }
}
