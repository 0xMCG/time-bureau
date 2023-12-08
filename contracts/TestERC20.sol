// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";


contract TestERC20 is ERC20{
    constructor() ERC20("Test USDC", "USDC") {
        _update(address(0), tx.origin, 1000000000_000000000000000000);
    }
}