export class DateUtil {

  private resetTime(date: Date) {
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
  }

  private resetTimeToEndNight(date: Date) {
    date.setHours(23);
    date.setMinutes(59);
    date.setSeconds(59);
  }

  public getFilterDatetimeToday() {
    const start = new Date();
    this.resetTime(start);

    const end = new Date();
    this.resetTimeToEndNight(end);
    return {
      start: start,
      end: end
    };
  }

  public getFilterDatetimeCurrentMonth() {
    const filter = this.getFilterDatetimeToday();
    filter.start.setDate(1);
    filter.end.setMonth(filter.end.getMonth() + 1);
    filter.end.setDate(0);
    return filter;
  }

  public getFilterDatetimeByDate(date: Date) {
    this.resetTime(date);

    const end = new Date();
    end.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
    this.resetTimeToEndNight(end);
    const filter = {
      start: date,
      end: end
    };

    filter.start.setDate(1);
    filter.end.setMonth(filter.end.getMonth() + 1);
    filter.end.setDate(0);
    return filter;
  }

  public getLastMonthDay() {
    const date = new Date();
    date.setHours(23);
    date.setMinutes(59);
    date.setSeconds(59);
    date.setMonth(date.getMonth() + 1);
    date.setDate(0);
    return date;
  }

  public changeToLastMonthDay( date: Date) {
    date.setMonth(date.getMonth() + 1);
    date.setDate(0);
  }

  public buildDatePicker() {
  }
}
