// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <=0.9.0;

contract CampaignFactory {
    address[] public deployedCampaigns;
    function createCampaign(uint minimum, string memory _CampaignName, string memory _CreationDate) public {
        address campaign = address(
            new Campaign(minimum, msg.sender, _CampaignName, _CreationDate)
        );
        deployedCampaigns.push(campaign);
    }

    function getDeployedCampaign() public view returns (address[] memory) {
        return deployedCampaigns;
    }
}

contract Campaign {
    struct Request {
        string description;
        uint value;
        address payable recipient;
        bool complete;
        mapping(address => bool) approvals;
        uint approvalCount;
    } //does not create an instance, it just create a definition

    string public CampaignName;
    string public CreationDate;
    address public manager;
    uint public minimumContribution;
    mapping(address => bool) public approvers;
    uint public approversCount;
    Request[] public requests;
    uint public ContributedMoney;

    modifier restricted() {
        require(msg.sender == manager, "You are not manager");
        _;
    }

    constructor(uint minimum, address creator, string memory _CampaignName, string memory _CreationDate) {
        manager = creator;
        CampaignName = _CampaignName;
        CreationDate = _CreationDate;
        minimumContribution = minimum;
    }

    function contribute() public payable {
        require(
            msg.value >= minimumContribution,
            "Minimum amount required not met"
        );
        
        if (!approvers[msg.sender]) {
            approvers[msg.sender] = true;
            approversCount++;
        }
        ContributedMoney += msg.value;
    }

    function createRequest(
        string memory _description,
        uint _value,
        address payable _recipient
    ) public restricted {
        requests.push();
        Request storage newRequest = requests[requests.length - 1];
        newRequest.description = _description;
        newRequest.recipient = _recipient;
        newRequest.value = _value;
        newRequest.complete = false;
        newRequest.approvalCount = 0;
    }

    function approveRequest(uint index) public {
        Request storage request = requests[index];

        require(
            approvers[msg.sender] == true,
            "You are not eligible to approve. First donate some money then approve"
        );
        require(
            request.approvals[msg.sender] == false,
            "You have already voted"
        );
        request.approvals[msg.sender] = true;
        request.approvalCount++;
    }

    function finalizeRequest(uint index) public payable restricted {
        Request storage request = requests[index];

        require(!request.complete, "Request has already been finalised");
        require(
            request.approvalCount > ((approversCount) / 2),
            "Need more number of approvers to finalize request"
        );
        request.recipient.transfer(request.value);
        request.complete = true;
    }
    function getRequestsCount() public view returns (uint) {
        return requests.length;
    }
    function getSummary()
        public
        view
        returns (uint, uint, uint, uint, address, uint)
    {
        return (
            minimumContribution,
            address(this).balance,
            requests.length,
            approversCount,
            manager,
            ContributedMoney
        );
    }
}
