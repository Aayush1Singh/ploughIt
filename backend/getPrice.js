const { Web3 } = require("web3");

const web3 = new Web3("YOUR_CHAINSTACK_ENDPOINT");

// Object with the smart contracts for the pairs
const pairs = {
  "BTC / USD": "0xF4030086522a5bEEa4988F8cA5B36dbC97BeE88c",
  "ETH / USD": "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419",
  "LINK / USD": "0x2c1d072e956AFFC0D435Cb7AC38EF18d24d9127c",
  "BNB / USD": "0x14e613AC84a31f709eadbdF89C6CC390fDc9540A",
  "LTC / USD": "0x6AF09DF7563C363B5763b9102712EbeD3b9e859B",
};

// aggregatorV3Interface ABI
const aggregatorV3InterfaceABI = [
  {
    inputs: [],
    name: "decimals",
    outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "description",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint80", name: "_roundId", type: "uint80" }],
    name: "getRoundData",
    outputs: [
      { internalType: "uint80", name: "roundId", type: "uint80" },
      { internalType: "int256", name: "answer", type: "int256" },
      { internalType: "uint256", name: "startedAt", type: "uint256" },
      { internalType: "uint256", name: "updatedAt", type: "uint256" },
      { internalType: "uint80", name: "answeredInRound", type: "uint80" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "latestRoundData",
    outputs: [
      { internalType: "uint80", name: "roundId", type: "uint80" },
      { internalType: "int256", name: "answer", type: "int256" },
      { internalType: "uint256", name: "startedAt", type: "uint256" },
      { internalType: "uint256", name: "updatedAt", type: "uint256" },
      { internalType: "uint80", name: "answeredInRound", type: "uint80" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "version",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
];

let conversionRate = {};

async function fetchPrices() {
  try {
    for (let pair in pairs) {
      // Smart contract instance
      const priceFeed = new web3.eth.Contract(
        aggregatorV3InterfaceABI,
        pairs[pair]
      );

      // use eth_call
      const roundData = await priceFeed.methods.latestRoundData().call();
      // Chainlink returns price data with 8 decimal places for accuracy.
      // We divide by 1e8 to convert it to a human-readable format.
      const price = Number(roundData.answer) / 1e8;
      conversionRate[pair] = price.toFixed(2);
    }

    console.log("Prices fetched:", conversionRate);
  } catch (error) {
    console.error("Error fetching prices:", error);
  }
}

// Fetch prices initially and then at regular intervals
fetchPrices();
setInterval(fetchPrices, 60 * 1000); // Fetch every minute
