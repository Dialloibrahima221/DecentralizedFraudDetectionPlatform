import { ConnectButton } from "@rainbow-me/rainbowkit";
import React, { useEffect, useState } from "react";
import { useAccount, useReadContract, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import LogFraudModal from "./LogFraudModal";
import { CONTRACT } from "../config/constants";
import FRAUD_LOGGER_ABI from "../config/FRAUD_LOGGER_ABI.json"
import SnackbarComponent from "./SnackbarComponent";
import LogsModal from "./LogsModal";

const CenteredSection = ({ message, buttonText, onButtonClick }) => {
  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh", // Full page height
    textAlign: "center",
  };

  const messageStyle = {
    marginBottom: "20px", // Space between message and button
    fontSize: "1.5rem",
    color: "#333",
  };

  const buttonStyle = {
    padding: "10px 20px",
    fontSize: "1rem",
    color: "#fff",
    backgroundColor: "#007BFF",
    border: "none",
    marginRight: "10px",
    display: "block",
    borderRadius: "5px",
    cursor: "pointer",
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isLogsModalOpen, setIsLogsModalOpen] = useState(false);


  const { address } = useAccount();



  const [authorizeAddress, setAuthorizeAddress] = useState("");

  const [loader, setLoader] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const {  writeContractAsync } = useWriteContract();
  const [txn, settxn] = useState(null);




  const   {data: owner}   = useReadContract({
    address: CONTRACT,
    abi: FRAUD_LOGGER_ABI,
    functionName: "owner",
    args: [], 
  }
  );


  const   {data: authorized}   = useReadContract({
    address: CONTRACT,
    abi: FRAUD_LOGGER_ABI,
    functionName: "authorizedEntities",
    args: [address],
    // chainId: parseInt(launchpad?.chainId)
  }
  );


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      const args = [
        authorizeAddress
      ];

      setLoader(true);

      const result = await writeContractAsync({
        address: CONTRACT,
        abi: FRAUD_LOGGER_ABI,
        functionName: "authorizeEntity",
        args: args,
        value: 0
      })

      settxn(result)
    }
    catch (e) {
      console.log(e)
      setSnackbar({ open: true, message: "Failed to authorized address. Please try again.", severity: "error" });
      setLoader(false);

    }

  };


  const
    logwaitfortxn
      // data: createTokenData,
      = useWaitForTransactionReceipt({
        hash: txn,
      });

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  useEffect(() => {
    if (logwaitfortxn?.isSuccess) {
      setSnackbar({ open: true, message: "Address Authorized successfully!", severity: "success" });
      setLoader(false);
      setAuthorizeAddress(null)

    }
    else if (logwaitfortxn?.isError) {
      setSnackbar({ open: true, message: "Failed to authorized address. Please check transaction.", severity: "error" });
      setLoader(false);

    }
  }, [logwaitfortxn])


  return (
    <div style={containerStyle}>

      {
        !address &&
        <>
          <div style={messageStyle}>{message}</div>

        </>

      }
      <ConnectButton />

      {
        address &&
        <div style={{ marginTop: "10px", display: "flex", alignItems: "justify" }}>
          {
            authorized &&
            <button style={buttonStyle} onClick={() => setIsModalOpen(true)} >Log a Fraud</button>

          }
          <button style={buttonStyle}          onClick={() => setIsLogsModalOpen(true)}           >View Logs</button>
        </div>
      }

{
        address && owner == address &&
        <>
            <input type="text" onChange={(e) => setAuthorizeAddress(e.target.value)} placeholder="Enter address to authorize" style={{ width: "220px", padding: "8px", margin: "15px 0px" }} />
            <button disabled={loader} style={buttonStyle} onClick={handleSubmit} > {loader ? "Confirming" : logwaitfortxn?.isLoading ? "Processing..." : "Authorize"} </button>
        </>
  
}
      <LogsModal
        isOpen={isLogsModalOpen}
        onClose={() => setIsLogsModalOpen(false)} 
      />
      <LogFraudModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}

      />
      <SnackbarComponent
        open={snackbar.open}
        onClose={handleSnackbarClose}
        message={snackbar.message}
        severity={snackbar.severity}
      />
    </div>
  );
};

export default CenteredSection;
