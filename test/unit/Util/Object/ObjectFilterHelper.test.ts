import { ObjectFilterHelper, type ObjectFilter } from "@";

/**
 * @group unit
 */

interface Tag {
  value: string;
}

interface Developer {
  name: string,
  age: number,
  codes: number[],
  tags: Tag[],
  details: { active: boolean; };
}

describe("ObjectFilterHelper", () => {
  describe("find", () => {
    const objects: Record<"alice" | "bob" | "charlie", Developer> = {
      alice: { name: "Alice", age: 30, codes: [1, 2, 3], tags: [{ value: "developer" }, { value: "javascript" }], details: { active: true } },
      bob: { name: "Bob", age: 25, codes: [10], tags: [{ value: "developer" }], details: { active: false } },
      charlie: { name: "Charlie", age: 35, codes: [1, 2, 5], tags: [{ value: "manager" }, { value: "javascript" }], details: { active: true } },
    };
    const data = [
      objects.alice,
      objects.bob,
      objects.charlie
    ];

    test("$eq", () => {
      const where = { age: { $eq: 30 } };
      const current = ObjectFilterHelper.find(data, where);
      expect(current).toMatchSuccessResult([objects.alice]);
    });

    test("$neq", () => {
      const where = { age: { $neq: 30 } };
      const current = ObjectFilterHelper.find(data, where);
      expect(current).toMatchSuccessResult([objects.bob, objects.charlie]);
    });

    test("$gt and $lt", () => {
      const where = { age: { $gt: 25, $lt: 35 } };
      const current = ObjectFilterHelper.find(data, where);
      expect(current).toMatchSuccessResult([objects.alice]);
    });

    test("$in", () => {
      const where = { name: { $in: ["Alice", "Bob"] } };
      const current = ObjectFilterHelper.find(data, where);
      expect(current).toMatchSuccessResult([objects.alice, objects.bob]);
    });

    test("$nin", () => {
      const where = { name: { $nin: ["Alice"] } };
      const current = ObjectFilterHelper.find(data, where);
      expect(current).toMatchSuccessResult([objects.bob, objects.charlie]);
    });

    test("$startsWith", () => {
      const where = { name: { $startsWith: "Al" } };
      const current = ObjectFilterHelper.find(data, where);
      expect(current).toMatchSuccessResult([objects.alice]);
    });

    test("$endsWith", () => {
      const where = { name: { $endsWith: "e" } };
      const current = ObjectFilterHelper.find(data, where);
      expect(current).toMatchSuccessResult([objects.alice, objects.charlie,]);
    });

    test("$contains", () => {
      const where = {
        tags: {
          $some: {
            value: { $contains: "java" }
          }
        }
      };
      const current = ObjectFilterHelper.find(data, where);
      expect(current).toMatchSuccessResult([
        objects.alice,
        objects.charlie,
      ]);
    });

    test("$regex", () => {
      const where = { name: { $regex: /^A/ } };
      const current = ObjectFilterHelper.find(data, where);
      expect(current).toMatchSuccessResult([objects.alice]);
    });

    test("$and", () => {
      const where: ObjectFilter<Developer> = { $and: [{ age: { $gt: 20 } }, { details: { active: { $eq: true } } }] };
      const current = ObjectFilterHelper.find(data, where);
      expect(current).toMatchSuccessResult([
        objects.alice,
        objects.charlie,
      ]);
    });

    test("$or", () => {
      const where = { $or: [{ age: { $lt: 30 } }, { name: { $eq: "Charlie" } }] };
      const current = ObjectFilterHelper.find(data, where);
      expect(current).toMatchSuccessResult([
        objects.bob,
        objects.charlie,
      ]);
    });

    test("$not", () => {
      const where = { $not: [{ age: { $eq: 30 } }] };
      const current = ObjectFilterHelper.find(data, where);
      expect(current).toMatchSuccessResult([
        objects.bob,
        objects.charlie,
      ]);
    });

    test("$some in nested array", () => {
      const where = { tags: { $some: { value: { $eq: "developer" } } } };
      const current = ObjectFilterHelper.find(data, where);
      expect(current).toMatchSuccessResult([
        objects.alice,
        objects.bob,
      ]);
    });

    test("$none in nested array", () => {
      const where = { tags: { $none: { value: { $eq: "manager" } } } };
      const current = ObjectFilterHelper.find(data, where);
      expect(current).toMatchSuccessResult([objects.alice, objects.bob]);
    });

    test("$every in nested array", () => {
      const where = { tags: { $every: { value: { $in: ["developer", "javascript"] } } } };
      const current = ObjectFilterHelper.find(data, where);
      expect(current).toMatchSuccessResult([objects.alice, objects.bob,]);
    });

    test("primitive collection", () => {
      const where: ObjectFilter<Developer> = { codes: { $eq: 1 } };
      const current = ObjectFilterHelper.find(data, where);
      expect(current).toMatchSuccessResult([objects.alice, objects.charlie]);
    });

    test("collecting filter passed collection items", () => {
      const where = { tags: { value: { $in: ["developer"] } } };
      const collected: { item, property, collectionItems; }[] = [];
      const current = ObjectFilterHelper.find(data, where, {
        collectionsItemsCollector(item, property, collectionItems) {
          collected.push({ item, property, collectionItems });
        }
      });

      expect(current).toMatchSuccessResult([objects.alice, objects.bob,]);
      expect(collected).toEqual([
        { item: objects.alice, property: "tags", collectionItems: [objects.alice.tags[0]] },
        { item: objects.bob, property: "tags", collectionItems: [objects.bob.tags[0]] },
      ]);
    });

  });

});
