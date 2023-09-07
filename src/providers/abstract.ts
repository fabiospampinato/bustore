
/* IMPORT */

import U8 from 'uint8-encoding';
import {isString, isUint8Array, isUndefined} from '../utils';
import type {ProviderAbstractOptions, ValueBuffer, ValueString, Value} from '../types';

/* MAIN */

abstract class ProviderAbstract<T> {

  /* VARIABLES */

  protected id: string;

  /* CONSTRUCTOR */

  constructor ( options: ProviderAbstractOptions ) {

    this.id = options.id;

    if ( !/^[a-zA-Z0-9_-]+$/.test ( this.id ) ) throw new Error ( `Invalid store id: "${this.id}"` );

  }

  /* PROTECTED API */

  protected toEncoding ( value: Value<T>, encoding?: undefined ): Value<T>;
  protected toEncoding ( value: Value<T>, encoding: 'buffer' ): ValueBuffer<T>;
  protected toEncoding ( value: Value<T>, encoding: 'utf8' ): ValueString<T>;
  protected toEncoding ( value: Value<T>, encoding?: 'buffer' | 'utf8' | undefined ): Value<T>;
  protected toEncoding ( value: Value<T>, encoding?: 'buffer' | 'utf8' | undefined ): Value<T> {

    if ( encoding === 'buffer' && isString ( value.content ) ) {

      const content = U8.encode ( value.content );
      const metadata = value.metadata;

      return {content, metadata};

    }

    if ( encoding === 'utf8' && isUint8Array ( value.content ) ) {

      const content = U8.decode ( value.content );
      const metadata = value.metadata;

      return {content, metadata};

    }

    return value;

  }

  protected toEntries ( keys: string[], values: PromiseSettledResult<Value<T> | undefined>[] | Value<T>[], encoding?: undefined ): [string, Value<T>][];
  protected toEntries ( keys: string[], values: PromiseSettledResult<Value<T> | undefined>[] | Value<T>[], encoding: 'buffer' ): [string, ValueBuffer<T>][];
  protected toEntries ( keys: string[], values: PromiseSettledResult<Value<T> | undefined>[] | Value<T>[], encoding: 'utf8' ): [string, ValueString<T>][];
  protected toEntries ( keys: string[], values: PromiseSettledResult<Value<T> | undefined>[] | Value<T>[], encoding?: 'buffer' | 'utf8' | undefined ): [string, Value<T>][];
  protected toEntries ( keys: string[], values: PromiseSettledResult<Value<T> | undefined>[] | Value<T>[], encoding?: 'buffer' | 'utf8' | undefined ): [string, Value<T>][] {

    if ( keys.length !== values.length ) throw new Error ( 'Mismatch between the number of keys and values, bailing out for safety' );

    const entries: [string, Value<T>][] = [];

    for ( let i = 0, l = keys.length; i < l; i++ ) {

      const key = keys[i];
      const val = values[i];
      const value = ( 'status' in val ) ? ( val.status === 'rejected' ? undefined : val.value ) : val;

      if ( isUndefined ( value ) ) continue; // Skipping this one for safety, maybe it got deleted while computing entries

      entries.push ([ key, this.toEncoding ( value, encoding ) ]);

    }

    return entries;

  }

  /* API */

  abstract delete ( key: string ): Promise<boolean>;

  abstract get ( key: string, encoding?: undefined ): Promise<Value<T> | undefined>;
  abstract get ( key: string, encoding: 'buffer' ): Promise<ValueBuffer<T> | undefined>;
  abstract get ( key: string, encoding: 'utf8' ): Promise<ValueString<T> | undefined>;
  abstract get ( key: string, encoding?: 'buffer' | 'utf8' | undefined ): Promise<Value<T> | undefined>;

  abstract has ( key: string ): Promise<boolean>;

  abstract set ( key: string, content: Uint8Array | string, metadata?: T ): Promise<void>;

  /* ITERATION API */

  abstract keys (): Promise<string[]>;

  async values ( encoding?: undefined ): Promise<Value<T>[]>;
  async values ( encoding: 'buffer' ): Promise<ValueBuffer<T>[]>;
  async values ( encoding: 'utf8' ): Promise<ValueString<T>[]>;
  async values ( encoding: 'buffer' | 'utf8' | undefined ): Promise<Value<T>[]>;
  async values ( encoding: 'buffer' | 'utf8' | undefined ): Promise<Value<T>[]> {

    const entries = await this.entries ();
    const values = entries.map ( entry => this.toEncoding ( entry[1], encoding ) );

    return values;

  }

  abstract entries ( encoding?: undefined ): Promise<[string, Value<T>][]>;
  abstract entries ( encoding: 'buffer' ): Promise<[string, ValueBuffer<T>][]>;
  abstract entries ( encoding: 'utf8' ): Promise<[string, ValueString<T>][]>;
  abstract entries ( encoding?: 'buffer' | 'utf8' | undefined ): Promise<[string, Value<T>][]>;

}

/* EXPORT */

export default ProviderAbstract;
