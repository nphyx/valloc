import * as valloc from "../index"

describe("valloc module", () => {
  it("should expose valloc exports", () => {
    valloc.create.should.be.a.Function()
    valloc.from.should.be.a.Function()
  })
})
