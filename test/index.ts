import { parseEther, Interface } from "ethers/lib/utils";
import { ethers } from "hardhat";
import depositTest from "./deposit";
import voteTest from "./vote";
import addProposalTest from "./addProposal";
import finishProposalTest from "./finishProposal";
import withdrawTest from "./withdraw";

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

    await this.token.grantRole(await this.token.DAO_ROLE(), this.dao.address);

    await this.token.mint(this.owner.address, parseEther("1000"));
    await this.token.approve(this.dao.address, parseEther("1000"));

    this.jsonAbi = [
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
        name: "mint",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
    ];
    const interfaceJson = new Interface(this.jsonAbi);
    this.callDataFor = interfaceJson.encodeFunctionData("burn", [
      this.owner.address,
      parseEther("100"),
    ]);
    this.callDataAgainst = interfaceJson.encodeFunctionData("mint", [
      this.owner.address,
      parseEther("100"),
    ]);
    console.log("callDataFor: ", this.callDataFor);
  });

  depositTest();
  addProposalTest();
  voteTest();
  finishProposalTest();
  withdrawTest();
});
