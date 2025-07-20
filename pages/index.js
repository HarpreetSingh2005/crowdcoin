import React, { Component } from "react";
import factory from "../ethereum/factory";
import Campaign from "../ethereum/campaign";
import { Card, Button, Grid, Header, List } from "semantic-ui-react";
import Layout from "../components/Layout";
import { Link } from "../routes";

class CampaignIndex extends Component {
  static async getInitialProps() {
    const campaigns = await factory.methods.getDeployedCampaign().call();
    let mongoCampaigns = [];
    try {
      const res = await fetch(`http://localhost:5000/api/campaigns/all`);
      mongoCampaigns = await res.json();
    } catch (err) {
      console.warn("⚠️ Could not fetch MongoDB campaigns");
    }

    const limitedCampaigns = campaigns.slice(0, 5); // Only show 5
    const campaignDetails = [];

    for (const address of limitedCampaigns) {
      const campaign = Campaign(address);
      let name = "Unnamed";
      let creationDate = "Unknown";

      try {
        name = await campaign.methods.CampaignName().call();
      } catch (e) {
        console.warn(`⚠️ Error fetching name for ${address}:`, e.message);
      }

      try {
        creationDate = await campaign.methods.CreationDate().call();
      } catch (e) {
        console.warn(`⚠️ Error fetching date for ${address}:`, e.message);
      }

      const meta = mongoCampaigns.find((c) => c.address === address) || {};
      campaignDetails.push({
        address,
        name,
        creationDate,
        imageUrl: meta.imageUrl || "",
        font: meta.font || "'Poppins', sans-serif",
        description: meta.description || "",
      });
    }

    return { campaignDetails: campaignDetails.reverse() };
  }

