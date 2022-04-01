// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract Bank {
    // owner address
    address owner;
    // which symbols are allowed for deposit and withdrawl
    bytes32[] public whitelistedSymbols;
    // match symbols (ie ticker symbol) to addresses where the tokens contract is deployed
    mapping(bytes32 => address) public whitelistedTokens;
    // holds balances of tokens deposited by each address
    mapping(address => mapping(bytes32 => uint256)) public balances;

    constructor() {
        owner = msg.sender;
    }

    function whitelistToken(bytes32 symbol, address tokenAddress) external {
        require(msg.sender == owner, "This function is not public!");
        // white list the new symbol
        whitelistedSymbols.push(symbol);
        // add symbol with the token address
        whitelistedTokens[symbol] = tokenAddress;
    }

    // get array of token symbols that have been whitelisted
    function getWhitelistedSymbols() external view returns (bytes32[] memory) {
        return whitelistedSymbols;
    }

    // get address for a specific whitelisted token. important because
    // allows you to interact with a specific tokens contract.
    function getWhitelistedTokens(bytes32 symbol)
        external
        view
        returns (address)
    {
        return whitelistedTokens[symbol];
    }

    // allow contract to receive eth
    receive() external payable {
        // increment the sender's wallet's address
        balances[msg.sender]["Eth"] += msg.value;
    }

    // allows for withdrawing ether thats already been deposited.
    function withdrawEther(uint256 amount) external {
        // prevent user from withdrawing more than they deposited.
        require(balances[msg.sender]["Eth"] >= amount, "Insufficient funds");

        // subtract out of account
        balances[msg.sender]["Eth"] -= amount;
        // send the eth back to their wallet
        payable(msg.sender).call{value: amount}("");
    }

    // allows for depositing ERC20 tokens
    function depositTokens(uint256 amount, bytes32 symbol) external {
        balances[msg.sender][symbol] += amount;
        // request transfer from senders address
        IERC20(whitelistedTokens[symbol]).transferFrom(
            msg.sender,
            address(this),
            amount
        );
    }

    // withdraw ERC20 tokens that were deposited
    function withdrawTokens(uint256 amount, bytes32 symbol) external {
        require(balances[msg.sender][symbol] >= amount, "Insufficient funds");

        balances[msg.sender][symbol] += amount;
        // transfer tokens from this contract to the senders wallet
        IERC20(whitelistedTokens[symbol]).transfer(msg.sender, amount);
    }

    // get balance of a specific token that the user has deposited into this contract
    function getTokenBalance(bytes32 symbol) external view returns (uint256) {
        return balances[msg.sender][symbol];
    }
}
