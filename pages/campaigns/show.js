import React, { Component } from "react";
import Layout from "../../components/Layout";
import Campaign from "../../ethereum/campaign";
import {
  Card,
  Grid,
  GridColumn,
  Button,
  Header,
  Icon,
  Image as ProductImage,
} from "semantic-ui-react";
import web3 from "../../ethereum/web3";
import ContributeForm from "../../components/ContributeForm";
import { Link } from "../../routes";

function loadGoogleFont(font) {
  const href = `https://fonts.googleapis.com/css2?family=${font.replace(
    / /g,
    "+"
  )}&display=swap`;
  console.log("📦 Injecting font link:", href); // <-- ADD THIS

  const fontLink = document.querySelector(
    `link[href*="${font.replace(/ /g, "+")}"]`
  );
  if (fontLink) return;

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = href;
  document.head.appendChild(link);
}

class CampaignShow extends Component {
  state = {
    fontReady: false,
  };
  static async getInitialProps(props) {
    const campaign = Campaign(props.query.address);

    const summary = await campaign.methods.getSummary().call();
    const name = await campaign.methods.CampaignName().call();
    const creationDate = await campaign.methods.CreationDate().call(); // ✅ direct call

    const res = await fetch(
      `http://localhost:5000/api/campaigns?address=${props.query.address}`
    );
    const mongoData = await res.json();

    return {
      address: props.query.address,
      detailedDescription:
        mongoData.detailedDescription || "No detailed plan provided yet",
      name: name,
      minimumContribution: summary[0].toString(),
      balance: summary[1].toString(),
      requestsCount: summary[2].toString(),
      approversCount: summary[3].toString(),
      manager: summary[4],
      contributedMoney: summary[5].toString(),
      creationDate: creationDate,
      description: mongoData.description || "",
      imageUrl: mongoData.imageUrl || "",
      font: mongoData.font || "'Poppins', sans-serif",
    };
  }

  componentDidMount() {
    const fontName = this.props.font.split(",")[0].replace(/'/g, "");
    document.fonts.load(`1rem ${fontName}`).then(() => {
      this.setState({ fontReady: true });
    });
  }

  renderCards() {
    const {
      balance,
      manager,
      minimumContribution,
      requestsCount,
      approversCount,
      contributedMoney,
    } = this.props;
    const items = [
      {
        key: "manager",
        header: manager,
        meta: "Address of Manager",
        description:
          "The manager created this campaign and create requests to withdraw money.",
        style: { overflowWrap: "break-word" },
      },
      {
        key: "min-contribution",
        header: minimumContribution,
        meta: "Minimum Contribution (wei)",
        description:
          "You must contribute atleast this much wei to be a approver.",
      },
      {
        key: "request-count",
        header: requestsCount,
        meta: "Number of Requests",
        description:
          "A request tries to withdraw money from the contract.Request must be approvd by approvers.",
      },
      {
        key: "approvers-count",
        header: approversCount,
        meta: "Number of Approvers",
        description:
          "Number of people who have already contributed to the Campaign.",
      },
      {
        key: "campaign-balance",
        header: web3.utils.fromWei(balance, "ether"),
        meta: "Campaign Balance (ether)",
        description: "The amount of money this campaign has, left to spend.",
      },
      {
        key: "total-contributed-money",
        header: web3.utils.fromWei(contributedMoney, "ether"),
        meta: "Total Contributed Money (ether)",
        description:
          "Total money contributed to this Campaign till now including money spent.",
      },
    ];
    return <Card.Group items={items} />;
  }

  render() {
    return (
      <Layout bgClass="home-bg">
        <Grid>
          <Grid.Row>
            <Grid.Column>
              <div style={{ height: "20px" }} />
              {this.props.imageUrl ? (
                <ProductImage
                  centered
                  size="medium"
                  src={`http://localhost:5000${this.props.imageUrl}`}
                  style={{ marginTop: "10px", borderRadius: "10px" }}
                />
              ) : (
                <p style={{ textAlign: "center", color: "gray" }}>
                  No image uploaded for this campaign.
                </p>
              )}
              <div style={{ height: "20px" }} />
              <Grid.Row>
                <Grid.Column
                  width={16}
                  style={{ position: "relative", textAlign: "center" }}
                >
                  {!this.state.fontReady ? (
                    <p style={{ textAlign: "center", color: "gray" }}>
                      Loading...
                    </p>
                  ) : (
                    <Header
                      as="h1"
                      style={{
                        fontFamily: this.state.fontReady
                          ? this.props.font
                          : "sans-serif",
                        fontSize: "2.5rem",
                        fontWeight: "80",
                        textAlign: "center",
                        marginTop: "10px",
                      }}
                    >
                      {this.props.name}
                    </Header>
                  )}
                  <span
                    style={{
                      position: "absolute",
                      right: 0,
                      top: "50%",
                      transform: "translateY(-50%)",
                      fontSize: "14px",
                      color: "gray",
                    }}
                  >
                    Created on: {this.props.creationDate}
                  </span>
                </Grid.Column>
              </Grid.Row>

              <div style={{ marginTop: "5px", textAlign: "center" }}>
                <p>{this.props.description}</p>
              </div>
              <div style={{ marginTop: "45px" }}>
                <div
                  style={{
                    fontSize: "1.1rem", // Smaller than h3 (~1.25rem), bigger than paragraph (~1rem)
                    fontWeight: "600",
                    color: "#444",
                    marginBottom: "10px",
                  }}
                >
                  Detailed Campaign Plan
                </div>

                <p
                  style={{
                    fontSize: "16px",
                    lineHeight: "1.6",
                    color: "#333",
                    whiteSpace: "pre-wrap",
                    textAlign: "justify",
                    background: "#ffffffff",
                    padding: "16px",
                    borderRadius: "8px",
                    boxShadow: "0 2px 6px rgba(255, 255, 255, 0.99)",
                  }}
                >
                  {this.props.detailedDescription}
                </p>
              </div>
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <GridColumn width={10}>{this.renderCards()}</GridColumn>
            <GridColumn width={6}>
              <ContributeForm address={this.props.address} />
            </GridColumn>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column>
              <Link route={`/campaigns/${this.props.address}/requests`}>
                <a>
                  <Button
                            loading={this.state.loading}
                            style={{
                              marginTop: "14px",
                              marginBottom: "25px",
                              color:"#002050",
                              fontWeight: "600",
                              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                              border:"1px solid #002050",
                            }}
                          >
                            View Request
                          </Button>
                </a>
              </Link>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Layout>
    );
  }
}

export default CampaignShow;
