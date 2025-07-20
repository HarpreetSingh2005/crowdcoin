import React, { Component } from "react";
import { Button, Form, Input, Message, Segment } from "semantic-ui-react";
import Campaign from "../ethereum/campaign";
import web3 from "../ethereum/web3";
import { Router } from "../routes";

class ContributeForm extends Component {
  state = {
    value: "",
    errorMessage: "",
    loading: false,
  };

  onSubmit = async (event) => {
    event.preventDefault();

    const campaign = Campaign(this.props.address);
    this.setState({ loading: true, errorMessage: "" });
    try {
      const accounts = await web3.eth.getAccounts();
      await campaign.methods.contribute().send({
        from: accounts[0],
        value: this.state.value,
      });
      Router.replaceRoute(`/campaigns/${this.props.address}`);
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }
    this.setState({ loading: false, value: "" });
  };

  render() {
    return (
      <Form
        onSubmit={this.onSubmit}
        error={!!this.state.errorMessage}
        style={{ margin: 0 }}
      >
        <Form.Field>
          <label> Amount to Contribute</label>
          <Input
            value={this.state.value}
            onChange={(event) => this.setState({ value: event.target.value })}
            label="wei"
            labelPosition="right"
          />
        </Form.Field>
        <Message
          error
          header="Oops!"
          content={this.state.errorMessage}
          style={{
            wordWrap: "break-word",
            whiteSpace: "normal",
            overflowWrap: "break-word",
            fontSize: "0.9em",
            maxWidth: "100%",
          }}
           onDismiss={() => this.setState({ errorMessage: "" })}
        />

        <Button
          loading={this.state.loading}
          style={{
            color:"#002050",
            fontWeight: "600",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            border:"1px solid #002050",
          }}
        >
          Contribute!
        </Button>
      </Form>
    );
  }
}

export default ContributeForm;
