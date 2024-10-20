// Główne typy danych w JSON Schema
type JsonSchemaType = "string" | "number" | "integer" | "boolean" | "object" | "array";

type BulitInJsonSchemaStringFormat = "date" | "time" | "date-time" | "email" | "password" | "duration";

interface JsonSchemaBase {
  type: JsonSchemaType;
}

export interface StringJsonSchema extends JsonSchemaBase {
  type: "string";
  minLength?: number;
  maxLength?: number;
  format?: string | BulitInJsonSchemaStringFormat;
  pattern?: string;
}

export interface NumberJsonSchema extends JsonSchemaBase {
  type: "number" | "integer";
  minimum?: number;
  exclusiveMinimum?: number;

  maximum?: number;
  exclusiveMaximum?: number;
}

export interface BooleanJsonSchema extends JsonSchemaBase {
  type: "boolean";
}

export interface ArrayJsonSchema extends JsonSchemaBase {
  type: "array";
  items: JsonSchemaBase;
  minItems?: number;
  maxItems?: number;
}

export interface ObjectJsonSchema extends JsonSchemaBase {
  type: "object";
  properties: Record<string, JsonSchema>;
  required?: string[];
}

export type JsonSchema =
  | StringJsonSchema
  | NumberJsonSchema
  | BooleanJsonSchema
  | ArrayJsonSchema
  | ObjectJsonSchema;

export class JsonSchemaFactory {
  public static String(options: Pick<StringJsonSchema, "format" | "pattern" | "minLength" | "maxLength"> = {}): StringJsonSchema {
    return {
      type: "string",
      ...options
    };
  }

  public static Number(options: Pick<NumberJsonSchema, "minimum" | "exclusiveMinimum" | "maximum" | "exclusiveMaximum"> = {}): NumberJsonSchema {
    return {
      type: "number",
      ...options
    };
  }

  public static Integer(options: Pick<NumberJsonSchema, "minimum" | "exclusiveMinimum" | "maximum" | "exclusiveMaximum"> = {}): NumberJsonSchema {
    return {
      type: "integer",
      ...options
    };
  }

  public static Boolean(): BooleanJsonSchema {
    return {
      type: "boolean",
    };
  }

  public static Object(properties: Record<string, JsonSchema>, options: Pick<ObjectJsonSchema, "required"> = {}): ObjectJsonSchema {
    return {
      type: "object",
      properties,
      ...options
    };
  }

  public static Array(items: JsonSchema, options: Pick<ArrayJsonSchema, "maxItems" | "minItems"> = {}): ArrayJsonSchema {
    return {
      type: "array",
      items,
      ...options
    };
  }
}