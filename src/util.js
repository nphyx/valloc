/**
 * Utility functions used by valloc
 */

/**
 * allocate (stub)
 * @private
 */
export function allocate() {
  throw new Error("unimplemented")
}

/**
 * free (stub)
 * @private
 */
export function free() {
  throw new Error("unimplemented")
}

/**
 * Checks if an item is allocated in a pool.
 * @private
 * @param {Array} pool
 * @param {BooleanArray} allocator
 * @param {mixed} member member to search for
 */
export function isAllocated(pool, allocator, member) {
  let index = pool.indexOf(member)
  if (index === -1) {throw new Error("queried item is not a member of this pool")}
  return allocator[index]
}

/**
 * Checks if a member at a given index is allocated
 * @private
 * @param {BooleanArray} allocator
 * @param {Int} index
 */
export function isIndexAllocated(allocator, index) {
  if (index < 0 || index > allocator.length - 1) {throw new Error("index out of bounds")}
  return allocator[index]
}

/**
 * find next free index
 * @private
 */
export function nextIndex(allocator) {
  for (let i = 0, len = allocator.length; i < len; ++i) {if (!allocator[i]) {return i}}
  return -1
}
