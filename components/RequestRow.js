import React, { Component } from "react";
import { Table, Button } from "semantic-ui-react";
import web3 from "../ethereum/web3";
import Campaign from "../ethereum/campaign";

class RequestRow extends Component {
  state = {
    approveloading: false,
    finalizeloading: false,
  };

  onApprove = async () => {
    this.props.onError("");
    this.setState({ approveloading: true });
    try {
      const campaign = Campaign(this.props.address);
      const accounts = await web3.eth.getAccounts();
      await campaign.methods.approveRequest(this.props.id).send({
        from: accounts[0],
      });
    } catch (err) {
      this.props.onError?.(err.message || "Something went wrong during approval");
    }
    this.setState({ approveloading: false });
  };

  onFinalize = async () => {
    this.props.onError("");
    this.setState({ finalizeloading: true });
    try {
      const campaign = Campaign(this.props.address);
      const accounts = await web3.eth.getAccounts();
      await campaign.methods.finalizeRequest(this.props.id).send({
        from: accounts[0],
        gas: "10000000",
      });
    } catch (err) {
      this.props.onError?.(err.message || "Something went wrong during finalization.");
    }
    this.setState({ finalizeloading: false });
  };

  render() {
    const { Row, Cell } = Table;
    const { displayIndex, request, approversCount } = this.props;
    const readyToFinalize = request.approvalCount > approversCount / 2;

    return (
      <Row disabled={request.complete} positive={readyToFinalize && !request.complete}>
        <Cell>{displayIndex + 1}</Cell>
        <Cell>{request.description}</Cell>
        <Cell>{web3.utils.fromWei(request.value, "ether")}</Cell>
        <Cell>{request.recipient}</Cell>
        <Cell>{request.approvalCount}/{approversCount}</Cell>

        {/* Approve Button */}
        <Cell>
          {!request.complete && (
            <Button
              loading={this.state.approveloading}
              style={{
                backgroundColor: this.state.approveloading ? "green" : "white",
                color: this.state.approveloading ? "white" : "green",
                border: "1px solid green",
                transition: "0.3s ease",
              }}
              onMouseEnter={(e) => {
                if (!this.state.approveloading) {
                  e.target.style.backgroundColor = "green";
                  e.target.style.color = "white";
                }
              }}
              onMouseLeave={(e) => {
                if (!this.state.approveloading) {
                  e.target.style.backgroundColor = "white";
                  e.target.style.color = "green";
                }
              }}
              onClick={this.onApprove}
            >
              Approve
            </Button>
          )}
        </Cell>

        {/* Finalize Button */}
        <Cell>
          {!request.complete && (
            <Button
              loading={this.state.finalizeloading}
              style={{
                backgroundColor: this.state.finalizeloading ? "teal" : "white",
                color: this.state.finalizeloading ? "white" : "teal",
                border: "1px solid teal",
                transition: "0.3s ease",
              }}
              onMouseEnter={(e) => {
                if (!this.state.finalizeloading) {
                  e.target.style.backgroundColor = "teal";
                  e.target.style.color = "white";
                }
              }}
              onMouseLeave={(e) => {
                if (!this.state.finalizeloading) {
                  e.target.style.backgroundColor = "white";
                  e.target.style.color = "teal";
                }
              }}
              onClick={this.onFinalize}
            >
              Finalize
            </Button>
          )}
        </Cell>
      </Row>
    );
  }
}

export default RequestRow;
