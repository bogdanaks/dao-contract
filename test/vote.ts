import { parseEther } from "ethers/lib/utils";
import { expect } from "chai";
import { ethers } from "hardhat";

export default function (): void {
  it("Vote: Vote true", async function (): Promise<void> {
    await this.dao.deposit(parseEther("50"));

    await this.dao.addProposal(
      1,
      this.callDataFor,
      this.callDataAgainst,
      this.token.address,
      this.token.address,
      "Test desc"
    );

    const votersBefore = await this.dao.getVoteAmounts(1);
    expect(votersBefore.length).to.equal(0);

    await this.dao.vote(1, true, parseEther("50"));
    const votersAfter = await this.dao.getVoteAmounts(1);
    expect(votersAfter.length).to.equal(1);
  });

  it("Vote: You deposit less than amount", async function (): Promise<void> {
    await this.dao.deposit(parseEther("50"));
    await this.dao.addProposal(
      1,
      this.callDataFor,
      this.callDataAgainst,
      this.token.address,
      this.token.address,
      "Test desc"
    );

    expect(this.dao.vote(1, true, parseEther("51"))).to.be.revertedWith(
      "You deposit less than amount"
    );
  });

  it("Vote: Proporsal doesnt exist", async function (): Promise<void> {
    await this.dao.deposit(parseEther("50"));
    await this.dao.addProposal(
      1,
      this.callDataFor,
      this.callDataAgainst,
      this.token.address,
      this.token.address,
      "Test desc"
    );

    expect(this.dao.vote(2, true, parseEther("51"))).to.be.revertedWith(
      "Proporsal doesnt exist"
    );
  });

  it("Vote: Proporsal finished", async function (): Promise<void> {
    await this.dao.deposit(parseEther("50"));
    await this.dao.addProposal(
      1,
      this.callDataFor,
      this.callDataAgainst,
      this.token.address,
      this.token.address,
      "Test desc"
    );
    await this.dao.vote(1, true, parseEther("25"));
    await ethers.provider.send("evm_increaseTime", [60 * 60 * 24 * 3]); // 3 days
    await this.dao.finishProposal(1);

    expect(this.dao.vote(1, true, parseEther("25"))).to.be.revertedWith(
      "Proporsal finished"
    );
  });

  it("Vote: Free deposit less than amount", async function (): Promise<void> {
    await this.dao.deposit(parseEther("50"));
    await this.dao.addProposal(
      1,
      this.callDataFor,
      this.callDataAgainst,
      this.token.address,
      this.token.address,
      "Test desc"
    );
    await this.dao.vote(1, true, parseEther("50"));
    expect(this.dao.vote(1, true, parseEther("25"))).to.be.revertedWith(
      "Free deposit less than amount"
    );
  });
}
