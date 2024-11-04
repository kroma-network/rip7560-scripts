/* tslint:disable */
/* eslint-disable */
/**
 * @returns {Keys}
 */
export function keypair(): Keys;
/**
 * @param {Uint8Array} seed
 * @returns {Keys}
 */
export function keypair_derive(seed: Uint8Array): Keys;
/**
 * @param {Uint8Array} sig
 * @param {Uint8Array} msg
 * @param {Uint8Array} public_key
 * @returns {boolean}
 */
export function verify(sig: Uint8Array, msg: Uint8Array, public_key: Uint8Array): boolean;
export class Keys {
  free(): void;
  constructor();
  /**
   * @param {Uint8Array} seed
   * @returns {Keys}
   */
  static derive(seed: Uint8Array): Keys;
  /**
   * @param {Uint8Array} msg
   * @param {boolean} random
   * @returns {Uint8Array}
   */
  sign_bytes(msg: Uint8Array, random: boolean): Uint8Array;
  /**
   * @param {Uint8Array} msg
   * @param {boolean} random
   * @returns {string}
   */
  sign_json(msg: Uint8Array, random: boolean): string;
  /**
   * @returns {string}
   */
  pk_json(): string;
  /**
   * @returns {string}
   */
  expanded_pk_json(): string;
  readonly pubkey: Uint8Array;
  readonly secret: Uint8Array;
}
export class Params {
  free(): void;
  static readonly publicKeyBytes: number;
  static readonly secretKeyBytes: number;
  static readonly signBytes: number;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_keys_free: (a: number, b: number) => void;
  readonly keypair: () => number;
  readonly keypair_derive: (a: number, b: number) => number;
  readonly keys_pubkey: (a: number, b: number) => void;
  readonly keys_secret: (a: number, b: number) => void;
  readonly keys_sign_bytes: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly keys_sign_json: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly keys_pk_json: (a: number, b: number) => void;
  readonly keys_expanded_pk_json: (a: number, b: number) => void;
  readonly verify: (a: number, b: number, c: number, d: number, e: number, f: number) => number;
  readonly __wbg_params_free: (a: number, b: number) => void;
  readonly __wbg_get_params_publicKeyBytes: (a: number) => number;
  readonly __wbg_get_params_secretKeyBytes: (a: number) => number;
  readonly __wbg_get_params_signBytes: (a: number) => number;
  readonly params_publicKeyBytes: () => number;
  readonly params_secretKeyBytes: () => number;
  readonly params_signBytes: () => number;
  readonly keys_new: () => number;
  readonly keys_derive: (a: number, b: number) => number;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
  readonly __wbindgen_free: (a: number, b: number, c: number) => void;
  readonly __wbindgen_exn_store: (a: number) => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
*
* @returns {InitOutput}
*/
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
