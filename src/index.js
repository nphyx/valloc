import {nextIndex, allocate, free, freeIndex, isAllocated, isIndexAllocated} from "./util"
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
    next: {value: (...args) => {
      let member = allocate(pool, allocator, init, ...args)
      used++
      return member
    }},
    indexOf: {value: (member) => pool.indexOf(member)},
    isAllocated: {value: isAllocated.bind(undefined, pool, allocator)},
    isIndexAllocated: {value: isIndexAllocated.bind(undefined, allocator)},
    free: {value: (member) => {
      free(pool, allocator, clean, member)
      used--
    }},
    freeIndex: {value: (index) => {
      freeIndex(pool, allocator, clean, index)
      used--
    }},
    nextIndex: {get: nextIndex.bind(undefined, allocator)},
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
  if (typeof array === "undefined") {
    throw new Error("valloc.from requires an array")
  }
  return vallocFactory(array, defaultCreateOpts.init, defaultCreateOpts.clean)
}

/**
 * Create a new allocator with an internally managed pool
 */
export function create(length, opts = {}) {
  if (!length) {
    throw new Error("valloc.create requires a length")
  }
  length = ~~length; // enforce integer
  const factory = opts.factory || defaultCreateOpts.factory
  const init = opts.init || defaultCreateOpts.init
  const clean = opts.clean || defaultCreateOpts.clean
  let array = new Array(length)
  for (let i = 0; i < length; ++i) {array[i] = factory(i)}

  return vallocFactory(array, init, clean)
}
