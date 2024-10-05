import { Bench } from "tinybench";
import { HDateTime } from "@hexancore/common";

const bench = new Bench({ time: 1000, iterations: 6, warmupTime: 500 });

bench
  .add('HDateTime - valid', () => {
    HDateTime.parse("2024-10-10T12:34:44");
  })
  .add('HDateTime - invalid', () => {
    HDateTime.parse("2024ff-10-10T12:34:44");
  });

export async function ValueObjectBench() {
  await bench.warmup();
  await bench.run();

  console.table(bench.table());
}
