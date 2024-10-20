import { Bench } from "tinybench";
import { Uuid } from "@hexancore/common";
import { z } from 'zod';

const bench = new Bench({ time: 3000, iterations: 6, warmupTime: 300 });

const uuidString = "f47ac10b-58cc-4372-a567-0e02b2c3d479";
const base62Value = "7rke2SAWaicSeSYzkhww6R";
const base36Value = "eh20m2rvgvw6snhr754ezwsqh";

const uuid = Uuid.cs(uuidString);

const zodSchema = z.string().uuid();

bench.add('Zod - when valid', () => {
  const tmp = zodSchema.parse(uuidString);
});

bench.add('Uuid - parse when valid', () => {
  const tmp = Uuid.parse(uuidString);
});

bench.add('Uuid - parse when invalid', () => {
  const tmp = Uuid.parse("f47ac10b-58cc-4372-a567-ZZ02b2c3d479");
});

bench.add('Zod - when invalid', () => {
  try {
  const tmp = zodSchema.parse("f47ac10b-58cc-4372-a567-ZZ02b2c3d479");
  // eslint-disable-next-line no-empty
  } catch(e) {

  }
});

bench.add('Uuid - from safe base62', () => {
  const tmp = Uuid.createFromSafeBase62(base62Value);
});

bench.add('Uuid - toBase62', () => {
  const tmp = uuid.toBase62();
});

bench.add('Uuid - from safe base36', () => {
  const tmp = Uuid.createFromSafeBase36(base36Value);
});

bench.add('Uuid - toBase36', () => {
  const tmp = uuid.toBase36();
});

export async function UuidBench(): Promise<void> {
  await bench.warmup();
  await bench.run();

  console.table(bench.table());
}
