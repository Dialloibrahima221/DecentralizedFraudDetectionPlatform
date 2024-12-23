const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("FraudLogger", function () {
  let FraudLogger, fraudLogger, owner, authorized, unauthorized;

  beforeEach(async function () {
    // Setup test accounts and deploy the contract
    [owner, authorized, unauthorized] = await ethers.getSigners(); // Get the owner, authorized, and unauthorized accounts
    FraudLogger = await ethers.getContractFactory("FraudLogger"); // Get the contract factory
    fraudLogger = await FraudLogger.deploy(); // Deploy the contract
    await fraudLogger.waitForDeployment(); // Wait for deployment to complete
  });

  describe("Ownership and Authorization", function () {
    it("Should set the correct owner", async function () {
      // Verify that the owner address is correctly set
      expect(await fraudLogger.owner()).to.equal(owner.address);
    });

    it("Should allow owner to authorize an entity", async function () {
      // Authorize an entity and check that the event is emitted
      await expect(fraudLogger.connect(owner).authorizeEntity(authorized.address))
        .to.emit(fraudLogger, "EntityAuthorized")
        .withArgs(authorized.address);

      // Ensure the entity is marked as authorized
      expect(await fraudLogger.authorizedEntities(authorized.address)).to.be.true;
    });

    it("Should allow owner to revoke an entity", async function () {
      // First, authorize the entity
      await fraudLogger.connect(owner).authorizeEntity(authorized.address);

      // Revoke the entity's authorization and verify the event
      await expect(fraudLogger.connect(owner).revokeEntity(authorized.address))
        .to.emit(fraudLogger, "EntityRevoked")
        .withArgs(authorized.address);

      // Ensure the entity is no longer authorized
      expect(await fraudLogger.authorizedEntities(authorized.address)).to.be.false;
    });

    it("Should not allow unauthorized entity to log fraud", async function () {
      // Attempt to log fraud with an unauthorized account
      await expect(
        fraudLogger.connect(unauthorized).logFraud(
          ethers.keccak256(ethers.toUtf8Bytes("tx1")), // Transaction hash
          85, // Fraud score
          Math.floor(Date.now() / 1000), // Current timestamp
          "Phishing" // Fraud type
        )
      ).to.be.revertedWith("Not authorized: Entity not authorized"); // Expect revert with specific message
    });
  });

  describe("Fraud Logging", function () {
    beforeEach(async function () {
      // Authorize the `authorized` account for logging fraud
      await fraudLogger.connect(owner).authorizeEntity(authorized.address);
    });

    it("Should allow authorized entity to log fraud", async function () {
      // Define fraud details
      const txHash = ethers.keccak256(ethers.toUtf8Bytes("tx1"));
      const fraudScore = 85;
      const timestamp = Math.floor(Date.now() / 1000);
      const fraudType = "Phishing";

      // Log fraud and check that the event is emitted
      await expect(
        fraudLogger.connect(authorized).logFraud(txHash, fraudScore, timestamp, fraudType)
      )
        .to.emit(fraudLogger, "FraudLogged")
        .withArgs(txHash, fraudScore, timestamp, fraudType);

      // Retrieve the fraud logs and verify the details
      const logs = await fraudLogger.getFraudLogs();
      expect(logs.length).to.equal(1); // Ensure only one log exists
      expect(logs[0].transactionHash).to.equal(txHash); // Check transaction hash
      expect(logs[0].fraudScore).to.equal(fraudScore); // Check fraud score
      expect(logs[0].timestamp).to.equal(timestamp); // Check timestamp
      expect(logs[0].fraudType).to.equal(fraudType); // Check fraud type
    });

    it("Should revert if logging the same transaction hash twice", async function () {
      // Log fraud for the first time
      const txHash = ethers.keccak256(ethers.toUtf8Bytes("tx1"));
      await fraudLogger.connect(authorized).logFraud(txHash, 85, Math.floor(Date.now() / 1000), "Phishing");

      // Attempt to log fraud with the same transaction hash
      await expect(
        fraudLogger.connect(authorized).logFraud(txHash, 90, Math.floor(Date.now() / 1000), "Scam")
      ).to.be.revertedWith("Fraud already logged for this transaction"); // Expect revert
    });
  });
});
