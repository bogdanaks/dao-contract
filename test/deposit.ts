import { parseEther, formatEther } from "ethers/lib/utils";
import { expect } from "chai";

export default function (): void {
  it("Deposit: Deposit token", async function (): Promise<void> {
    const balanceDepositBefore = await this.dao.deposits(this.owner.address);
    const balanceTokenBefore = await this.token.balanceOf(this.owner.address);

    expect(formatEther(balanceDepositBefore)).to.equal("0.0");
    expect(formatEther(balanceTokenBefore)).to.equal("1000.0");

    await this.dao.deposit(parseEther("50"));

    const balanceDepositAfter = await this.dao.deposits(this.owner.address);
    const balanceTokenAfter = await this.token.balanceOf(this.owner.address);

    expect(formatEther(balanceDepositAfter)).to.equal("50.0");
    expect(formatEther(balanceTokenAfter)).to.equal("950.0");
  });
}
