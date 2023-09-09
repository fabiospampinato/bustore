
/* IMPORT */

import {isUndefined, normalize} from '../utils';
import ProviderAbstract from './abstract';
import type {Provider, ProviderMultiOptions, ValueBuffer, ValueString, Value} from '../types';

/* MAIN */

class ProviderMulti<T = never> extends ProviderAbstract<T> {

  /* VARIABLES */

  protected read: Provider<T>[];
  protected write: Provider<T>;

  /* CONSTRUCTOR */

  constructor ( options: ProviderMultiOptions<T> ) {

    super ( options );

    this.read = options.read;
    this.write = options.write;

  }

  /* API */

  async delete ( key: string ): Promise<boolean> {

    let deleted = false;

    for ( const provider of this.read ) {

      deleted = await provider.delete ( normalize ( key ) ) || deleted;

    }

    return deleted;

  }

  async get ( key: string, encoding?: undefined ): Promise<Value<T> | undefined>;
  async get ( key: string, encoding: 'buffer' ): Promise<ValueBuffer<T> | undefined>;
  async get ( key: string, encoding: 'utf8' ): Promise<ValueString<T> | undefined>;
  async get ( key: string, encoding?: 'buffer' | 'utf8' | undefined ): Promise<Value<T> | undefined>;
  async get ( key: string, encoding?: 'buffer' | 'utf8' | undefined ): Promise<Value<T> | undefined> {

    for ( const provider of this.read ) {

      const value = await provider.get ( normalize ( key ), encoding );

      if ( isUndefined ( value ) ) continue;

      return value;

    }

  }

  async has ( key: string ): Promise<boolean> {

    for ( const provider of this.read ) {

      const has = await provider.has ( normalize ( key ) );

      if ( has ) return true;

    }

    return false;

  }

  async set ( key: string, content: Uint8Array | string, metadata?: T ): Promise<void> {

    return this.write.set ( normalize ( key ), content, metadata );

  }

  /* ITERATION API */

  async keys (): Promise<string[]> {

    throw new Error ( 'The "multi" provider does not support iteration' );

  }

  async values ( encoding?: undefined ): Promise<Value<T>[]>;
  async values ( encoding: 'buffer' ): Promise<ValueBuffer<T>[]>;
  async values ( encoding: 'utf8' ): Promise<ValueString<T>[]>;
  async values ( encoding: 'buffer' | 'utf8' | undefined ): Promise<Value<T>[]>;
  async values ( encoding: 'buffer' | 'utf8' | undefined ): Promise<Value<T>[]> {

    throw new Error ( 'The "multi" provider does not support iteration' );

  }

  async entries ( encoding?: undefined ): Promise<[string, Value<T>][]>;
  async entries ( encoding: 'buffer' ): Promise<[string, ValueBuffer<T>][]>;
  async entries ( encoding: 'utf8' ): Promise<[string, ValueString<T>][]>;
  async entries ( encoding?: 'buffer' | 'utf8' | undefined ): Promise<[string, Value<T>][]>;
  async entries ( encoding?: 'buffer' | 'utf8' | undefined ): Promise<[string, Value<T>][]> {

    throw new Error ( 'The "multi" provider does not support iteration' );

  }

}

/* EXPORT */

export default ProviderMulti;
