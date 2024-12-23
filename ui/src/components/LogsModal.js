import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { ethers } from "ethers";
import { useReadContract } from "wagmi";
import { CONTRACT } from "../config/constants";
import FRAUD_LOGGER_ABI from "../config/FRAUD_LOGGER_ABI.json"
Modal.setAppElement("#root");

const LogsModal = ({ isOpen, onClose, contract }) => {
//   const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);


  const   {data: logs}   = useReadContract({
    address: CONTRACT,
    abi: FRAUD_LOGGER_ABI,
    functionName: "getFraudLogs",
    args: [],
    // chainId: parseInt(launchpad?.chainId)
  }
  );

  console.log(logs)

  useEffect(() => {
    if(logs){
        setLoading(false)
    }
  },[logs])

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Logs Modal"
      style={{
        content: {
          top: "50%",
          left: "50%",
          right: "auto",
          bottom: "auto",
          marginRight: "-50%",
          transform: "translate(-50%, -50%)",
          width: "600px",
          borderRadius: "10px",
          padding: "20px",
        },
      }}
    >
      <h2>Fraud Logs</h2>
      {loading ? (
        <p>Loading logs...</p>
      ) : logs.length === 0 ? (
        <p>No logs found.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ borderBottom: "1px solid #ddd", padding: "8px" }}>Transaction Hash</th>
              <th style={{ borderBottom: "1px solid #ddd", padding: "8px" }}>Fraud Score</th>
              <th style={{ borderBottom: "1px solid #ddd", padding: "8px" }}>Timestamp</th>
              <th style={{ borderBottom: "1px solid #ddd", padding: "8px" }}>Fraud Type</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, index) => (
              <tr key={index}>
                <td style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>{ethers.utils.parseBytes32String(log.transactionHash)}</td>
                <td style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>{log.fraudScore}</td>
                <td style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>{log.timestamp}</td>
                <td style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>{log.fraudType}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <button
        onClick={onClose}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          backgroundColor: "#007BFF",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Close
      </button>
    </Modal>
  );
};

export default LogsModal;
