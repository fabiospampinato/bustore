
/* IMPORT */

import {describe} from 'fava';
import U8 from 'uint8-encoding';
import Memory from '../dist/providers/memory.js';
import Multi from '../dist/providers/multi.js';

/* MAIN */

describe ( 'Muti', it => {

  it ( 'works', async t => {

    // Instantiation

    const id = Math.random ().toString ( 36 ).slice ( 2 );
    const backend1 = new Memory ({ id: 'backend1' });
    const backend2 = new Memory ({ id: 'backend2' });
    const options = { id, read: [backend1, backend2], write: backend2 };
    const store = new Multi ( options );

    // Get

    t.is ( await store.has ( 'foo' ), false );
    t.is ( await store.get ( 'foo' ), undefined );

    // Set

    await store.set ( 'foo', 'foo_value' );

    t.is ( await store.has ( 'foo' ), true );
    t.deepEqual ( await store.get ( 'foo' ), { content: 'foo_value', metadata: undefined } );
    t.deepEqual ( await store.get ( 'foo', 'buffer' ), { content: U8.encode ( 'foo_value' ), metadata: undefined } );
    t.deepEqual ( await store.get ( 'foo', 'utf8' ), { content: 'foo_value', metadata: undefined } );

    t.is ( await backend1.has ( 'foo' ), false );
    t.is ( await backend2.has ( 'foo' ), true );

    // Delete

    t.is ( await store.delete ( 'foo' ), true );
    t.is ( await store.delete ( 'foo2' ), false );

    t.is ( await store.has ( 'foo' ), false );
    t.is ( await store.get ( 'foo' ), undefined );

    // Keys

    await t.throwsAsync ( () => store.keys (), { message: 'The "multi" provider does not support iteration' } );

    // Values

    await t.throwsAsync ( () => store.values (), { message: 'The "multi" provider does not support iteration' } );

    // Entries

    await t.throwsAsync ( () => store.entries (), { message: 'The "multi" provider does not support iteration' } );

    // Invalid name

    t.throws ( () => new Multi ({ id: '👍' }), { message: 'Invalid store id: "👍"' } );

  });

});
