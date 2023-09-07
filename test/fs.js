
/* IMPORT */

import {describe} from 'fava';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import U8 from 'uint8-encoding';
import FS from '../dist/providers/fs.js';

/* MAIN */

describe ( 'FS', it => {

  it ( 'works', async t => {

    // Instantiation

    const id = Math.random ().toString ( 36 ).slice ( 2 );
    const targetPath = path.join ( os.tmpdir (), id );
    const options = { id, path: targetPath };
    const store = new FS ( options );

    // Get

    t.is ( await store.has ( 'foo' ), false );
    t.is ( await store.get ( 'foo' ), undefined );

    // Set

    await store.set ( 'foo', 'foo_value' );
    await store.set ( 'bar', U8.encode ( 'bar_value' ) );
    await store.set ( 'sub/baz', 'baz_value', { meta: 'baz_metadata' } );

    t.is ( await store.has ( 'foo' ), true );
    t.deepEqual ( await store.get ( 'foo' ), { content: U8.encode ( 'foo_value' ), metadata: undefined } );
    t.deepEqual ( await store.get ( 'foo', 'buffer' ), { content: U8.encode ( 'foo_value' ), metadata: undefined } );
    t.deepEqual ( await store.get ( 'foo', 'utf8' ), { content: 'foo_value', metadata: undefined } );

    t.is ( await store.has ( 'bar' ), true );
    t.deepEqual ( await store.get ( 'bar' ), { content: U8.encode ( 'bar_value' ), metadata: undefined } );
    t.deepEqual ( await store.get ( 'bar', 'buffer' ), { content: U8.encode ( 'bar_value' ), metadata: undefined } );
    t.deepEqual ( await store.get ( 'bar', 'utf8' ), { content: 'bar_value', metadata: undefined } );

    t.is ( await store.has ( 'sub/baz' ), true );
    t.deepEqual ( await store.get ( 'sub/baz' ), { content: U8.encode ( 'baz_value' ), metadata: undefined } );
    t.deepEqual ( await store.get ( 'sub/baz', 'buffer' ), { content: U8.encode ( 'baz_value' ), metadata: undefined } );
    t.deepEqual ( await store.get ( 'sub/baz', 'utf8' ), { content: 'baz_value', metadata: undefined } );

    t.is ( await store.has ( 'sub///baz' ), true );
    t.is ( await store.has ( 'sub\\baz' ), true );
    t.is ( await store.has ( 'sub\\\\baz' ), true );

    t.is ( fs.readFileSync ( path.join ( targetPath, 'foo' ), 'utf8' ), 'foo_value' );
    t.is ( fs.readFileSync ( path.join ( targetPath, 'bar' ), 'utf8' ), 'bar_value' );
    t.is ( fs.readFileSync ( path.join ( targetPath, 'sub/baz' ), 'utf8' ), 'baz_value' );

    // Delete

    t.is ( await store.delete ( 'foo' ), true );
    t.is ( await store.delete ( 'foo2' ), false );

    t.is ( await store.has ( 'foo' ), false );
    t.is ( await store.get ( 'foo' ), undefined );

    t.is ( fs.existsSync ( path.join ( targetPath, 'foo' ) ), false );

    // Keys

    t.deepEqual ( await store.keys (), ['bar', 'sub/baz'] );

    // Values

    t.deepEqual ( await store.values (), [{ content: U8.encode ( 'bar_value' ), metadata: undefined }, { content: U8.encode ( 'baz_value' ), metadata: undefined }] );

    // Entries

    t.deepEqual ( await store.entries (), [['bar', { content: U8.encode ( 'bar_value' ), metadata: undefined }], ['sub/baz', { content: U8.encode ( 'baz_value' ), metadata: undefined }]] );

    // Invalid name

    try {

      new FS ( '👍' );

      t.fail ();

    } catch {

      t.pass ();

    }

  });

});
