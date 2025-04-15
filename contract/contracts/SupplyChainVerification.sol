// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract SupplyChainVerification {
    struct Movement {
        address from;
        address to;
        uint256 timestamp;
    }

    mapping(uint256 => Movement[]) public productHistory;
    mapping(address => string) public stakeholders;

    event ProductMoved(uint256 productId, address indexed from, address indexed to, uint256 timestamp);

    function addStakeholder(address _stakeholder, string memory _role) public {
        stakeholders[_stakeholder] = _role;
    }

    function recordMovement(uint256 productId, address from, address to) public {
        productHistory[productId].push(Movement(from, to, block.timestamp));
        emit ProductMoved(productId, from, to, block.timestamp);
    }

    function getProductHistory(uint256 productId) public view returns (Movement[] memory) {
        return productHistory[productId];
    }
}
