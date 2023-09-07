
/* IMPORT */

import {normalize} from '../utils';
import ProviderAbstract from './abstract';
import type {Dirent, ProviderAbstractFsOptions, ValueBuffer, ValueString, Value} from '../types';

/* MAIN */

abstract class ProviderAbstractFs extends ProviderAbstract<undefined> {

  /* VARIABLES */

  protected path: string;

  /* CONSTRUCTOR */

  constructor ( options: ProviderAbstractFsOptions ) {

    super ( options );

    this.path = options.path;

  }

  /* PROTECTED API */

  protected join ( rootPath: string, subPath: string ): string {

    return rootPath ? `${rootPath}/${subPath}` : subPath;

  }

  protected readdir ( folderPath: string, getDirents: ( rootPath: string ) => Promise<Dirent[]> ): Promise<string[]> {

    const traverse = async ( folderPath: string, relativePath: string = '', filePaths: string[] = [] ): Promise<string[]> => {

      const dirents = await getDirents ( folderPath );

      for ( const dirent of dirents ) {

        const direntPath = this.join ( folderPath, dirent.name );
        const filePath = this.join ( relativePath, dirent.name );

        if ( dirent.isFile () ) {

          filePaths.push ( filePath );

        } else if ( dirent.isDirectory () ) {

          await traverse ( direntPath, filePath, filePaths );

        }

      }

      return filePaths;

    };

    return traverse ( folderPath );

  };

  protected resolve ( key: string ): string {

    //TODO: Implement this better, accounting for things like `foo/../../bar` also

    const invalidRe = /^\.+([\\\/]|$)/;
    const isInvalid = !key || invalidRe.test ( key );

    if ( isInvalid ) throw new Error ( `Invalid key: "${key}"` );

    return this.join ( this.path, key );

  }

  /* API */

  async delete ( key: string ): Promise<boolean> {

    return this.fileDelete ( this.resolve ( normalize ( key ) ) );

  }

  async get ( key: string, encoding?: undefined ): Promise<Value<undefined> | undefined>;
  async get ( key: string, encoding: 'buffer' ): Promise<ValueBuffer<undefined> | undefined>;
  async get ( key: string, encoding: 'utf8' ): Promise<ValueString<undefined> | undefined>;
  async get ( key: string, encoding?: 'buffer' | 'utf8' | undefined ): Promise<Value<undefined> | undefined>;
  async get ( key: string, encoding?: 'buffer' | 'utf8' | undefined ): Promise<Value<undefined> | undefined> {

    const content = await this.fileRead ( this.resolve ( normalize ( key ) ) );

    if ( !content ) return;

    const metadata = undefined;
    const value = {content, metadata};

    return this.toEncoding ( value, encoding );

  }

  async has ( key: string ): Promise<boolean> {

    return this.fileExists ( this.resolve ( normalize ( key ) ) );

  }

  async set ( key: string, content: Uint8Array | string ): Promise<void> {

    return this.fileWrite ( this.resolve ( normalize ( key ) ), content );

  }

  /* ITERATION API */

  async keys (): Promise<string[]> {

    return this.readdir ( this.path, this.fileReaddir.bind ( this ) );

  }

  async entries ( encoding?: undefined ): Promise<[string, Value<undefined>][]>;
  async entries ( encoding: 'buffer' ): Promise<[string, ValueBuffer<undefined>][]>;
  async entries ( encoding: 'utf8' ): Promise<[string, ValueString<undefined>][]>;
  async entries ( encoding?: 'buffer' | 'utf8' | undefined ): Promise<[string, Value<undefined>][]>;
  async entries ( encoding?: 'buffer' | 'utf8' | undefined ): Promise<[string, Value<undefined>][]> {

    const keys = await this.keys ();
    const values = await Promise.allSettled ( keys.map ( key => this.get ( key ) ) );
    const entries = this.toEntries ( keys, values, encoding );

    return entries;

  }

  /* FIlE API */

  protected abstract fileExists ( filePath: string ): Promise<boolean>;

  protected abstract fileRead ( filePath: string ): Promise<Uint8Array | undefined>;

  protected abstract fileWrite ( filePath: string, content: Uint8Array | string ): Promise<void>;

  protected abstract fileDelete ( filePath: string ): Promise<boolean>;

  protected abstract fileReaddir ( folderPath: string ): Promise<Dirent[]>;

}

/* EXPORT */

export default ProviderAbstractFs;
