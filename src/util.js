/**
 * Utility functions used by valloc
 */

/**
 * allocate a free member by index
 * @private
 */
export function allocateIndex(pool, allocator, init, index, ...args) {
  if (allocator[index]) {
    throw new Error("member at given index is already allocated")
  }
  if (index >= pool.length) {
    throw new Error("requested allocator index is out of bounds")
  }
  let member = pool[index]
  allocator[index] = true
  init(member, ...args)
  return member
}

/**
 * allocate a free member
 * @private
 */
export function allocate(pool, allocator, init, ...args) {
  let index = nextIndex(allocator)
  if (index === -1) {
    throw new Error("pool is full")
  }
  return allocateIndex(pool, allocator, init, index, ...args)
}

/**
 * free member at index
 * @private
 */
export function freeIndex(pool, allocator, clean, index) {
  if (!allocator[index]) {
    throw new Error("member was not allocated when freed")
  }
  clean(pool[index])
  allocator[index] = false
}

/**
 * free member
 * @private
 */
export function free(pool, allocator, clean, member) {
  let index = pool.indexOf(member)
  if (index === -1) {
    throw new Error("item is not a member of the pool")
  }
  freeIndex(pool, allocator, clean, index)
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
