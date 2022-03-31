import { ethers } from "hardhat";
import * as dotenv from "dotenv";
import assert from "assert";

dotenv.config();

assert(process.env.CHAIR_ADDRESS, "CHAIR_ADDRESS not found");
assert(process.env.DAO_TOKEN_ADDRESS, "DAO_TOKEN_ADDRESS not found");
assert(process.env.MIN_QUORUM, "MIN_QUORUM not found");
assert(process.env.DURATION_SECONDS, "DURATION_SECONDS not found");

async function main() {
  const Contract = await ethers.getContractFactory("Dao");
  const [owner] = await ethers.getSigners();
  const contract = await Contract.deploy(
    process.env.CHAIR_ADDRESS as string,
    process.env.DAO_TOKEN_ADDRESS as string,
    process.env.MIN_QUORUM as string,
    process.env.DURATION_SECONDS as string
  );

  console.log("Contract deployed to:", contract.address);
  console.log("Owner address is: ", owner.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
