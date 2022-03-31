import { parseEther } from "ethers/lib/utils";
import { task } from "hardhat/config";

import "@nomiclabs/hardhat-ethers";

interface IArgs {
  contract: string;
  token: string;
  amount: string;
}

task("deposit", "Deposit tokens")
  .addParam("contract", "Contract token address")
  .addParam("token", "Token address")
  .addParam("amount", "Amount")
  .setAction(async (args: IArgs, hre) => {
    const Dao = await hre.ethers.getContractAt("Dao", args.contract);

    const tx = await Dao.deposit(parseEther(args.amount));
    await tx.wait();

    console.log("Successfully deposit token");
  });

export {};
