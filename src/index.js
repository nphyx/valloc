import {nextIndex, allocate, free, isAllocated, isIndexAllocated} from "./util"
const defaultCreateOpts = {
  factory: () => ({}),
  init: () => {},
  clean: () => {}
}

Object.freeze(defaultCreateOpts)
function vallocFactory(pool, init, clean) {
  const allocator = new Array(pool.length)
  allocator.fill(false)
  let valloc = {}
  let used = 0
  Object.defineProperties(valloc, {
    next: allocate.bind(undefined, pool, allocator, init, used),
    nextIndex: nextIndex.bind(undefined, allocator),
    indexOf: pool.indexOf.bind(allocator),
    isAllocated: isAllocated.bind(undefined, pool, allocator),
    isIndexAllocated: isIndexAllocated.bind(undefined, allocator),
    free: free.bind(undefined, pool, allocator, clean, used),
    length: {get: () => allocator.length},
    available: {get: () => allocator.length - used},
    used: {get: () => used}
  })
  Object.freeze(valloc)
  return valloc
}

/**
 * Create a new allocator from an array
 * @param
 */
export const from = (array) => {
  if (typeof array === undefined) {throw new Error("valloc.from requires an array")}
  vallocFactory(array)
}

/**
 * Create a new allocator with an internally managed pool
 */
export function create(length, opts = {}) {
  if (!length) {throw new Error("valloc.create requires a length")}
  length = ~~length; // enforce integer
  const factory = opts.factory || defaultCreateOpts.factory
  const init = opts.init || defaultCreateOpts.init
  const clean = opts.create || defaultCreateOpts.create
  let array = new Array(length)
  for (let i = 0; i < length; ++i) {array[i] = factory()}

  return vallocFactory(array, init, clean)
}
