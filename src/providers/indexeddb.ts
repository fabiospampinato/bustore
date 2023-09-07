
/* IMPORT */

import {createStore, del, get, set, keys, values} from 'idb-keyval';
import {normalize} from '../utils';
import ProviderAbstract from './abstract';
import type {UseStore} from 'idb-keyval';
import type {ProviderIndexedDBOptions, ValueBuffer, ValueString, Value} from '../types';

/* MAIN */

class ProviderIndexedDB<T> extends ProviderAbstract<T> {

  /* VARIABLES */

  protected store: UseStore;

  /* CONSTRUCTOR */

  constructor ( options: ProviderIndexedDBOptions ) {

    super ( options );

    this.store = createStore ( `binstore-${options.id}`, 'objects' );

  }

  /* API */

  async delete ( key: string ): Promise<boolean> {

    try {

      await del ( normalize ( key ), this.store );

      return true;

    } catch {

      return false;

    }

  }

  async get ( key: string, encoding?: undefined ): Promise<Value<T> | undefined>;
  async get ( key: string, encoding: 'buffer' ): Promise<ValueBuffer<T> | undefined>;
  async get ( key: string, encoding: 'utf8' ): Promise<ValueString<T> | undefined>;
  async get ( key: string, encoding?: 'buffer' | 'utf8' | undefined ): Promise<Value<T> | undefined>;
  async get ( key: string, encoding?: 'buffer' | 'utf8' | undefined ): Promise<Value<T> | undefined> {

    try {

      const value = await get<Value<T>> ( normalize ( key ), this.store );

      if ( !value ) return;

      return this.toEncoding ( value, encoding );

    } catch {

      return;

    }

  }

  async has ( key: string ): Promise<boolean> {

    return !!await this.get ( normalize ( key ) );

  }

  async set ( key: string, content: Uint8Array | string, metadata?: T ): Promise<void> {

    return set ( normalize ( key ), {content, metadata}, this.store );

  }

  /* ITERATION API */

  async keys (): Promise<string[]> {

    return keys ( this.store );

  }

  async values ( encoding?: undefined ): Promise<Value<T>[]>;
  async values ( encoding: 'buffer' ): Promise<ValueBuffer<T>[]>;
  async values ( encoding: 'utf8' ): Promise<ValueString<T>[]>;
  async values ( encoding: 'buffer' | 'utf8' | undefined ): Promise<Value<T>[]>;
  async values ( encoding: 'buffer' | 'utf8' | undefined ): Promise<Value<T>[]> {

    return ( await values ( this.store ) ).map ( value => this.toEncoding ( value, encoding ) );

  }

  async entries ( encoding?: undefined ): Promise<[string, Value<T>][]>;
  async entries ( encoding: 'buffer' ): Promise<[string, ValueBuffer<T>][]>;
  async entries ( encoding: 'utf8' ): Promise<[string, ValueString<T>][]>;
  async entries ( encoding?: 'buffer' | 'utf8' | undefined ): Promise<[string, Value<T>][]>;
  async entries ( encoding?: 'buffer' | 'utf8' | undefined ): Promise<[string, Value<T>][]> {

    const keys = await this.keys ();
    const values = await Promise.allSettled ( keys.map ( key => this.get ( key ) ) );
    const entries = this.toEntries ( keys, values, encoding );

    return entries;

  }

}

/* EXPORT */

export default ProviderIndexedDB;
