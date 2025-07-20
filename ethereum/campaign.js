import web3 from './web3';
import CampaignABI from './build/Campaign.json';

const Campaign = (address) => {
  return new web3.eth.Contract(CampaignABI.abi, address);
};

export default Campaign;