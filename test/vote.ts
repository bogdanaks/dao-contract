import { ethers } from "hardhat";
import { parseEther, formatEther, Interface } from "ethers/lib/utils";
import { expect } from "chai";

export default function (): void {
  it("Vote: Vote true", async function (): Promise<void> {
    await this.dao.deposit(parseEther("50"));

    const jsonAbi = [
      {
        inputs: [
          {
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
        ],
        name: "burn",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
    ];

    const interfaceJson = new Interface(jsonAbi);
    const callData = interfaceJson.encodeFunctionData("burn", [
      this.owner.address,
      parseEther("100"),
    ]);

    await this.dao.addProposal(1, callData, this.token.address, "Test desc");

    const votersBefore = await this.dao.getVoteAmounts(1);
    expect(votersBefore.length).to.equal(0);

    await this.dao.vote(1, true, parseEther("50"));
    const votersAfter = await this.dao.getVoteAmounts(1);
    expect(votersAfter.length).to.equal(1);
  });
}
