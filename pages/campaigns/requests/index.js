import React, { Component } from "react";
import Layout from "../../../components/Layout";
import { Button, Table, Message, Segment } from "semantic-ui-react";
import { Link } from "../../../routes";
import Campaign from "../../../ethereum/campaign";
import RequestRow from "../../../components/RequestRow";

class RequestIndex extends Component {
  state = {
    errorMessage: "",
  };
  static async getInitialProps(props) {
    const { address } = props.query;

    const campaign = Campaign(address);
    const requestCount = await campaign.methods.getRequestsCount().call();
    const approversCount = await campaign.methods.approversCount().call();
    const requests = [];
    const batchSize = 10; // You can change this to 20, 25, etc.

    for (let i = 0; i < requestCount; i += batchSize) {
      const batch = [];

      for (let j = 0; j < batchSize && i + j < requestCount; j++) {
        batch.push(campaign.methods.requests(i + j).call());
      }

      const results = await Promise.all(batch); // Fetch a batch in parallel
      requests.push(...results); // Append to the main list
    }

    const serializedRequests = requests
      .map((request, index) => ({
        id: index, // used for logic, not display
        description: request.description,
        displayIndex: index,
        value: request.value.toString(),
        recipient: request.recipient,
        complete: request.complete,
        approvalCount: request.approvalCount.toString(),
      }))
      .sort((a, b) => {
        if (a.complete === b.complete) return 0;
        return a.complete ? 1 : -1; // finalized → bottom
      });

    return {
      address,
      requests: serializedRequests,
      requestCount: requestCount.toString(),
      approversCount: approversCount.toString(),
    };
  }
  onError = (msg) => {
    this.setState({ errorMessage: msg });
    setTimeout(() => this.setState({ errorMessage: "" }), 5000);
  };

  renderRows() {
    return this.props.requests.map((request, index) => {
      return (
        <RequestRow
          key={request.id}
          id={request.id}
          request={request}
          displayIndex={index + 1}
          approversCount={this.props.approversCount}
          address={this.props.address}
          onError={(msg) => this.setState({ errorMessage: msg })}
        />
      );
    });
  }

  render() {
    const { Header, Row, HeaderCell, Body } = Table;

    return (
      <Layout>
        <h3>Requests</h3>
        <Link route={`/campaigns/${this.props.address}/requests/new`}>
          <a>
            <Button primary floated="right" style={{ marginBottom: 10 }}>
              Add Request
            </Button>
          </a>
        </Link>
        <Table>
          <Header>
            <Row>
              <HeaderCell>ID</HeaderCell>
              <HeaderCell>Description</HeaderCell>
              <HeaderCell>Amount (ether)</HeaderCell>
              <HeaderCell>Recipient</HeaderCell>
              <HeaderCell>Approveral Count</HeaderCell>
              <HeaderCell>Approve</HeaderCell>
              <HeaderCell>Finalize</HeaderCell>
            </Row>
          </Header>
          <Body>{this.renderRows()}</Body>
        </Table>
        <div>
           {this.state.errorMessage && (
            <Message
              error
              content={this.state.errorMessage}
              onDismiss={() => this.setState({ errorMessage: "" })}
              style={{ wordWrap: "break-word", marginTop: "1rem" }}
            />
          )}
        </div>
        <div>Found {this.props.requestCount}</div>
      </Layout>
    );
  }
}

export default RequestIndex;
