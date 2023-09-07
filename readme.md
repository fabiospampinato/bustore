# Binstore

An isomorphic asynchronous Map-inspired key-value store for persisting blobs.

## Install

```sh
npm install --save binstore
```

## Usage

The following providers are built-in:

```ts
import ProviderAbstract from 'binstore/abstract'; // The most basic abstract provider
import ProviderAbstractFS from 'binstore/abstract-fs'; // The most basic abstract filesystem provider
import ProviderMemory from 'binstore/memory'; // A provider that reads/writes to memory
import ProviderFS from 'binstore/fs'; // A provider that reads/writes to the filesystem
import ProviderIndexedDB from 'binstore/indexeddb'; // A provider that reads/writes to IndexedDB
```

This is how you'd use providers:

```ts
import ProviderMemory from 'binstore/memory';
import ProviderFS from 'binstore/fs';
import ProviderIndexedDB from 'binstore/indexeddb';

// Let's create and manipulate a memory store
// Memory and IndexedDB stores also support optionally storing metadata along witht the blob

type Metadata = {
  something: number
};

const memory = new ProviderMemory<Metadata> ({
  id: 'my-store'
});

memory.has ( 'foo' ); // => Promise<boolean>

memory.set ( 'foo', 'some content' ); // => Promise<void>
memory.set ( 'foo', 'some content', { something: 123 } ); // => Promise<void>
memory.set ( 'bar', new Uint8Array ([ 0, 1, 2, 3 ]), { something: 321 } ); // => Promise<void>

memory.get ( 'foo' ); // => { content: Uint8Array | string, metadata?: Metadata }
memory.get ( 'foo', 'buffer' ); // => { content: Uint8Array, metadata?: Metadata }
memory.get ( 'foo', 'utf8' ); // => { content: string, metadata?: Metadata }

memory.delete ( 'foo' ); // => Promise<boolean>

memory.keys (); // => Promise<string[]>
memory.values (); // => Promise<{ content: Uint8Array | string, metadata?: Metadata }[]>
memory.entries (); // => Promise<[string, { content: Uint8Array | string, metadata?: Metadata }][]>

// Let's create an IndexedDB store
// It has the same exact API as the memory one

const idb = new IndexedDB<Metadata> ({
  id: 'my-store'
});

// Let's create a filesystem store
// The only difference with the others is that it doesn't support storing metadata alongside the blob

const fs = new ProviderFS ({
  id: 'my-store',
  path: '/path/to/store'
});
```

## License

MIT © Fabio Spampinato
