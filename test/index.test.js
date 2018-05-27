import * as valloc from "../src/"

const allocatorProperties = {
  next: "function",
  indexOf: "function",
  isAllocated: "function",
  isIndexAllocated: "function",
  free: "function",
  nextIndex: "number",
  length: "number",
  available: "number",
  used: "number"
}

describe("valloc.from", () => {
  it("should require an array as the first parameter", () => {
    (() => valloc.from()).should.throw()
  })
  it("should create a valloc allocator from an array", () => {
    let array = new Array(1)
    let allocator = valloc.from(array)
    for (let key of Object.getOwnPropertyNames(allocatorProperties)) {
      allocator[key].should.have.type(allocatorProperties[key])
    }
  })
})

describe("valloc.create", () => {
  it("should require length as the first parameter", () => {
    (() => valloc.create()).should.throw()
  })
  it("should create a valloc allocator", () => {
    let allocator = valloc.create(1)
    for (let key of Object.getOwnPropertyNames(allocatorProperties)) {
      allocator[key].should.have.type(allocatorProperties[key])
    }
  })
})

describe("valloc allocators", () => {
  let allocator, member, count, length
  before(() => {
    count = 0
    length = 10
    const opts = {
      factory: (i) => ({index: i, foo: "bar"}),
      init: (m, string = "bar") => m.foo = string,
      clean: (m) => m.foo = "bar"
    }
    allocator = valloc.create(length, opts)
  })
  it("should implement length as a getter", () => {
    allocator.length.should.eql(length);
    (() => allocator.length = 11).should.throw()
  })
  it("should implement nextIndex as a getter", () => {
    allocator.nextIndex.should.eql(0);
    (() => allocator.nextIndex = 9).should.throw()
  })
  it("should implement available as a getter", () => {
    allocator.available.should.eql(length);
    (() => allocator.available = 9).should.throw()
  })
  it("should implement used as a getter", () => {
    allocator.used.should.eql(0);
    (() => allocator.used = 10).should.throw()
  })
  it("should allocate a new member", () => {
    member = allocator.next()
    count++
    member.should.have.properties(["index", "foo"])
    member.index.should.eql(0)
    member.foo.should.eql("bar")
  })
  it("should support params during initialization", () => {
    member = allocator.next("baz")
    count++
    member.index.should.eql(1)
    member.foo.should.eql("baz")
  })
  it("should report that an index is allocated", () => {
    for (let i = 0; i < count; ++i) {
      allocator.isIndexAllocated(i).should.be.true()
    }
    allocator.isIndexAllocated(count).should.be.false()
  })
  it("should report that an object is allocated", () => {
    allocator.isAllocated(member).should.be.true()
  })
  it("should report the index of an allocated object", () => {
    allocator.indexOf(member).should.eql(member.index)
  })
  it("should free an existing member", () => {
    member = allocator.next()
    let index = member.index
    allocator.free(member)
    allocator.isIndexAllocated(index).should.be.false()
  })
  it("should update used and available after free", () => {
    allocator.used.should.eql(count)
    allocator.available.should.eql(length - count)
  })
  it("should free an existing member by index", () => {
    let index = count - 1
    allocator.freeIndex(index)
    count--
    allocator.isIndexAllocated(index).should.be.false()
  })
  it("should update used and available after freeIndex", () => {
    allocator.used.should.eql(count)
    allocator.available.should.eql(length - count)
  })
  it("should iterate over active members with eachActive", () => {
    allocator.next()
    allocator.next()
    allocator.next()
    count += 3
    let callCount = 0
    allocator.eachActive((member, i) => {
      member.index.should.eql(i)
      allocator.isIndexAllocated(i).should.be.true()
      callCount++
    })
    callCount.should.eql(count)
  })
  it("should supply default factory, init and clean functions", () => {
    // this would throw if there was no default factory
    let allocator = valloc.create(10)
    // this would throw if there was no default init
    let member = allocator.next()
    // this would throw if there was no default clean
    allocator.free(member)
  })
})
