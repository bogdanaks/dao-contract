import { task } from "hardhat/config";

import "@nomiclabs/hardhat-ethers";

interface IArgs {
  contract: string;
  proposalid: string;
}

task("finish-proposal", "Finish proposal")
  .addParam("contract", "Contract token address")
  .addParam("proposalid", "Proposal Id")
  .setAction(async (args: IArgs, hre) => {
    const Dao = await hre.ethers.getContractAt("Dao", args.contract);

    const tx = await Dao.finishProposal(args.proposalid);
    await tx.wait();

    console.log("Successfully finish proposal");
  });

export {};
