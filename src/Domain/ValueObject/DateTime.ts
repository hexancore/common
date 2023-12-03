import { AbstractValueObject, ValueObject } from './ValueObject';
import { OK, R } from '../../Util/Result';
import { DateTimeFormatter, Duration, LocalDateTime, Period, ZoneOffset, ZonedDateTime, convert, nativeJs } from '@js-joda/core';

export type DateTimeRawType = number;

export const DEFAULT_DATE_TIME_FORMAT = DateTimeFormatter.ISO_LOCAL_DATE_TIME;

@ValueObject('Core')
/**
 * DateTime in UTC zone value object
 */
export class DateTime extends AbstractValueObject<DateTime> {
  protected constructor(private readonly value: LocalDateTime) {
    super();
  }

  public static now(): DateTime {
    return new this(LocalDateTime.now(ZoneOffset.UTC).withNano(0));
  }

  public static nowWithNano(): DateTime {
    return new this(LocalDateTime.now(ZoneOffset.UTC));
  }

  /**
   * Creates instance from various primitive value like Date, timestamp or formatted datetime string.
   * @param v
   * @returns instance
   */
  public static c(v: Date | number | string): R<DateTime> {
    if (typeof v === 'number') {
      return this.fromTimestamp(v);
    }

    if (v instanceof Date) {
      return OK(new this(LocalDateTime.from(nativeJs(v, ZoneOffset.UTC))));
    }

    try {
      return OK(new this(LocalDateTime.parse(v)));
    } catch (e) {
      return AbstractValueObject.invalidRaw(DateTime, {
        raw: v,
        msg: 'invalid format: ' + e.message,
      });
    }
  }

  /**
   * Creates instance without extra validation.
   * @param v
   * @returns
   */
  public static cs(v: Date | number | string): DateTime {
    if (typeof v === 'number') {
      return new this(LocalDateTime.ofEpochSecond(v, ZoneOffset.UTC));
    }

    if (v instanceof Date) {
      return new this(LocalDateTime.from(nativeJs(v)));
    }

    return new this(LocalDateTime.parse(v));
  }

  /**
   * Creates from Unix timestamp.
   * @param timestamp
   * @returns
   */
  public static fromTimestamp(timestamp: number): R<DateTime> {
    if (timestamp < 0) {
      return AbstractValueObject.invalidRaw(DateTime, {
        raw: timestamp,
        msg: 'invalid timestamp',
      });
    }
    return OK(new this(LocalDateTime.ofEpochSecond(timestamp, ZoneOffset.UTC)));
  }

  /**
   * Returns native JS-Joda.
   */
  public get v(): LocalDateTime {
    return this.value;
  }

  /**
   * Returns timestamp
   */
  public get t(): number {
    return this.value.toEpochSecond(ZoneOffset.UTC);
  }

  /**
   * Returns new instance with an amount added.
   * @param amount
   * @returns
   */
  public plus(amount: Period | Duration): DateTime {
    return new DateTime(this.value.plus(amount));
  }

  /**
   * Returns new instance with an amount subtracted.
   * @param amount
   * @returns
   */
  public minus(amount: Period | Duration): DateTime {
    return new DateTime(this.value.minus(amount));
  }

  public equals(o: DateTime): boolean {
    return this.value.equals(o.value);
  }

  public isAfter(o: DateTime): boolean {
    return this.value.isAfter(o.value);
  }

  public isBefore(o: DateTime): boolean {
    return this.value.isBefore(o.value);
  }

  public format(format: DateTimeFormatter): string {
    return this.value.format(format);
  }

  public formatDate(): string {
    return this.format(DateTimeFormatter.ISO_LOCAL_DATE);
  }

  public formatTime(): string {
    return this.format(DateTimeFormatter.ISO_LOCAL_TIME);
  }

  public formatDateTime(): string {
    return this.format(DEFAULT_DATE_TIME_FORMAT);
  }

  public toNativeDate(): Date {
    return convert(this.value).toDate();
  }

  public toString(): string {
    return this.formatDateTime();
  }

  public toJSON(): any {
    return this.t;
  }
}
