The **Decentralized Fraud Detection Platform** combines **AI-powered fraud detection** with **blockchain technology** to ensure transparency, auditability, and secure data sharing. This platform is organized into three main components:

## Project Structure
1. **`detection/`** - AI Component
   - Contains AI models and logic for detecting fraudulent transactions.
   - Includes scripts for data processing, fraud detection, and model evaluation.
   - **Dataset**: The platform uses the Credit Card Fraud Detection dataset from Kaggle for training and evaluation: https://www.kaggle.com/datasets/mlg-ulb/creditcardfraud

2. **`contracts/`** - Smart Contract Integration
   - Implements Ethereum smart contracts for:
     - Logging fraud metadata (e.g., transaction hash, fraud score, timestamp, fraud type).
     - Querying fraud-related data.
     - Enforcing access control for authorized interactions.
   - Includes testing scripts for secure and reliable blockchain interactions.

3. **`ui/`** - Frontend Integration
   - A web-based dashboard allowing users to:
     - View flagged fraud cases with metadata.
     - Log and query fraud data via the smart contracts.
     - Connect wallets for blockchain interaction.
