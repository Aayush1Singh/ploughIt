import { ethers } from "ethers";
import api from "./axiosApi";
export const getAndVerifyContract = async () => {
  try {
    const response = await api.get("http://localhost:3000/get-wallet");
    const { address, signature, publicKey } = await response.json();
    // Verify the signature
    const signer = ethers.verifyMessage(address, signature);

    if (signer.toLowerCase() === publicKey.toLowerCase()) {
      console.log("Verified! Using contract:", address);
      return address;
    } else {
      console.error("🚨 Tampering detected! Contract address might be fake.");
      return null;
    }
  } catch (error) {
    console.error("Error verifying contract:", error);
  }
};
