import { LogicError } from "../Error";
import { pascalCaseToSnakeCase } from "../functions";
import type { JsonSerialize } from "../Json/JsonSerialize";
import type { PlainParseError } from "../Plain";
import type { R } from "../Result";
import type { JsonExcluded, JsonObjectType } from "../types";
import type { HFeatureBackendLayer } from "./types";

export type HObjectType<T> = {
  new(...args: any[]): T;
};

export type PlainParsableHObjectType<T, TBase = object> = {
  new(...args: any[]): T;
  parse<T extends TBase>(this: PlainParsableHObjectType<T>, plain: unknown): R<T, PlainParseError>;
};


export type HObjectTypeMetaAware<T> = {
  new(...args: any[]): T;
  HOBJ_META: HObjectTypeMeta;
};

export type AnyHObjectType = HObjectType<any>;

export class HObjectTypeMeta implements JsonSerialize {
  public readonly typeId: string;

  public constructor(
    public readonly feature: string,
    public readonly layer: HFeatureBackendLayer,
    public readonly context: string,
    public readonly kind: string,
    public readonly name: string,
    public readonly typeClass: AnyHObjectType & JsonExcluded,
  ) {
    this.typeId = [
      pascalCaseToSnakeCase(feature),
      layer.toLowerCase(),
      pascalCaseToSnakeCase(context),
      pascalCaseToSnakeCase(kind),
      pascalCaseToSnakeCase(name)
    ].join('.');
  }

  public static application(feature: string, context: string, kind: string, name: string, typeClass: AnyHObjectType): HObjectTypeMeta {
    return new this(feature, 'Application', context, kind, name, typeClass);
  }

  public static domain(feature: string, context: string, kind: string, name: string, typeClass: AnyHObjectType): HObjectTypeMeta {
    return new this(feature, 'Domain', context, kind, name, typeClass);
  }

  public static infrastructure(feature: string, context: string, kind: string, name: string, typeClass: AnyHObjectType): HObjectTypeMeta {
    return new this(feature, 'Infrastructure', context, kind, name, typeClass);
  }

  public static injectToClass(classConstructor: HObjectType<any>, meta: HObjectTypeMeta): void {
    (classConstructor as any).HOBJ_META = meta;
  }

  public static isHObject(obj: any): boolean {
    return obj.constructor.HOBJ_META !== undefined;
  }

  public static extractFromClass(classConstructor: HObjectType<any>): HObjectTypeMeta {
    const meta = (classConstructor as any).HOBJ_META;
    if (!meta) {
      throw new LogicError(`Undefined HObject meta on class: '${classConstructor.name}'`);
    }

    return meta;
  }

  public static extractFromObject(obj: any): HObjectTypeMeta {
    return this.extractFromClass(obj.constructor);
  }

  public toJSON(): JsonObjectType<HObjectTypeMeta> {
    return {
      typeId: this.typeId,
      feature: this.feature,
      layer: this.layer,
      context: this.context,
      kind: this.kind,
      name: this.name,
    };
  }

  public toString(): string {
    return `HObjectMeta[${this.typeId}]`;
  }
}
