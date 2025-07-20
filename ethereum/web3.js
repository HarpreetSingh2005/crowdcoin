//User must have metamask to use this site
import Web3 from "web3";

// Error
// const web3 = new Web3(window.web3.currentProvider);
// in next server window is not defined therefore cant access window directly

let web3;
if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
  //we are in the browser and metamask is running.
  window.ethereum.request({ method: "eth_requestAccounts" });
  web3 = new Web3(window.ethereum);
} else {
  //we are on the server *OR* the user is not running metamask
  const provider = new Web3.providers.HttpProvider(
    "https://sepolia.infura.io/v3/7872f32dcf5a497a865a0257ef05c34a"
  );
  web3 = new Web3(provider);
}

export default web3;
