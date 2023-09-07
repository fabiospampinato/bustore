
/* IMPORT */

import {describe} from 'fava';
import U8 from 'uint8-encoding';
import IndexedDB from '../dist/providers/indexeddb.js';

/* MAIN */

//TODO: Make sure this runs automatically in the browser

describe.skip ( 'IndexedDB', it => {

  it ( 'works', async t => {

    // Instantiation

    const id = Math.random ().toString ( 36 ).slice ( 2 );
    const options = { id };
    const store = new IndexedDB ( options );

    // Get

    t.is ( await store.has ( 'foo' ), false );
    t.is ( await store.get ( 'foo' ), undefined );

    // Set

    await store.set ( 'foo', 'foo_value' );
    await store.set ( 'bar', U8.encode ( 'bar_value' ) );
    await store.set ( 'sub/baz', 'baz_value', { meta: 'baz_metadata' } );

    t.is ( await store.has ( 'foo' ), true );
    t.deepEqual ( await store.get ( 'foo' ), { content: 'foo_value', metadata: undefined } );
    t.deepEqual ( await store.get ( 'foo', 'buffer' ), { content: U8.encode ( 'foo_value' ), metadata: undefined } );
    t.deepEqual ( await store.get ( 'foo', 'utf8' ), { content: 'foo_value', metadata: undefined } );

    t.is ( await store.has ( 'bar' ), true );
    t.deepEqual ( await store.get ( 'bar' ), { content: U8.encode ( 'bar_value' ), metadata: undefined } );
    t.deepEqual ( await store.get ( 'bar', 'buffer' ), { content: U8.encode ( 'bar_value' ), metadata: undefined } );
    t.deepEqual ( await store.get ( 'bar', 'utf8' ), { content: 'bar_value', metadata: undefined } );

    t.is ( await store.has ( 'sub/baz' ), true );
    t.deepEqual ( await store.get ( 'sub/baz' ), { content: 'baz_value', metadata: { meta: 'baz_metadata' } } );
    t.deepEqual ( await store.get ( 'sub/baz', 'buffer' ), { content: U8.encode ( 'baz_value' ), metadata: { meta: 'baz_metadata' } } );
    t.deepEqual ( await store.get ( 'sub/baz', 'utf8' ), { content: 'baz_value', metadata: { meta: 'baz_metadata' } } );

    t.is ( await store.has ( 'sub///baz' ), true );
    t.is ( await store.has ( 'sub\\baz' ), true );
    t.is ( await store.has ( 'sub\\\\baz' ), true );

    // Delete

    t.is ( await store.delete ( 'foo' ), true );
    t.is ( await store.delete ( 'foo2' ), true ); //TODO: This should be "false" for consistency with the other providers, but IndexedDB doesn't throw on deleting non-existing keys

    t.is ( await store.has ( 'foo' ), false );
    t.is ( await store.get ( 'foo' ), undefined );

    // Keys

    t.deepEqual ( await store.keys (), ['bar', 'sub/baz'] );

    // Values

    t.deepEqual ( await store.values (), [{ content: U8.encode ( 'bar_value' ), metadata: undefined }, { content: 'baz_value', metadata: { meta: 'baz_metadata' } }] );

    // Entries

    t.deepEqual ( await store.entries (), [['bar', { content: U8.encode ( 'bar_value' ), metadata: undefined }], ['sub/baz', { content: 'baz_value', metadata: { meta: 'baz_metadata' } }]] );

    // Invalid name

    try {

      new IndexedDB ( '👍' );

      t.fail ();

    } catch {

      t.pass ();

    }

  });

});
