import * as util from "../src/util"

/* global describe, xit, it, before */
describe("util.allocate", () => {
  xit("should allocate a new pool member", () => {})
  xit("should use a supplied init function", () => {})
  xit("should complain when the pool is full", () => {})
})

describe("utl.free", () => {
  xit("should free a member", () => {})
  xit("should use a supplied clean function", () => {})
  xit("should complain when the argument is not a member", () => {})
  xit("should complain when the member is already free", () => {})
})

describe("util.isAllocated", () => {
  let member1, member2, pool, allocator
  before(() => {
    member1 = "one"
    member2 = "two"
    pool = [member1,member2]
    allocator = [true,false]
  })
  it("should return true if the member is allocated", () => {
    util.isAllocated(pool, allocator, member1).should.be.true()
  })
  it("should return false if the member is not allocated", () => {
    util.isAllocated(pool, allocator, member2).should.be.false()
  })
  it("should complain if the member is not in the pool", () => {
    (() => util.isAllocated(pool, allocator, "nope")).should.throw()
  })
})

describe("util.isIndexAllocated", () => {
  let allocator
  before(() => {
    allocator = [false, true]
  })
  it("should return true if the index refers to an allocated item", () => {
    util.isIndexAllocated(allocator, 1).should.be.true()
  })
  it("should return true if the index refers to an allocated item", () => {
    util.isIndexAllocated(allocator, 1).should.be.true()
  })
  it("should complain if the index is out of bounds", () => {
    (() => util.isIndexAllocated(allocator, -1)).should.throw();
    (() => util.isIndexAllocated(allocator, 2)).should.throw()
  })
})

describe("util.nextIndex", () => {
  let allocator
  before(() => {
    allocator = [true,true,false,true,false,true,false,false]
  })
  it("should find the next avialable index", () => {
    util.nextIndex(allocator).should.eql(2)
    allocator[2] = true
    util.nextIndex(allocator).should.eql(4)
  })
  it("should return -1 if the pool is full", () => {
    allocator.fill(true)
    util.nextIndex(allocator).should.eql(-1)
  })
})
