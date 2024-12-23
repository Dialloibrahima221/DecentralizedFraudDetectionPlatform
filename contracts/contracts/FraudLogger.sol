// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Contract to manage and record specific transaction details.
contract FraudLogger {
    struct FraudMetadata {
        bytes32 transactionHash; // Identifier for the transaction.
        uint256 fraudScore;      // Numerical evaluation of fraud severity.
        uint256 timestamp;       // Time of fraud occurrence.
        string fraudType;        // Category or type of the fraud.
    }

    // Storage for all recorded fraud metadata.
    FraudMetadata[] private fraudLogs;
    // Tracker for processed transaction hashes to prevent duplicates.
    mapping(bytes32 => bool) private fraudTxns;

    // Owner of the contract with management rights.
    address public owner;
    // Registry of entities permitted to interact with sensitive functions.
    mapping(address => bool) public authorizedEntities;

    // Event for notifying fraud entries.
    event FraudLogged(bytes32 indexed transactionHash, uint256 fraudScore, uint256 timestamp, string fraudType);
    // Event for tracking entity authorizations.
    event EntityAuthorized(address indexed entity);
    // Event for tracking authorization revocations.
    event EntityRevoked(address indexed entity);

    // Ensures only the owner can execute specific actions.
    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized: Only owner");
        _;
    }

    // Ensures only authorized accounts can execute certain functions.
    modifier onlyAuthorized() {
        require(authorizedEntities[msg.sender], "Not authorized: Entity not authorized");
        _;
    }

    // Initializes the contract and sets the deployer as the owner.
    constructor() {
        owner = msg.sender;
    }

    // Grants permissions to specified entities.
    function authorizeEntity(address entity) external onlyOwner {
        authorizedEntities[entity] = true; // Adds entity to the authorized list.
        emit EntityAuthorized(entity);    // Triggers an event for tracking.
    }

    // Revokes previously granted permissions.
    function revokeEntity(address entity) external onlyOwner {
        authorizedEntities[entity] = false; // Removes entity from the authorized list.
        emit EntityRevoked(entity);        // Logs the change.
    }

    // Adds a new fraud record, ensuring uniqueness of transactions.
    function logFraud(
        bytes32 _transactionHash,
        uint256 _fraudScore,
        uint256 _timestamp,
        string calldata _fraudType
    ) external onlyAuthorized {
        require(!fraudTxns[_transactionHash], "Fraud already logged for this transaction"); // Prevents duplicates.

        FraudMetadata memory newLog = FraudMetadata({
            transactionHash: _transactionHash,
            fraudScore: _fraudScore,
            timestamp: _timestamp,
            fraudType: _fraudType
        });

        fraudLogs.push(newLog); // Adds the entry to storage.
        fraudTxns[_transactionHash] = true; // Marks the transaction as logged.

        emit FraudLogged(_transactionHash, _fraudScore, _timestamp, _fraudType); // Emits a logging event.
    }

    // Provides access to all logged records.
    function getFraudLogs() external view returns (FraudMetadata[] memory) {
        return fraudLogs; // Returns the array of logs.
    }
}
