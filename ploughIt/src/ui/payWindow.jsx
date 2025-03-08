import { getAndVerifyContract } from "@/services/getAndVerifyWallet";
import { useState } from "react";
async function payAmount(amount, address) {
  if (window.ethereum) {
    try {
      window.ethereum
        .request({
          method: "eth_sendTransaction",
          params: [
            {
              to: address,
              value: amount,
            },
          ],
        })
        .then((txHash) => console.log(txHash))
        .catch((err) => console.log(err));
      // const addressArray = await window.ethereum.request({
      //   method: "eth_requestAccounts",
      // });
      // return {
      //   addressArray,
      //   message: "Successfully fetched",
      // };
    } catch {
      return { message: "Failed to approve transaction" };
    }
  } else {
    return { message: "Failed to find metamask" };
  }
}
// function payAmount() {}
function PayWindow({ amount }) {
  const [wallAdd, setwallAdd] = useState(null);

  setwallAdd(getAndVerifyContract());

  return (
    <button
      onClick={() => {
        payAmount(amount, wallAdd);
      }}
    >
      PayAmount
    </button>
  );
}

export default payWindow;
