import { ethers } from "hardhat";
import { parseEther } from "ethers/lib/utils";
import { expect } from "chai";
import { ProposalStatus } from "../types/enum";

export default function (): void {
  it("Proposal: Finish failed", async function (): Promise<void> {
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

    await this.dao.deposit(parseEther("49"));
    await this.dao.vote(1, false, parseEther("25"));
    await this.dao.vote(1, true, parseEther("24"));
    await ethers.provider.send("evm_increaseTime", [60 * 60 * 24 * 3]); // 3 days
    await this.dao.finishProposal(1);
    const proposal = await this.dao.proposals(1);
    const proposalStatus = proposal.status;
    expect(proposalStatus).to.equal(ProposalStatus.FAILED);
  });

  it("Proposal: Only after period duration", async function (): Promise<void> {
    await this.dao.deposit(parseEther("101"));

    await this.dao.addProposal(
      1,
      this.callDataFor,
      this.callDataAgainst,
      this.token.address,
      this.token.address,
      "Test desc"
    );

    await ethers.provider.send("evm_increaseTime", [60 * 60 * 24 * 2]); // 2 days
    expect(this.dao.finishProposal(1)).to.be.revertedWith(
      "Only after period duration"
    );
  });

  it("Proposal: Finish for", async function (): Promise<void> {
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

    await this.dao.deposit(parseEther("101"));
    await this.dao.vote(1, false, parseEther("50"));
    await this.dao.vote(1, true, parseEther("51"));
    await ethers.provider.send("evm_increaseTime", [60 * 60 * 24 * 3]); // 3 days
    await this.dao.finishProposal(1);
    const proposal = await this.dao.proposals(1);
    const proposalStatus = proposal.status;
    expect(proposalStatus).to.equal(ProposalStatus.FOR);
  });

  it("Proposal: Finish against", async function (): Promise<void> {
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

    await this.dao.deposit(parseEther("101"));
    await this.dao.vote(1, false, parseEther("51"));
    await this.dao.vote(1, true, parseEther("50"));
    await ethers.provider.send("evm_increaseTime", [60 * 60 * 24 * 3]); // 3 days
    await this.dao.finishProposal(1);
    const proposal = await this.dao.proposals(1);
    const proposalStatus = proposal.status;
    expect(proposalStatus).to.equal(ProposalStatus.AGAINST);
  });

  it("Proposal: Votes must not be equal", async function (): Promise<void> {
    await this.dao.deposit(parseEther("101"));
    await this.dao.addProposal(
      1,
      this.callDataFor,
      this.callDataAgainst,
      this.token.address,
      this.token.address,
      "Test desc"
    );

    await this.dao.vote(1, false, parseEther("25"));
    await this.dao.vote(1, true, parseEther("25"));
    await ethers.provider.send("evm_increaseTime", [60 * 60 * 24 * 3]); // 3 days
    expect(this.dao.finishProposal(1)).to.be.revertedWith(
      "Votes must not be equal"
    );
  });

  it("Proposal: Proposal finished", async function (): Promise<void> {
    await this.dao.deposit(parseEther("101"));
    await this.dao.addProposal(
      1,
      this.callDataFor,
      this.callDataAgainst,
      this.token.address,
      this.token.address,
      "Test desc"
    );

    await this.dao.vote(1, false, parseEther("25"));
    await this.dao.vote(1, true, parseEther("26"));
    await ethers.provider.send("evm_increaseTime", [60 * 60 * 24 * 3]); // 3 days
    await this.dao.finishProposal(1);
    expect(this.dao.finishProposal(1)).to.be.revertedWith("Proposal finished");
  });
}
