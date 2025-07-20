import React, { Component } from "react";
import Layout from "../../../components/Layout";
import { Button, Form, Message, Input } from "semantic-ui-react";
import web3 from "../../../ethereum/web3";
import Campaign from "../../../ethereum/campaign";
import { Link, Router } from "../../../routes";

class RequestNew extends Component {
  state = {
    value: "",
    description: "",
    recipient: "",
    errorMessage: "",
    loading: false,
    balance: "",
    createBtnHover: false,
  };

  static async getInitialProps(props) {
    const { address } = props.query;
    return { address };
  }

  async componentDidMount() {
    const campaign = Campaign(this.props.address);
    const balanceInWei = await web3.eth.getBalance(campaign.options.address);
    const balanceInEther = web3.utils.fromWei(balanceInWei, "ether");
    this.setState({ balance: balanceInEther });
  }

  onSubmit = async (event) => {
    event.preventDefault();
    const { description, value, recipient } = this.state;
    const campaign = Campaign(this.props.address);

    this.setState({ loading: true, errorMessage: "" });

    try {
      const accounts = await web3.eth.getAccounts();
      const valueInWei = web3.utils.toWei(value, "ether");
      const balance = await web3.eth.getBalance(campaign.options.address);

      if (BigInt(valueInWei) < 1n) {
        throw new Error(
          "Amount is too small. Must be at least 0.000000000000000001 Ether (1 wei)."
        );
      }

      if (BigInt(valueInWei) > BigInt(balance)) {
        throw new Error("Entered value exceeds campaign's available balance.");
      }

      await campaign.methods
        .createRequest(description, valueInWei, recipient)
        .send({ from: accounts[0] });

      Router.pushRoute(`/campaigns/${this.props.address}/requests`);
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }

    this.setState({ loading: false });
  };

  render() {
    const { loading, createBtnHover } = this.state;

    return (
      <Layout>
        <Link route={`/campaigns/${this.props.address}/requests`}>
          <a>
            <Button
              icon="arrow left"
              content="Back"
              basic
              style={{
                backgroundColor: "#f0f0f0",
                color: "#1a1a1a",
                border: "1px solid #ccc",
                borderRadius: "6px",
                marginBottom: "1rem",
              }}
            />
          </a>
        </Link>

        <h3>Create a New Request</h3>
        <p>Available campaign balance: {this.state.balance} Ether</p>

        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          <Form.Field>
            <label>Description</label>
            <Input
              value={this.state.description}
              onChange={(e) => this.setState({ description: e.target.value })}
            />
          </Form.Field>

          <Form.Field>
            <label>Value in Ether</label>
            <Input
              value={this.state.value}
              onChange={(e) => this.setState({ value: e.target.value })}
              label="ether"
              labelPosition="right"
            />
            {this.state.value && !isNaN(this.state.value) && (
              <p style={{ color: "#555", marginTop: "5px" }}>
                Wei equivalent:{" "}
                {BigInt(web3.utils.toWei(this.state.value, "ether")).toString()}
              </p>
            )}
          </Form.Field>

          <Form.Field>
            <label>Recipient</label>
            <Input
              value={this.state.recipient}
              onChange={(e) => this.setState({ recipient: e.target.value })}
            />
          </Form.Field>

          <Message
            error
            header="Oops!"
            content={this.state.errorMessage}
            onDismiss={() => this.setState({ errorMessage: "" })}
          />

          <Button
            loading={loading}
            style={{
              backgroundColor: loading
                ? "#cbdff7"
                : createBtnHover
                ? "#003366"
                : "#e6f0ff",
              color: loading
                ? "#003366"
                : createBtnHover
                ? "#ffffff"
                : "#003366",
              border: "1px solid #b3d1ff",
              borderRadius: "8px",
              padding: "10px 22px",
              fontWeight: 600,
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={() => this.setState({ createBtnHover: true })}
            onMouseLeave={() => this.setState({ createBtnHover: false })}
          >
            Create!
          </Button>
        </Form>
      </Layout>
    );
  }
}

export default RequestNew;
