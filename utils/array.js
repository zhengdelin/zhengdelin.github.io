/**
 * @typedef {string|number|symbol} ObjectKeyType
 * @typedef {(...args: any) => any} FunctionWithArgs
 */
/**
 * @template T 要處理的項目的類型。
 * @template [K=any] 返回值的類型，默認為任意型別。
 * @typedef {function(T): K} KeyHandler
 */
/**
 * @template T 要解析的項目的類型。
 * @template K 鍵的類型。
 * @typedef {function(T): K} ResolveHandler
 */
/**
 * @template KeyT 鍵的類型。
 * @template ValueT 值的類型。
 * @typedef {KeyT extends ObjectKeyType ? Record<KeyT, ValueT> : never} MakeRecord
 */
/**
 * @template T 要處理的項目的類型。
 * @template K 處理鍵的函數類型。
 * @template ValueT 值的類型。
 * @typedef {K extends keyof T ? MakeRecord<T[K], ValueT> : K extends FunctionWithArgs ? MakeRecord<ReturnType<K>, ValueT> : never} HandledArray
 */

/**
 * @typedef {MakeRecord<string, number>} A
 */

/**
 * 基於提供的鍵處理函數將一個項目陣列進行分組。
 * @template T 要處理的項目的類型。
 * @template {KeyHandler<T> | keyof T} K 處理鍵的函數類型或項目的屬性名稱。
 * @param {T[]} arr 要分組的項目陣列。
 * @param {K} keyHandlerOrKey 用於提取鍵以進行分組的函數或項目的屬性名稱。
 * @returns {HandledArray<T, K, T[]>} 一個物件，其中鍵是鍵處理函數的結果，值是項目陣列。
 */
export function arrayGroupBy(arr, keyHandlerOrKey) {
  /**
   * @type {KeyHandler<T>}
   */
  const keyHandler = typeof keyHandlerOrKey === "function" ? keyHandlerOrKey : (item) => item[keyHandlerOrKey];
  const group = {};
  for (let i = 0, len = arr.length; i < len; i++) {
    const item = arr[i];
    const key = keyHandler(item);
    group[key] = group[key] || [];
    group[key].push(item);
  }
  return group;
}

/**
 * 將一個陣列轉換為映射，對每個值應用解析處理函數。
 * @template T 要處理的項目的類型。
 * @template K 處理鍵的函數類型或項目的屬性名稱。
 * @template U 值的類型，默認為項目的類型。
 * @param {T[]} arr 要轉換的陣列。
 * @param {K} keyHandlerOrKey 用於提取鍵以進行映射的函數或項目的屬性名稱。
 * @param {ResolveHandler<T, U>} [resolveHandler] 用於解析每個項目的函數，默認為身份函數。
 * @returns {HandledArray<T, K, U>} 一個物件，其中鍵是鍵處理函數的結果，值是解析處理函數的結果。
 */
export function arrayMapBy(arr, keyHandlerOrKey, resolveHandler = (item) => item) {
  const keyHandler = typeof keyHandlerOrKey === "function" ? keyHandlerOrKey : (item) => item[keyHandlerOrKey];
  const map = {};
  for (let i = 0, len = arr.length; i < len; i++) {
    const item = arr[i];
    const key = keyHandler(item);
    map[key] = resolveHandler(item);
  }
  return map;
}

/**
 * Splits an array into smaller arrays of a specified size.
 *
 * @template T
 * @param {T[]} arr - The array to be chunked.
 * @param {number} size - The size of each chunk.
 * @return {T[][]} An array of smaller arrays, each with a maximum length of `size`.
 */
export function arrayChunk(arr, size) {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}
