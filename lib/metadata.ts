// metadata.ts
/**
 * @module
 *
 * This module contains metadata decorators for NHttp.
 */
import type { TObject, TRet } from "./deps.ts";

/**
 * Shared Metadata for `decorators`.
 */
export class Metadata {
  /**
   * `static` set metadata.
   */
  static set<T = TObject>(data: T) {
    (globalThis as TRet).NHttpMetadata = data;
  }
  /**
   * `static` get metadata.
   */
  static get<T = TObject>(): T {
    return (globalThis as TRet).NHttpMetadata;
  }
  /**
   * `static` init metadata.
   */
  static init(): void {
    if ((globalThis as TRet).NHttpMetadata == null) {
      (globalThis as TRet).NHttpMetadata = {};
    }
  }
}
