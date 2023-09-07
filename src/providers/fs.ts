
/* IMPORT */

import buffer2uint8 from 'buffer2uint8';
import fs from 'node:fs/promises';
import path from 'node:path';
import ProviderAbstractFs from './abstract_fs';
import type {Dirent, ProviderFsOptions} from '../types';

/* MAIN */

//TODO: Maybe write files atomically

abstract class ProviderFs extends ProviderAbstractFs {

  /* VARIABLES */

  protected path: string;

  /* CONSTRUCTOR */

  constructor ( options: ProviderFsOptions ) {

    super ( options );

    this.path = options.path;

  }

  /* FIlE API */

  protected fileExists ( filePath: string ): Promise<boolean> {

    return fs.access ( filePath ).then ( () => true, () => false );

  }

  protected fileRead ( filePath: string ): Promise<Uint8Array | undefined> {

    return fs.readFile ( filePath ).then ( buffer2uint8, () => undefined );

  }

  protected fileWrite ( filePath: string, content: Uint8Array | string ): Promise<void> {

    const folderPath = path.dirname ( filePath );

    return fs.mkdir ( folderPath, { recursive: true } ).then ( () => fs.writeFile ( filePath, content ) );

  }

  protected fileDelete ( filePath: string ): Promise<boolean> {

    return fs.unlink ( filePath ).then ( () => true, () => false );

  }

  protected fileReaddir ( folderPath: string ): Promise<Dirent[]> {

    return fs.readdir ( folderPath, { withFileTypes: true } ).catch ( () => [] );

  }

}

/* EXPORT */

export default ProviderFs;
