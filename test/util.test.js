import * as util from "../src/util"

/* global describe, xit, it, before */
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

describe("util.allocateIndex", () => {
  let pool, allocator, init, index, length
  before(() => {
    index = 0
    length = 3
    pool = new Array(length)
    allocator = new Array(length)
    allocator.fill(false)
    init = (m, string = "baz", also = "nope") => {
      m.foo = string
      m.also = also
    }
    for (let i = 0; i < length; ++i) {
      pool[i] = {foo: "bar"}
    }
  })
  it("should allocate a new pool member", () => {
    let member = util.allocateIndex(pool, allocator, () => {}, index)
    allocator[index].should.be.true()
    member.foo.should.eql("bar");
    (typeof member.also).should.eql("undefined")
    pool.indexOf(member).should.eql(index)
    index++
  })
  it("should use a supplied init function", () => {
    let member = util.allocateIndex(pool, allocator, init, index)
    allocator[index].should.be.true()
    member.foo.should.eql("baz")
    member.also.should.eql("nope")
    pool.indexOf(member).should.eql(index)
    index++
  })
  it("should pass through init arguments", () => {
    let member = util.allocate(pool, allocator, init, "qux", "yup")
    allocator[index].should.be.true()
    member.foo.should.eql("qux")
    member.also.should.eql("yup")
    pool.indexOf(member).should.eql(index)
  })
  it("should complain when the index is already allocated", () => {
    (() => util.allocateIndex(pool, allocator, init, index)).should.throw()
  })
  it("should complain when the index is out of bounds", () => {
    (() => util.allocateIndex(pool, allocator, init, length)).should.throw()
  })
})

describe("util.allocate", () => {
  let pool, allocator, init, count, length
  before(() => {
    count = 0
    length = 3
    pool = new Array(length)
    allocator = new Array(length)
    allocator.fill(false)
    init = (m, string = "baz") => m.foo = string
    for (let i = 0; i < length; ++i) {
      pool[i] = {foo: "bar"}
    }
  })
  it("should allocate a new pool member", () => {
    let member = util.allocate(pool, allocator, () => {})
    allocator[count].should.be.true()
    member.foo.should.eql("bar")
    pool.indexOf(member).should.eql(count)
    count++
  })
  it("should use a supplied init function", () => {
    let member = util.allocate(pool, allocator, init)
    allocator[count].should.be.true()
    member.foo.should.eql("baz")
    pool.indexOf(member).should.eql(count)
    count++
  })
  it("should pass through init arguments", () => {
    let member = util.allocate(pool, allocator, init, "qux")
    allocator[count].should.be.true()
    member.foo.should.eql("qux")
    pool.indexOf(member).should.eql(count)
    count++
  })
  it("should complain when the pool is full", () => {
    (() => util.allocate(pool, allocator)).should.throw()
  })
})

describe("utl.freeIndex", () => {
  let pool, allocator, clean, count, length
  before(() => {
    length = 2
    count = length
    pool = new Array(length)
    allocator = new Array(length)
    allocator.fill(true)
    clean = (m) => m.foo = "baz"
    for (let i = 0; i < length; ++i) {
      pool[i] = {foo: "bar"}
    }
  })
  it("should free a member", () => {
    count--
    util.freeIndex(pool, allocator, () => {}, count)
    allocator[count].should.be.false()
  })
  it("should use a supplied clean function", () => {
    count--
    util.freeIndex(pool, allocator, clean, count)
    pool[count].foo.should.eql("baz")
    allocator[count].should.be.false()
  })
  it("should complain when the member is already free", () => {
    (() => util.freeIndex(pool, allocator, () => {}, count)).should.throw()
  })
})

describe("utl.free", () => {
  let pool, allocator, clean, count, length
  before(() => {
    length = 2
    count = length
    pool = new Array(length)
    allocator = new Array(length)
    allocator.fill(true)
    clean = (m) => m.foo = "baz"
    for (let i = 0; i < length; ++i) {
      pool[i] = {foo: "bar"}
    }
  })
  it("should free a member", () => {
    count--
    util.free(pool, allocator, () => {}, pool[count])
    allocator[count].should.be.false()
  })
  it("should use a supplied clean function", () => {
    count--
    util.free(pool, allocator, clean, pool[count])
    pool[count].foo.should.eql("baz")
    allocator[count].should.be.false()
  })
  it("should complain when the argument is not a member", () => {
    (() => util.free(pool, allocator, clean, {foo: "qux"})).should.throw()
  })
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


