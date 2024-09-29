import { HDateTime } from '../Domain';

export class CurrentTime {
  public static i: CurrentTime;

  private constNow!: HDateTime | null;

  public get now(): HDateTime {
    return this.constNow ?? HDateTime.now();
  }

  public set now(now: HDateTime | null) {
    this.constNow = now;
  }
}

CurrentTime.i = new CurrentTime();
