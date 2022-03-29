import { ethers } from "hardhat";
import { parseEther, formatEther, Interface } from "ethers/lib/utils";
import { expect } from "chai";

export default function (): void {
  it("Proposal: Add", async function (): Promise<void> {
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

    expect((await this.dao.proposals(1)).startTime).to.equal(0);
    await this.dao.addProposal(1, callData, this.token.address, "Test desc");
    expect(
      (await this.dao.proposals(1)).startTime.toNumber()
    ).to.be.greaterThan(0);
  });
}
