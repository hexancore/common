import { AbstractValueObject, type AnyValueObject, type ValueObjectType } from './AbstractValueObject';
import { OK, R } from '../../Util/Result';
import { DateTimeFormatter, Duration, Instant, LocalDateTime, Period, ZoneId, ZoneOffset, convert } from '@js-joda/core';
import { HObjectTypeMeta, InvalidStringPlainParseIssue, InvalidTypePlainParseIssue, PlainParseHelper, TooSmallPlainParseIssue, type PlainParseError } from "../../Util";

export const DEFAULT_DATE_TIME_FORMAT = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");

function createJsJodaFromString(v: string): LocalDateTime {
  if (!v.includes("T")) {
    if (v.includes(" ")) {
      v = v.replace(" ", "T");
    } else {
      v += "T00:00:00";
    }
  }
  v = v.includes("Z") ? v : v + "Z";
  return LocalDateTime.ofInstant(Instant.parse(v), ZoneId.UTC);
}

function createJsJodaFromDate(v: Date): LocalDateTime {
  return LocalDateTime.ofInstant(Instant.parse(v.toISOString()), ZoneId.UTC);
}

function createJsJodaFromTimestamp(v: number): LocalDateTime {
  return LocalDateTime.ofEpochSecond(v, ZoneOffset.UTC);
}

/**
 * DateTime in UTC zone value object
 */
export class HDateTime extends AbstractValueObject<HDateTime> {
  public static readonly HOBJ_META = HObjectTypeMeta.domain('Core', 'Core', 'ValueObject', 'HDateTime', HDateTime);

  public constructor(private readonly value: LocalDateTime) {
    super();
  }

  public static now(): HDateTime {
    return new this(LocalDateTime.now(ZoneOffset.UTC).withNano(0));
  }

  public static nowWithNano(): HDateTime {
    return new this(LocalDateTime.now(ZoneOffset.UTC));
  }

  public static parse<T extends AnyValueObject>(this: ValueObjectType<T>, plain: unknown): R<T, PlainParseError> {
    switch (typeof plain) {
      case 'number': return HDateTime.fromTimestamp(plain) as any;
      case 'string':
        try {
          return OK(new this(createJsJodaFromString(plain)));
        } catch (e) {
          return PlainParseHelper.HObjectParseErr(HDateTime, [
            new InvalidStringPlainParseIssue('datetime', {}, 'Given plain string is not valid datetime')
          ]) as any;
        }
    }

    if (plain instanceof Date) {
      return OK(new this(createJsJodaFromDate(plain)));
    }

    return PlainParseHelper.HObjectParseErr(HDateTime, [
      new InvalidTypePlainParseIssue(["number", "string", "Date"], typeof plain)
    ]) as any;
  }

  /**
   * Creates instance without extra validation.
   * @param v
   * @returns
   */
  public static cs(v: Date | number | string): HDateTime {
    if (typeof v === 'number') {
      return new this(createJsJodaFromTimestamp(v));
    }

    if (v instanceof Date) {
      return new this(createJsJodaFromDate(v));
    }

    return new this(createJsJodaFromString(v));
  }

  /**
   * Creates from Unix timestamp.
   * @param timestamp
   * @returns
   */
  public static fromTimestamp(timestamp: number): R<HDateTime, PlainParseError> {
    timestamp = Math.trunc(timestamp);
    if (timestamp < 0) {
      return PlainParseHelper.HObjectParseErr(HDateTime, [
        TooSmallPlainParseIssue.numberGTE(0, timestamp)
      ]);
    }
    return OK(new HDateTime(createJsJodaFromTimestamp(timestamp)));
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
  public plus(amount: Period | Duration): HDateTime {
    return new HDateTime(this.value.plus(amount));
  }

  /**
   * Returns new instance with an amount subtracted.
   * @param amount
   * @returns
   */
  public minus(amount: Period | Duration): HDateTime {
    return new HDateTime(this.value.minus(amount));
  }

  public equals(o: HDateTime): boolean {
    return this.value.equals(o.value);
  }

  public isAfter(o: HDateTime): boolean {
    return this.value.isAfter(o.value);
  }

  public isBefore(o: HDateTime): boolean {
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

  public formatRfc1123(): string {
    return this.toNativeDate().toUTCString();
  }

  public toNativeDate(): Date {
    return convert(this.value, ZoneId.UTC).toDate();
  }

  public toString(): string {
    return this.formatDateTime();
  }

  public toJSON(): number {
    return this.t;
  }
}