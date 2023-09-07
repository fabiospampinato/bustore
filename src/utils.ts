
/* MAIN */

const isString = ( value: unknown ): value is string => {

  return typeof value === 'string';

};

const isUint8Array = ( value: unknown ): value is Uint8Array => {

  return value instanceof Uint8Array;

};

const isUndefined = ( value: unknown ): value is undefined => {

  return value === undefined;

};

const normalize = (() => {

  const backslashRe = /\\+|\/+/g;

  return ( key: string ): string => {

    return key.replace ( backslashRe, '/' );

  };

})();

/* EXPORT */

export {isString, isUint8Array, isUndefined, normalize};
