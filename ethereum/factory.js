require("dotenv").config();

import web3 from "./web3";
import CampaignFactory from "./build/CampaignFactory.json";

const instance = new web3.eth.Contract(
    CampaignFactory.abi,
    process.env.FACTORY_CONTRACT_ADDRESS
);

export default instance;