async function main() {
    const FraudLogger = await ethers.getContractFactory("FraudLogger");
    const fraudLogger = await FraudLogger.deploy();
    console.log(fraudLogger)
    console.log("FraudLogger deployed to:", fraudLogger.target);
  }
  
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
  