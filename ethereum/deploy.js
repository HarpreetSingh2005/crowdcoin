require("dotenv").config();

const HDWalletProvider = require("@truffle/hdwallet-provider");
const { Web3 } = require("web3");
const { abi, evm } = require("./build/CampaignFactory.json");

const bytecode = evm.bytecode.object
  ? "0x" + evm.bytecode.object
  : evm.bytecode;
const provider = new HDWalletProvider(
  process.env.MNEMONIC,
  process.env.INFURA_URL
);
const web3 = new Web3(provider);

// console.log(JSON.stringify(interface,null,2));// to get the full JSON abi

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();
  console.log("Attemption to deploy from account", accounts[0]);

  const result = await new web3.eth.Contract(abi)
    .deploy({ data: bytecode })
    .send({ gas: "3000000", from: accounts[0] });

  console.log("Contract deployment to", result.options.address);
  provider.engine.stop();
};

deploy();
