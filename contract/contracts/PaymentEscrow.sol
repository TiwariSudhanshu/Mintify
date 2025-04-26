// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract PaymentEscrow {
    struct Payment {
        address buyer;
        address seller;
        uint256 amount;
        bool isPaid;
        bool exists;
    }

    mapping(uint256 => Payment) public payments;

    event PaymentInitiated(uint256 productId, address indexed buyer, address indexed seller, uint256 amount);
    event PaymentApproved(uint256 productId, address indexed seller);
    event PaymentRejected(uint256 productId, address indexed buyer);
    event PaymentReleased(uint256 productId, address indexed seller);
    event PaymentRefunded(uint256 productId, address indexed buyer);

    // Buyer initiates payment
    function initiatePayment(uint256 productId, address seller) public payable {
        require(msg.value > 0, "Must send payment.");
        require(!payments[productId].exists, "Payment already exists.");

        payments[productId] = Payment({
            buyer: msg.sender,
            seller: seller,
            amount: msg.value,
            isPaid: false,
            exists: true
        });

        emit PaymentInitiated(productId, msg.sender, seller, msg.value);
    }

    // Seller approves payment (releases funds)
    function approvePayment(uint256 productId) public {
        Payment storage payment = payments[productId];
        require(payment.exists, "Payment does not exist.");
        require(msg.sender == payment.seller, "Only seller can approve.");
        require(!payment.isPaid, "Payment already processed.");

        payment.isPaid = true;
        payable(payment.seller).transfer(payment.amount);

        emit PaymentApproved(productId, msg.sender);
        emit PaymentReleased(productId, msg.sender);
    }

    // Seller rejects payment (refunds buyer)
    function rejectPayment(uint256 productId) public {
        Payment storage payment = payments[productId];
        require(payment.exists, "Payment does not exist.");
        require(msg.sender == payment.seller, "Only seller can reject.");
        require(!payment.isPaid, "Payment already processed.");

        payable(payment.buyer).transfer(payment.amount);
        delete payments[productId];

        emit PaymentRejected(productId, payment.buyer);
        emit PaymentRefunded(productId, payment.buyer);
    }
}
