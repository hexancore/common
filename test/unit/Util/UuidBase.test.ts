/**
 * @group unit
 */

import { Base36, Base62 } from "@/Util/UuidBase";

describe("UuidBase", () => {
  const uuid = "123e4567-e89b-12d3-a456-426614174000";

  describe("Base62", () => {
    test("encode", () => {
      const current = Base62.encode(uuid);
      expect(current).toEqual("yqjPyWuWVBAloWtuR4THa");
    });

    test("decode", () => {
      const current = Base62.decode(Base62.encode(uuid)!);
      expect(current).toEqual(uuid);
    });
  });

  describe("Base36", () => {
    test("encode", () => {
      const current = Base36.encode(uuid);
      expect(current).toEqual("12vqjrnxk8whv3i8qi6qgrlz4");
    });

    test("decode", () => {
      const current = Base36.decode(Base36.encode(uuid)!);
      expect(current).toEqual(uuid);
    });
  });

});
