//SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.11;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20 {
  address public owner;
  constructor(string memory _name, string memory _symbol) ERC20(_name, _symbol) {
    owner = msg.sender;
  }

  modifier onlyOwner {
    require(msg.sender == owner, "Only owner");
    _;
  }

  function mint(address to, uint256 amount) external onlyOwner {
    _mint(to, amount);
  }

  function burn(address to, uint256 amount) external onlyOwner {
    _burn(to, amount);
  }
}