  renderCampaigns() {
    return (
      <Grid columns={3} stackable doubling>
        {this.props.campaignDetails.map((campaign, index) => (
          <Grid.Column key={index}>
            <Card
              style={{
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                borderRadius: "12px",
                height: "300px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                transition: "transform 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.02)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            >
              {/* Image */}
              <div
                style={{
                  height: "180px",
                  backgroundColor: campaign.imageUrl
                    ? "transparent"
                    : "#f3f3f3",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  overflow: "hidden",
                  borderTopLeftRadius: "12px",
                  borderTopRightRadius: "12px",
                }}
              >
                {campaign.imageUrl ? (
                  <img
                    src={`http://localhost:5000${campaign.imageUrl}`}
                    alt={`Campaign: ${campaign.name}`}
                    loading="lazy"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <span style={{ color: "#aaa", fontSize: "16px" }}>
                    No Image
                  </span>
                )}
              </div>

              {/* Card Text */}
              <Card.Content
                style={{
                  padding: "15px",
                  textAlign: "center",
                  flex: "1",
                }}
              >
                <Link route={`/campaigns/${campaign.address}`}>
                  <a
                    style={{
                      textDecoration: "none",
                      color: "inherit",
                      fontSize: "inherit",
                      display: "block",
                    }}
                  >
                    <Card.Header
                      style={{
                        marginTop: "5px",
                        fontFamily: campaign.font,
                        fontSize: "1.5rem",
                        marginBottom: "4px",
                        color: "#333",
                      }}
                    >
                      {campaign.name}
                    </Card.Header>
                  </a>
                </Link>
                <Card.Meta style={{ fontSize: "0.8rem", color: "#777" }}>
                  Created on: {campaign.creationDate}
                </Card.Meta>
              </Card.Content>
            </Card>
          </Grid.Column>
        ))}
      </Grid>
    );
  }

  render() {
    return (
      <Layout bgClass="home-bg">
        <div
          style={{
            padding: "50px 20px",
            textAlign: "center",
            background: "transparent", // Make it transparent to blend with the layout
            borderRadius: "15px",
            marginBottom: "50px",
            boxShadow: "none", // Remove shadow for a seamless look
          }}
        >
          <Header
            as="h1"
            style={{
              fontSize: "3.5rem",
              fontWeight: 700,
              color: "#333",
              marginBottom: "20px",
              fontFamily: "'Montserrat', sans-serif",
              letterSpacing: "-1px",
            }}
          >
          Want to Fund Your Vision
          </Header>
          <p
            style={{
              fontSize: "1.2rem",
              lineHeight: "1.6",
              color: "#555",
              maxWidth: "700px",
              margin: "0 auto 30px auto",
            }}
          >
            Welcome to your decentralized crowdfunding platform — where{" "}
            <strong>innovators</strong>, <strong>creators</strong>, and{" "}
            <strong>changemakers</strong> bring their visions to life on the
            Ethereum blockchain.
          </p>

          <List
            bulleted
            style={{
              textAlign: "left",
              maxWidth: "600px",
              margin: "0 auto 30px auto",
              fontSize: "1.1rem",
              color: "#666",
            }}
          >
            <List.Item style={{ marginBottom: "10px" , textAlign: "center"}}>
              Create a blockchain-backed campaign in just a few clicks
            </List.Item>
            <List.Item style={{ marginBottom: "10px", textAlign: "center" }}>
              Reach supporters who believe in your mission
            </List.Item>
            <List.Item style={{ marginBottom: "10px", textAlign: "center" }}>
              Accept secure contributions with full transparency
            </List.Item>
            <List.Item style={{ marginBottom: "10px", textAlign: "center" }}>
              Request fund usage — voters decide if it's valid
            </List.Item>
          </List>

          <p
            style={{
              fontSize: "1.2rem",
              lineHeight: "1.6",
              color: "#555",
              maxWidth: "700px",
              margin: "0 auto 40px auto",
            }}
          >
            Every campaign here is powered by <strong>smart contracts</strong>,
            ensuring that contributions are safe, transparent, and governed by
            your community.
          </p>
          <Link route="/campaigns/new">
            <a>
             <Button
  size="large"
  style={{
    fontWeight: "600",
    padding: "15px 30px",
    borderRadius: "30px",
    backgroundColor: "#063947ff",
    border: "none",
    color: "#fff",
    boxShadow: "0 5px 15px rgba(33, 133, 208, 0.4)",
    transition: "background 0.3s ease, transform 0.2s ease",
  }}
  onMouseOver={(e) => {
    e.currentTarget.style.backgroundColor = "#b63d3dff"; // Change button background
    e.currentTarget.style.transform = "translateY(-2px)"; // Move button up
    e.currentTarget.querySelector('i').style.color = "#fff"; // Change icon color
  }}
  onMouseOut={(e) => {
    e.currentTarget.style.backgroundColor = "#063947ff"; // Reset button background
    e.currentTarget.style.transform = "translateY(0)"; // Reset button position
    e.currentTarget.querySelector('i').style.color = "#fff"; // Reset icon color
  }}
>
  <i className="plus icon" style={{ color: "#fff" }}></i> Launch your Campaign
</Button>


            </a>
          </Link>
        </div>
        
        {/* Only one header for the section title */}
        <Header
          as="h2"
          style={{
            fontSize: "2.5rem",
            fontWeight: 600,
            marginBottom: "30px",
            marginTop: "50px",
            textAlign: "center",
            color: "#333",
          }}
        >
          Open Campaigns
        </Header>
        <hr style={{borderTop: "2px solid black", marginBottom: "30px"}} />

        {this.props.campaignDetails.length > 0 ? (
          this.renderCampaigns()
        ) : (
          <div style={{ textAlign: "center", padding: "50px" }}>
            <Header icon>
              <i className="clipboard outline icon"></i>
              No active campaigns at the moment.
            </Header>
            <p>Be the first to launch a new campaign!</p>
          </div>
        )}
      </Layout>
    );
  }
}

export default CampaignIndex;
