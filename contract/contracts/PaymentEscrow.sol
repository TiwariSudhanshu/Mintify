// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract PaymentEscrow {
    struct Payment {
        address buyer;
        address seller;
        uint256 amount;
        bool isPaid;
    }

    mapping(uint256 => Payment) public payments;

    event PaymentInitiated(uint256 productId, address indexed buyer, address indexed seller, uint256 amount);
    event PaymentReleased(uint256 productId, address indexed seller);
    event PaymentRefunded(uint256 productId, address indexed buyer);

    function initiatePayment(uint256 productId, address seller) public payable {
        require(msg.value > 0, "Must send payment.");
        require(payments[productId].amount == 0, "Payment already exists.");

        payments[productId] = Payment(msg.sender, seller, msg.value, false);
        emit PaymentInitiated(productId, msg.sender, seller, msg.value);
    }

    function confirmDelivery(uint256 productId) public {
        Payment storage payment = payments[productId];
        require(msg.sender == payment.buyer, "Only buyer can confirm.");
        require(!payment.isPaid, "Already paid.");

        payable(payment.seller).transfer(payment.amount);
        payment.isPaid = true;

        emit PaymentReleased(productId, payment.seller);
    }

    function refundBuyer(uint256 productId) public {
        Payment storage payment = payments[productId];
        require(msg.sender == payment.buyer, "Only buyer can request refund.");
        require(!payment.isPaid, "Already paid.");

        payable(payment.buyer).transfer(payment.amount);
        delete payments[productId];

        emit PaymentRefunded(productId, payment.buyer);
    }
}
