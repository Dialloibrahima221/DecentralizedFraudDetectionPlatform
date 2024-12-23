import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { CONTRACT } from "../config/constants";
import FRAUD_LOGGER_ABI from "../config/FRAUD_LOGGER_ABI.json"
import SnackbarComponent from "./SnackbarComponent";
 
import { ethers } from "ethers";
Modal.setAppElement("#root"); // Accessibility

const LogFraudModal = ({ isOpen, onClose }) => {
  const [transactionHash, setTransactionHash] = useState("");
  const [fraudScore, setFraudScore] = useState("");
  const [timestamp, setTimestamp] = useState("");
  const [fraudType, setFraudType] = useState("");
  const [loader, setLoader] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const {  writeContractAsync } = useWriteContract();
    const [txn,settxn] = useState(null);
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try{

      const args = [
        ethers.utils.formatBytes32String(transactionHash),
         parseInt(fraudScore, 10),
        parseInt(timestamp, 10),
        fraudType
      ] ;

      setLoader(true);

      const  result = await writeContractAsync({
        address: CONTRACT,
        abi: FRAUD_LOGGER_ABI,
        functionName: "logFraud",
        args: args,
        value: 0
      })

      settxn(result)
    }
    catch(e){
        console.log(e)
        setSnackbar({ open: true, message: "Failed to log fraud. Please try again.", severity: "error" });
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
    if(logwaitfortxn?.isSuccess){
        setSnackbar({ open: true, message: "Fraud logged successfully!", severity: "success" });
        setLoader(false);

    }
    else if(logwaitfortxn?.isError){
        setSnackbar({ open: true, message: "Failed to log fraud. Please check transaction.", severity: "error" });
        setLoader(false);

    }
},[logwaitfortxn])

const reset = () => {
    setFraudScore("")
    setTransactionHash("")
    setFraudType("")
    setTimestamp("")
}
  return (
<>

    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Log Fraud Modal"
      style={{
        content: {
          top: "50%",
          left: "50%",
          right: "auto",
          bottom: "auto",
          marginRight: "-50%",
          transform: "translate(-50%, -50%)",
          width: "400px",
          borderRadius: "10px",
          padding: "20px",
        },
      }}
    >
      <h2>Log Fraud</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "10px" }}>
          <label>Transaction Hash:</label>
          <input
            type="text"
            value={transactionHash}
            onChange={(e) => setTransactionHash(e.target.value)}
            required
            style={{ width: "90%", padding: "8px", marginTop: "5px" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Fraud Score:</label>
          <input
            type="number"
            value={fraudScore}
            onChange={(e) => setFraudScore(e.target.value)}
            required
            style={{ width: "90%", padding: "8px", marginTop: "5px" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Timestamp:</label>
          <input
            type="number"
            value={timestamp}
            onChange={(e) => setTimestamp(e.target.value)}
            required
            style={{ width: "90%", padding: "8px", marginTop: "5px" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Fraud Type:</label>
          <input
            type="text"
            value={fraudType}
            onChange={(e) => setFraudType(e.target.value)}
            required
            style={{ width: "90%", padding: "8px", marginTop: "5px" }}
          />
        </div>
        <button type="submit" disabled={loader} style={{ padding: "10px 20px", cursor: "pointer" }}>
          {loader  ?  "Confirming"  : logwaitfortxn?.isLoading ? "Processing..." : "Log Fraud" }
        </button>

         
        <button
          type="button"
          onClick={onClose}
          style={{
            padding: "10px 20px",
            marginLeft: "10px",
            cursor: "pointer",
            backgroundColor: "#ccc",
          }}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={reset}
          style={{
            padding: "10px 20px",
            marginLeft: "10px",
            cursor: "pointer",
            backgroundColor: "#ccc",
          }}
        >
          Reset
        </button>
      </form>
    </Modal>

<SnackbarComponent
open={snackbar.open}
onClose={handleSnackbarClose}
message={snackbar.message}
severity={snackbar.severity}
/>

</>
  );
};

export default LogFraudModal;
