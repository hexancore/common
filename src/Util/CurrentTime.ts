import { DateTime } from '../Domain';

export class CurrentTime {
  public static i: CurrentTime;

  private constNow!: DateTime|null;

  public get now(): DateTime {
    return this.constNow ?? DateTime.now();
  }

  public set now(now: DateTime | null) {
    this.constNow = now;
  }
}

CurrentTime.i = new CurrentTime();
