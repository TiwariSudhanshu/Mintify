const { expect } = require("chai");
const hre = require("hardhat");

describe("SupplyChainVerification", function () {
    let contract, owner, user1, user2;

    beforeEach(async function () {
        // Get signers
        [owner, user1, user2] = await hre.ethers.getSigners();
        
        // Deploy contract
        const SupplyChainFactory = await hre.ethers.getContractFactory("SupplyChainVerification");
        contract = await SupplyChainFactory.deploy();
        
        // Wait for deployment
        await contract.deploymentTransaction().wait();
    });

    it("Should add stakeholders", async function () {
        await contract.addStakeholder(user1.address, "Manufacturer");
        expect(await contract.stakeholders(user1.address)).to.equal("Manufacturer");
    });

    it("Should record product movement", async function () {
        await contract.recordMovement(1, user1.address, user2.address);
        const history = await contract.getProductHistory(1);
        expect(history.length).to.equal(1);
    });
});