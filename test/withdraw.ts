import { parseEther, formatEther } from "ethers/lib/utils";
import { expect } from "chai";
import { ethers } from "hardhat";
import { ProposalStatus } from "../types/enum";

export default function (): void {
  it("Withdraw: Withdraw success", async function (): Promise<void> {
    await this.dao.deposit(parseEther("50"));
    await this.dao.deposit(parseEther("101"));

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
    await this.dao.vote(1, false, parseEther("50"));
    await this.dao.vote(1, true, parseEther("51"));

    await ethers.provider.send("evm_increaseTime", [60 * 60 * 24 * 3]); // 3 days
    await this.dao.finishProposal(1);
    const proposal = await this.dao.proposals(1);
    const proposalStatus = proposal.status;
    expect(proposalStatus).to.equal(ProposalStatus.FOR);
    const myBalanceAfter = await this.token.balanceOf(this.owner.address);
    expect(myBalanceAfter).to.equal(parseEther("749"));

    const balanceDepositBefore = await this.dao.deposits(this.owner.address);
    const balanceTokenBefore = await this.token.balanceOf(this.owner.address);

    expect(formatEther(balanceDepositBefore)).to.equal("151.0");
    expect(formatEther(balanceTokenBefore)).to.equal("749.0");

    await this.dao.withdraw();

    const balanceDepositAfter = await this.dao.deposits(this.owner.address);
    const balanceTokenAfter = await this.token.balanceOf(this.owner.address);

    expect(formatEther(balanceDepositAfter)).to.equal("0.0");
    expect(formatEther(balanceTokenAfter)).to.equal("900.0");
  });

  it("Withdraw: Has running proposal", async function (): Promise<void> {
    await this.dao.deposit(parseEther("50"));
    await this.dao.addProposal(
      1,
      this.callDataFor,
      this.callDataAgainst,
      this.token.address,
      this.token.address,
      "Test desc"
    );
    await this.dao.vote(1, false, parseEther("50"));

    await ethers.provider.send("evm_increaseTime", [60 * 60 * 24 * 3]); // 3 days
    expect(this.dao.withdraw()).to.be.revertedWith("Has running proposal");
  });
}
