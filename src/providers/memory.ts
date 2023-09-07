
/* IMPORT */

import {normalize} from '../utils';
import ProviderAbstract from './abstract';
import type {ValueBuffer, ValueString, Value} from '../types';

/* MAIN */

class ProviderMemory<T> extends ProviderAbstract<T> {

  /* VARIABLES */

  protected store: Map<string, Value<T>> = new Map ();

  /* API */

  async delete ( key: string ): Promise<boolean> {

    return this.store.delete ( normalize ( key ) );

  }

  async get ( key: string, encoding?: undefined ): Promise<Value<T> | undefined>;
  async get ( key: string, encoding: 'buffer' ): Promise<ValueBuffer<T> | undefined>;
  async get ( key: string, encoding: 'utf8' ): Promise<ValueString<T> | undefined>;
  async get ( key: string, encoding?: 'buffer' | 'utf8' | undefined ): Promise<Value<T> | undefined>;
  async get ( key: string, encoding?: 'buffer' | 'utf8' | undefined ): Promise<Value<T> | undefined> {

    const value = this.store.get ( normalize ( key ) );

    if ( !value ) return;

    return this.toEncoding ( value, encoding );

  }

  async has ( key: string ): Promise<boolean> {

    return this.store.has ( normalize ( key ) );

  }

  async set ( key: string, content: Uint8Array | string, metadata?: T ): Promise<void> {

    this.store.set ( normalize ( key ), {content, metadata} );

  }

  /* ITERATION API */

  async keys (): Promise<string[]> {

    return [...this.store.keys ()];

  }

  async values ( encoding?: undefined ): Promise<Value<T>[]>;
  async values ( encoding: 'buffer' ): Promise<ValueBuffer<T>[]>;
  async values ( encoding: 'utf8' ): Promise<ValueString<T>[]>;
  async values ( encoding: 'buffer' | 'utf8' | undefined ): Promise<Value<T>[]>;
  async values ( encoding: 'buffer' | 'utf8' | undefined ): Promise<Value<T>[]> {

    return [...this.store.values ()].map ( value => this.toEncoding ( value, encoding ) );

  }

  async entries ( encoding?: undefined ): Promise<[string, Value<T>][]>;
  async entries ( encoding: 'buffer' ): Promise<[string, ValueBuffer<T>][]>;
  async entries ( encoding: 'utf8' ): Promise<[string, ValueString<T>][]>;
  async entries ( encoding?: 'buffer' | 'utf8' | undefined ): Promise<[string, Value<T>][]>;
  async entries ( encoding?: 'buffer' | 'utf8' | undefined ): Promise<[string, Value<T>][]> {

    const keys = [...this.store.keys ()];
    const values = [...this.store.values ()];
    const entries = this.toEntries ( keys, values, encoding );

    return entries;

  }

}

/* EXPORT */

export default ProviderMemory;
