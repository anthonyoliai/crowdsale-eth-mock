pragma solidity >=0.6.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Mevony is ERC20 {
    constructor(uint256 initialSupply) public ERC20("Mevony Token", "CPC") {
        _mint(msg.sender, initialSupply);
        _setupDecimals(0);
    }
}
