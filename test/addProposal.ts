import { expect } from "chai";

export default function (): void {
  it("Proposal: Add", async function (): Promise<void> {
    expect((await this.dao.proposals(1)).startTime).to.equal(0);
    await this.dao.addProposal(
      1,
      this.callDataFor,
      this.callDataAgainst,
      this.token.address,
      this.token.address,
      "Test desc"
    );
    expect(
      (await this.dao.proposals(1)).startTime.toNumber()
    ).to.be.greaterThan(0);
  });

  it("Proposal: Already added", async function (): Promise<void> {
    await this.dao.addProposal(
      1,
      this.callDataFor,
      this.callDataAgainst,
      this.token.address,
      this.token.address,
      "Test desc"
    );
    expect(
      this.dao.addProposal(
        1,
        this.callDataFor,
        this.callDataAgainst,
        this.token.address,
        this.token.address,
        "Test desc"
      )
    ).to.be.revertedWith("Already added");
  });

  it("Proposal: Only chair person", async function (): Promise<void> {
    expect(
      this.dao
        .connect(this.addr1)
        .addProposal(
          1,
          this.callDataFor,
          this.callDataAgainst,
          this.token.address,
          this.token.address,
          "Test desc"
        )
    ).to.be.revertedWith("Only chair person");
  });
}
