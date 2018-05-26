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

describe("valloc allocator", () => {
  let allocator
  before(() => {
    allocator = valloc.from(new Array(10))
  })
  it("should implement length as a getter", () => {
    allocator.length.should.eql(10);
    (() => allocator.length = 11).should.throw()
  })
  it("should implement nextIndex as a getter", () => {
    allocator.nextIndex.should.eql(0);
    (() => allocator.nextIndex = 9).should.throw()
  })
  it("should implement available as a getter", () => {
    allocator.available.should.eql(10);
    (() => allocator.available = 9).should.throw()
  })
  it("should implement used as a getter", () => {
    allocator.used.should.eql(0);
    (() => allocator.used = 10).should.throw()
  })
})
