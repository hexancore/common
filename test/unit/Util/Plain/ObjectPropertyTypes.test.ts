import type { v } from '@/Util/Plain/types';
import path from 'node:path';

class Super {
  public constructor(
    public stringPatternField: v.string.regex<'^[A-Z][a-zA-Z]{4}$'>,

    public stringLengthField: v.string.length<10>,
    public stringMinField: v.string.length.min<10>,
    public stringMaxField: v.string.length.max<10>,
    public stringBetweenField: v.string.length.between<10, 50>,

    public intField: v.int,

    public intMinField: v.int.min<-10>,
    public intMaxField: v.int.max<100>,
    public intBetweenField: v.int.between<-10, 100>,

    public intLtField: v.int.lt<-10>,
    public intGtField: v.int.gt<100>,
    public intBetweenExclusiveField: v.int.between_exclusive<-10, 100>,

    public uintField: v.uint,

    public uintMinField: v.uint.min<10>,
    public uintMaxField: v.uint.max<100>,
    public uintBetweenField: v.uint.between<10, 100>,

    public uintLtField: v.uint.lt<10>,
    public uintGtField: v.uint.gt<100>,
    public uintBetweenExclusiveField: v.uint.between_exclusive<10, 100>,

    public floatField: v.float,
    public floatMinField: v.float.min<-1.5>,
    public floatMaxField: v.float.max<2.5>,
    public floatBetweenField: v.float.between<-1.5, 2.5>,

    public floatLtField: v.float.lt<-1.5>,
    public floatGtField: v.float.gt<2.5>,
    public floatBetweenExclusiveField: v.float.between_exclusive<-1.5, 2.5>,

    public intArray10: v.int.between<10, 100>[] & v.items.exactly<10>,
    public intArrayMin: v.int.between<10, 100>[] & v.items.min<10>,
    public intArrayMax: v.int.between<10, 100>[] & v.items.max<10>,
    public intArrayBetween: v.int.between<10, 100>[] & v.items.between<10, 20>,

    public intMap10: Map<string, v.int.between<10, 100>> & v.items.min<10>,
  ) {

  }
}

/**
 * @group unit
 */

describe(path.basename(__filename, '.test.ts'), () => {
  test('HObjectParseErr', () => {
    expect(1).toBe(1);
  });
});