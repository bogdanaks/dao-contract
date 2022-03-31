//SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.11;

import "./IToken.sol";

contract Dao {
  address public chairPerson;
  IToken public voteToken;
  uint256 public minimumQuorum;
  uint256 public debatingPeriodDuration;

  enum ProposalStatus { RUNNING, FAILED, AGAINST, FOR }

  struct Proposal {
    uint256 startTime;
    uint256 votesFor;
    uint256 votesAgainst;
    address recipientFor;
    address recipientAgainst;
    string description;
    bytes callDataFor;
    bytes callDataAgainst;
    ProposalStatus status;
  }

  mapping(uint256 => mapping(address => uint256[])) public voterAmounts;
  mapping(address => uint256[]) public userProposalsIds;
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
    require(proposals[id].status == ProposalStatus.RUNNING, "Proporsal finished");

    Proposal storage curProposal = proposals[id];
    uint256 paidDeposit = 0;

    for (uint256 index = 0; index < voterAmounts[id][msg.sender].length; index++) {
      paidDeposit += voterAmounts[id][msg.sender][index];
    }

    uint256 freeDeposit = deposits[msg.sender] - paidDeposit;

    require(freeDeposit >= amount, "Free deposit less than amount");

    if (supportVote) {
      curProposal.votesFor += amount;
    } else {
      curProposal.votesAgainst += amount;
    }

    bool existId = false;
    for (uint256 i = 0; i < userProposalsIds[msg.sender].length; i++) {
      if (userProposalsIds[msg.sender][i] == id) {
        existId = true;
      }
    }

    if (!existId) {
      userProposalsIds[msg.sender].push(id);
    }

    voterAmounts[id][msg.sender].push(amount);
  }

  function addProposal(
    uint256 id,
    bytes calldata callDataFor,
    bytes calldata callDataAgainst,
    address recipientFor,
    address recipientAgainst,
    string calldata description
  ) public onlyChair {
    require(proposals[id].startTime == 0, "Already added");
    proposals[id].startTime = block.timestamp;
    proposals[id].description = description;
    proposals[id].recipientFor = recipientFor;
    proposals[id].recipientAgainst = recipientAgainst;
    proposals[id].callDataFor = callDataFor;
    proposals[id].callDataAgainst = callDataAgainst;
    proposals[id].status = ProposalStatus.RUNNING;
  }

  function finishProposal(uint256 id) public {
    require(proposals[id].startTime + debatingPeriodDuration <= block.timestamp, "Only after period duration");
    require(proposals[id].votesFor != proposals[id].votesAgainst, "Votes must not be equal");
    require(proposals[id].status == ProposalStatus.RUNNING, "Proposal finished");

    if (proposals[id].votesFor + proposals[id].votesAgainst < minimumQuorum) {
      proposals[id].status = ProposalStatus.FAILED;
    } else if (proposals[id].votesFor > proposals[id].votesAgainst) {
      proposals[id].status = ProposalStatus.FOR;
      address(proposals[id].recipientFor).call{value:0}(proposals[id].callDataFor);
    } else {
      proposals[id].status = ProposalStatus.AGAINST;
      address(proposals[id].recipientAgainst).call{value:0}(proposals[id].callDataAgainst);
    }
  }

  function withdraw() public {
    bool isFinishedAllProposals = true;
    for (uint256 i = 0; i < userProposalsIds[msg.sender].length; i++) {
      if (proposals[userProposalsIds[msg.sender][i]].status == ProposalStatus.RUNNING) {
        isFinishedAllProposals = false;
      }
    }

    require(isFinishedAllProposals, "Has running proposal");
    voteToken.transfer(msg.sender, deposits[msg.sender]);
    deposits[msg.sender] = 0;
  }

  function getVoteAmounts(uint256 id) public view returns(uint256[] memory amounts) {
    return voterAmounts[id][msg.sender];
  }
}
