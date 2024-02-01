import { SimpleValueObject, SimpleValueObjectConstructor } from './SimpleValueObject';

export type StringValueConstructor<T extends StringValue<any> = StringValue<any>> = SimpleValueObjectConstructor<T, string>;

export abstract class StringValue<T extends StringValue<any> = any> extends SimpleValueObject<T, string> {}
