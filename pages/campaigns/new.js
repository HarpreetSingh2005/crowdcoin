import React, { Component } from "react";
import { Form, Button, Input, Message } from "semantic-ui-react";
import Layout from "../../components/Layout";
import factory from "../../ethereum/factory";
import web3 from "../../ethereum/web3";
import { Router } from "../../routes";
import { imageConfigDefault } from "next/dist/shared/lib/image-config";

function loadGoogleFont(font) {
  const fontLink = document.querySelector(
    `link[href*="${font.replace(/ /g, "+")}"]`
  );
  if (fontLink) return; // already loaded

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${font.replace(
    / /g,
    "+"
  )}&display=swap`;
  document.head.appendChild(link);
}

class CampaginNew extends Component {
  state = {
    minimumContribution: "",
    errorMessage: "",
    loading: false,
    campaignName: "",
    description: "",
    image: null,
    font: "'Poppins', sans-serif",
    detailedDescription: "",
  };

  componentDidMount() {
    const fontName = this.state.font.split(",")[0].replace(/'/g, "");
    loadGoogleFont(fontName);
  }

  onSubmit = async (event) => {
    event.preventDefault();

    this.setState({ loading: true, errorMessage: "" });

    try {
      const accounts = await web3.eth.getAccounts();
      const creationDate = new Date().toLocaleString();

      await factory.methods
        .createCampaign(
          this.state.minimumContribution,
          this.state.campaignName,
          creationDate
        )
        .send({ from: accounts[0] });

      const deployedCampaigns = await factory.methods
        .getDeployedCampaign()
        .call();
      const campaignAddress = deployedCampaigns[deployedCampaigns.length - 1];

      const formData = new FormData();
      formData.append("address", campaignAddress);
      formData.append("name", this.state.campaignName);
      formData.append("creationDate", creationDate);
      formData.append("description", this.state.description);
      formData.append(
        "detailedDescription",
        this.state.detailedDescription || ""
      );
      formData.append("image", this.state.image);
      formData.append("font", this.state.font);

      await fetch("http://localhost:5000/api/campaigns", {
        method: "POST",
        body: formData,
      });

      Router.pushRoute("/");
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }

    this.setState({
      loading: false,
      minimumContribution: "",
      description: "",
      detailedDescription: "",
      image: null,
    });
  };

  render() {
    return (
      <Layout>
        <h3>Create a Campagin</h3>

        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          <Form.Field>
            <label>Campaign Name</label>
            <Input
              placeholder="Enter a name for your campaign"
              value={this.state.campaignName}
              onChange={(event) =>
                this.setState({ campaignName: event.target.value })
              }
              required
            />
            <label style={{ marginTop: "10px", fontWeight: "bold" }}>
              Choose Font Style:
            </label>
            <select
              value={this.state.font}
              onChange={(e) => {
                const selected = e.target.value;
                this.setState({ font: selected });

                // 👇 Load the font dynamically
                const fontName = selected.split(",")[0].replace(/'/g, "");
                loadGoogleFont(fontName);
              }}
              style={{
                fontFamily: this.state.font,
                width: "100%",
                padding: "8px",
                marginBottom: "15px",
              }}
            >
              <option
                value="'Poppins', sans-serif"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Poppins
              </option>
              <option
                value="'Playfair Display', serif"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Playfair Display
              </option>
              <option
                value="'Lobster', cursive"
                style={{ fontFamily: "'Lobster', cursive" }}
              >
                Lobster
              </option>
              <option
                value="'Roboto', sans-serif"
                style={{ fontFamily: "'Roboto', sans-serif" }}
              >
                Roboto
              </option>
              <option
                value="'Montserrat', sans-serif"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                Montserrat
              </option>
              <option
                value="'Indie Flower', cursive"
                style={{ fontFamily: "'Indie Flower', cursive" }}
              >
                Indie Flower
              </option>
              <option
                value="'Oswald', sans-serif"
                style={{ fontFamily: "'Oswald', sans-serif" }}
              >
                Oswald
              </option>
              <option
                value="'Quicksand', sans-serif"
                style={{ fontFamily: "'Quicksand', sans-serif" }}
              >
                Quicksand
              </option>
              <option
                value="'Fira Sans', sans-serif"
                style={{ fontFamily: "'Fira Sans', sans-serif" }}
              >
                Fira Sans
              </option>
              <option
                value="'Abril Fatface', cursive"
                style={{ fontFamily: "'Abril Fatface', cursive" }}
              >
                Abril Fatface
              </option>
              <option
                value="'Pacifico', cursive"
                style={{ fontFamily: "'Pacifico', cursive" }}
              >
                Pacifico
              </option>
              <option
                value="'Raleway', sans-serif"
                style={{ fontFamily: "'Raleway', sans-serif" }}
              >
                Raleway
              </option>
            </select>
            <p
              style={{
                fontFamily: this.state.font,
                fontSize: "18px",
                fontWeight: "500",
                color: "#555",
                textAlign: "center",
                marginTop: "10px",
                marginBottom: "20px",
              }}
            >
              {this.state.campaignName.trim()
                ? this.state.campaignName
                : "This is a preview of your campaign title"}
            </p>
          </Form.Field>

          <Form.Field>
            <label>Campaign brief Description</label>
            <Input
              placeholder="Tell users about your campaign"
              value={this.state.description}
              onChange={(e) => this.setState({ description: e.target.value })}
              required
            />
          </Form.Field>

          <Form.Field>
            <label>Upload Image</label>
            <Input
              placeholder="Provide a image for your campaign"
              type="file"
              accept="image/*"
              onChange={(e) => this.setState({ image: e.target.files[0] })}
              required
            />
          </Form.Field>

          <Form.Field>
            <label>Campaign Detailed Plan (Optional)</label>
            <Input
              placeholder="Enter deytailed plan for your campaign"
              value={this.state.detailedDescription}
              onChange={(e) =>
                this.setState({ detailedDescription: e.target.value })
              }
            />
          </Form.Field>

          <Form.Field>
            <label>Minimum Contribution</label>
            <Input
              label="wei"
              labelPosition="right"
              value={this.state.minimumContribution}
              onChange={(event) => {
                this.setState({ minimumContribution: event.target.value });
              }}
              required
            />
          </Form.Field>

          <Message
            error
            header="Oops!"
            content={this.state.errorMessage}
            onDismiss={() => this.setState({ errorMessage: "" })}
          />

          <Button loading={this.state.loading} primary>
            Create
          </Button>
        </Form>
      </Layout>
    );
  }
}

export default CampaginNew;
