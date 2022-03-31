import { parseEther } from "ethers/lib/utils";
import { task } from "hardhat/config";

import "@nomiclabs/hardhat-ethers";

interface IArgs {
  contract: string;
  proposalid: string;
  status: boolean;
  amount: string;
}

task("vote", "Vote dao")
  .addParam("contract", "Contract token address")
  .addParam("proposalid", "Proposal Id")
  .addParam("status", "Status vote (true/false)")
  .addParam("amount", "Amount")
  .setAction(async (args: IArgs, hre) => {
    const Dao = await hre.ethers.getContractAt("Dao", args.contract);

    const tx = await Dao.vote(
      args.proposalid,
      args.status,
      parseEther(args.amount)
    );
    await tx.wait();

    console.log("Successfully vote token");
  });

export {};
