//SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.11;

import "./IToken.sol";

contract Dao {
  address public chairPerson;
  IToken public voteToken;
  uint256 public minimumQuorum;
  uint256 public debatingPeriodDuration;

  struct Proposal {
    uint256 startTime;
    uint256 votesFor;
    uint256 votesAgainst;
    address recipient;
    string description;
    bytes callData;
  }

  mapping(uint256 => mapping(address => uint256[])) public voterAmounts;
  mapping(uint256 => mapping(address => bool)) public votersType;
  mapping(uint256 => Proposal) public proposals;
  mapping(address => uint256) public deposits;

  constructor(address _chairPerson, IToken _voteToken, uint256 _minimumQuorum, uint256 _debatingPeriodDuration) {
    chairPerson = _chairPerson;
    voteToken = _voteToken;
    minimumQuorum = _minimumQuorum;
    debatingPeriodDuration = _debatingPeriodDuration;
  }

  modifier onlyChair {
    require(msg.sender == chairPerson, "Only chair person");
    _;
  }

  function deposit(uint256 amount) public {
    deposits[msg.sender] += amount;
    voteToken.transferFrom(msg.sender, address(this), amount);
  }

  function vote(uint256 id, bool supportVote, uint256 amount) public {
    require(deposits[msg.sender] >= amount, "You deposit less than amount");
    require(proposals[id].startTime != 0, "Proporsal doesnt exist");

    Proposal storage curProposal = proposals[id];
    uint256 paidDeposit = 0;

    for (uint256 index = 0; index < voterAmounts[id][msg.sender].length; index++) {
      paidDeposit += voterAmounts[id][msg.sender][index];
    }

    uint256 freeDeposit = deposits[msg.sender] - paidDeposit;

    require(freeDeposit >= amount, "Free deposit less than amount");

    if (supportVote) {
      curProposal.votesFor += amount;
      votersType[id][msg.sender] = true;
    } else {
      curProposal.votesAgainst += amount;
      votersType[id][msg.sender] = false;
    }

    voterAmounts[id][msg.sender].push(amount);
  }

  function addProposal(uint256 id, bytes calldata callData, address recipient, string calldata description) public onlyChair {
    require(proposals[id].startTime == 0, "Already added");
    proposals[id].startTime = block.timestamp;
    proposals[id].description = description;
    proposals[id].recipient = recipient;
    proposals[id].callData = callData;
  }

  function finishProposal(uint256 id) public {
    //
  }

  function getVoteAmounts(uint256 id) public view returns(uint256[] memory amounts) {
    return voterAmounts[id][msg.sender];
  }
}
