import { task } from "hardhat/config";

import "@nomiclabs/hardhat-ethers";

interface IArgs {
  contract: string;
  proposalid: string;
  calldatafor: string;
  calldataagainst: string;
  recipientfor: string;
  recipientagainst: string;
  description: string;
}

task("add-proposal", "Add proposal")
  .addParam("contract", "Contract token address")
  .addParam("proposalid", "Proposal Id")
  .addParam("calldatafor", "Calldata For")
  .addParam("calldataagainst", "Calldata Against")
  .addParam("recipientfor", "Recipient For")
  .addParam("recipientagainst", "Recipient Against")
  .addParam("description", "Description")
  .setAction(async (args: IArgs, hre) => {
    const Dao = await hre.ethers.getContractAt("Dao", args.contract);

    const tx = await Dao.addProposal(
      args.proposalid,
      args.calldatafor,
      args.calldataagainst,
      args.recipientfor,
      args.recipientagainst,
      args.description
    );
    await tx.wait();

    console.log("Successfully add proposal");
  });

export {};
