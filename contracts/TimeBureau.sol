// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {ERC1155} from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

// import "@openzeppelin/contracts/utils/Strings.sol";
// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract TimeBureau is Ownable, ERC1155 {
    struct MintInfo {
        uint256 total; // Minted count
        uint256 supply; // total supply
        uint256 start; // start block number;
        uint256 end; // end block number;
        uint256 price; // unit price
        address token; // ERC20 token address;
        uint256 permax; // Maximum amount of Mint per address
        address receiver; // project parties’ receiver addresses
    }

    MintInfo private _mi;

    mapping(address => uint) _minted;

    constructor(string memory uri) Ownable(tx.origin) ERC1155(uri) {}

    function name() public pure returns (string memory) {
        return "TimeBureau";
    }

    function enableMint(
        uint256 start,
        uint256 end,
        uint256 price,
        uint256 supply,
        uint256 permax,
        address token,
        address receiver
    ) public onlyOwner {
        require(price > 0, "Require price > 0");
        _mi.start = start;
        _mi.end = end;
        _mi.price = price;
        _mi.supply = supply;
        _mi.permax = permax;
        _mi.token = token;
        _mi.receiver = receiver;
    }

    function getMintInfo() public view virtual returns (MintInfo memory) {
        return _mi;
    }

    function mint(uint256 count, address to) public returns (bool) {
        require(count > 0, "Require count > 0");
        require((count + _mi.total) <= _mi.supply, "Error Limit supply");
        if (msg.sender == owner()) {
            _mint(to, 1, count, "0x10");
        } else {
            require(_mi.start <= block.timestamp, "Error mint not started");
            require(_mi.end >= block.timestamp, "Error mint ended");
            require(
                count + _minted[msg.sender] <= _mi.permax,
                "Error limit mint"
            );
            uint256 amount = count * _mi.price;
            IERC20 token = IERC20(_mi.token);
            // check erc20 allowance
            require(
                token.allowance(msg.sender, address(this)) >= amount,
                "Error erc20 allowance amount"
            );
            _mint(to, 1, count, "0x11");

            if (!token.transferFrom(msg.sender, _mi.receiver, amount)) {
                revert("Mint transfer token error");
            }
        }
        _mi.total += count;
        _minted[msg.sender] += count;
        return true;
    }

    function minted(address account) public view virtual returns (uint) {
        return _minted[account];
    }
}
