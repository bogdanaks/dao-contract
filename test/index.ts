import { parseEther } from "ethers/lib/utils";
import { ethers } from "hardhat";
import depositTest from "./deposit";
import voteTest from "./vote";
import addProposalTest from "./addProposal";

describe("Test functions", async function () {
  beforeEach(async function () {
    this.DaoContract = await ethers.getContractFactory("Dao");
    this.TokenContract = await ethers.getContractFactory("Token");
    [this.owner, this.addr1, this.addr2] = await ethers.getSigners();

    this.token = await this.TokenContract.deploy("Crypton", "CRYP");

    const threeDaySeconds = 60 * 60 * 24 * 3;
    this.dao = await this.DaoContract.deploy(
      this.owner.address,
      this.token.address,
      parseEther("100"),
      threeDaySeconds
    );

    await this.token.mint(this.owner.address, parseEther("1000"));
    await this.token.approve(this.dao.address, parseEther("1000"));
  });

  depositTest();
  addProposalTest();
  voteTest();
});
