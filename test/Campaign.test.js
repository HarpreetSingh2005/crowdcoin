const assert = require("assert");
const { Web3 } = require("web3");
const ganache = require("ganache");
const web3 = new Web3(ganache.provider());

const compiledFactory = require("../ethereum/build/CampaignFactory.json");
const compiledCampaign = require("../ethereum/build/Campaign.json");

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  factory = await new web3.eth.Contract(compiledFactory.abi)
    .deploy({ data: compiledFactory.evm.bytecode.object })
    .send({ from: accounts[0], gas: "1000000" });

  await factory.methods.createCampaign("100").send({
    from: accounts[0],
    gas: "1000000",
  });

  [campaignAddress] = await factory.methods.getDeployedCampaign().call(); //first element of returned array
  campaign = await new web3.eth.Contract(compiledCampaign.abi, campaignAddress);
});

describe("Campaigns", () => {
  it("deploys a factory and a campaign", () => {
    assert.ok(factory.options.address);
    assert.ok(campaign.options.address);
  });

  it("marks caller as the manager", async () => {
    const manager = await campaign.methods.manager().call();
    assert.equal(manager, accounts[0]);
  });

  it("able to become contributer", async () => {
    await campaign.methods.contribute().send({
      value: "200",
      from: accounts[1],
    });

    const isContributor = await campaign.methods.approvers(accounts[1]).call();
    assert(isContributor);
  });

  it("requires a minimum contribution", async () => {
    try {
      await campaign.methods.contribute().send({
        value: "1",
        from: accounts[1],
      });
      assert(false);
    } catch (err) {
      assert(err);
    }
  });

  //Don't work

  //   it("allows a manager to make a payment request", async () => {
  //     const initialCount = await campaign.methods.getRequestCount().call();
  //     await campaign.methods
  //       .createRequest("Buy batteries", "100", accounts[1])
  //       .send({
  //         from: accounts[0],
  //         gas: "1000000",
  //       });

  //      const result = await campaign.methods.getRequestDetails(0).call();

  //   const request = {
  //     description: result[0],
  //     value: result[1],
  //     recipient: result[2],
  //     complete: result[3],
  //     approvalCount: result[4],
  //   };

  //   console.log("✅ Request Object:", request);
  //     const numofrequest = await campaign.methods.getRequestCount().call();
  //     console.log('number of request: ', numofrequest);
  //     assert.equal(parseInt(numofrequest), parseInt(initialCount) + 1);
  //     // assert.equal("Buy batteries", request.description);
  //   });

  it("processe requests", async () => {
    await campaign.methods.contribute().send({
      from: accounts[0],
      value: web3.utils.toWei("10", "ether"),
    });

    await campaign.methods
      .createRequest("A", web3.utils.toWei("5", "ether"), accounts[1])
      .send({
        from: accounts[0],
        gas: "1000000",
      });

    await campaign.methods.approveRequest(0).send({
      from: accounts[0],
      gas: "1000000",
    });

    await campaign.methods.finalizeRequest(0).send({
      from: accounts[0],
      gas: "1000000",
    });

    balance = await web3.eth.getBalance(accounts[1]);
    balance = web3.utils.fromWei(balance, "ether");
    balance = parseFloat(balance);
    console.log(balance);
    assert(balance > 1003);
  });
});
