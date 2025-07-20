const path = require("path");
const solc = require("solc");
const fs = require("fs-extra");

const buildPath = path.resolve(__dirname, "build");
fs.removeSync(buildPath);

const campaignPath = path.resolve(__dirname, "contracts", "Campaign.sol");

const source = fs.readFileSync(campaignPath, "utf8");

const input = {
  language: "Solidity",
  sources: {
    "Campaign.sol": {
      content: source,
    },
  },
  settings: {
    outputSelection: {
      "*": {
        "*": ["abi", "evm.bytecode"],
      },
    },
    optimizer: {
      enabled: true,
      runs: 200,
    },
  },
};
const compiled = JSON.parse(solc.compile(JSON.stringify(input)));
const contracts = compiled.contracts["Campaign.sol"];
fs.ensureDirSync(buildPath);

for (let contract in contracts) {
  fs.outputJSONSync(
    path.resolve(buildPath, contract + ".json"),
    contracts[contract]
  );
}
