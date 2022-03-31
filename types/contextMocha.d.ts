import { Token, Token__factory, Dao, Dao__factory } from "../typechain";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

declare module "mocha" {
  export interface Context {
    TokenContract: Token__factory;
    DaoContract: Dao__factory;
    token: Token;
    dao: Dao;
    jsonAbi: any[];
    callDataFor: string;
    callDataAgainst: string;
    owner: SignerWithAddress;
    addr1: SignerWithAddress;
    addr2: SignerWithAddress;
  }
}
