
/* MAIN */

type Dirent = {
  name: string,
  isDirectory: () => boolean,
  isFile: () => boolean
};

type Provider<T> = import ( './providers/abstract' ).default<T>;

type ProviderAbstractOptions = {
  id: string
};

type ProviderAbstractFsOptions = ProviderAbstractOptions & {
  path: string
};

type ProviderMemoryOptions = ProviderAbstractOptions;

type ProviderFsOptions = ProviderAbstractFsOptions;

type ProviderIndexedDBOptions = ProviderAbstractOptions;

type ProviderMultiOptions<T> = ProviderAbstractOptions & {
  read: Provider<T>[]
  write: Provider<T>
};

type ValueBuffer<T = unknown> = {
  content: Uint8Array,
  metadata?: T
};

type ValueString<T = unknown> = {
  content: string,
  metadata?: T
};

type Value<T = unknown> ={
  content: Uint8Array | string,
  metadata?: T
};

/* EXPORT */

export type {Dirent};
export type {Provider, ProviderAbstractOptions, ProviderAbstractFsOptions, ProviderMemoryOptions, ProviderFsOptions, ProviderIndexedDBOptions, ProviderMultiOptions};
export type {ValueBuffer, ValueString, Value};
