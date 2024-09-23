/* eslint-disable @typescript-eslint/no-namespace */

export type ValueRuleTagBase<Meta> = {
  "__hctag"?: Meta;
};

type NumberValueRuleTag<Meta> = number & ValueRuleTagBase<Meta>;

export namespace v {
  export namespace string {
    export type regex<Pattern extends string, Flags extends string = ''> = string & ValueRuleTagBase<'string_regex'>;

    export type length<Length extends number> = string & ValueRuleTagBase<'string_length_exactly'>;
    export namespace length {
      export type min<Min extends number> = string & ValueRuleTagBase<'string_length_min'>;
      export type max<Max extends number> = string & ValueRuleTagBase<'string_length_max'>;
      export type between<Min extends number, Max extends number> = string & ValueRuleTagBase<'string_length_between'>;
    }
  }

  export type float = NumberValueRuleTag<'float'>;
  export namespace float {
    export type min<Min extends number> = NumberValueRuleTag<'float_min'>;
    export type max<Max extends number> = NumberValueRuleTag<'float_max'>;
    export type between<Min extends number, Max extends number> = NumberValueRuleTag<'float_between'>;

    export type gt<V extends number> = NumberValueRuleTag<'float_gt'>;
    export type lt<V extends number> = NumberValueRuleTag<'float_lt'>;
    export type between_exclusive<Min extends number, Max extends number> = NumberValueRuleTag<'float_between_exclusive'>;
  }

  export type int = NumberValueRuleTag<'int'>;
  export namespace int {
    export type min<Min extends number> = NumberValueRuleTag<'int_min'>;
    export type max<Max extends number> = NumberValueRuleTag<'int_max'>;
    export type between<Min extends number, Max extends number> = NumberValueRuleTag<'int_between'>;

    export type between_exclusive<Min extends number, Max extends number> = NumberValueRuleTag<'int_between_exclusive'>;
    export type gt<V extends number> = NumberValueRuleTag<'int_gt'>;
    export type lt<V extends number> = NumberValueRuleTag<'int_lt'>;
  }

  export type uint = number & ValueRuleTagBase<'uint'>;
  export namespace uint {
    export type min<Min extends number> = NumberValueRuleTag<'uint_min'>;
    export type max<Max extends number> = number & ValueRuleTagBase<'uint_max'>;
    export type between<Min extends number, Max extends number> = NumberValueRuleTag<'uint_between'>;

    export type between_exclusive<Min extends number, Max extends number> = NumberValueRuleTag<'uint_between_exclusive'>;
    export type gt<V extends number> = NumberValueRuleTag<'uint_gt'>;
    export type lt<V extends number> = NumberValueRuleTag<'uint_lt'>;
  }

  export namespace items {
    export type exactly<Exactly extends number> = ValueRuleTagBase<'items_exactly'>;
    export type min<Min extends number> = ValueRuleTagBase<'items_min'>;
    export type max<Max extends number> = ValueRuleTagBase<'items_max'>;
    export type between<Min extends number, Max extends number> = ValueRuleTagBase<'items_between'>;
  }
}