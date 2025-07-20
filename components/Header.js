import React from "react";
import { Menu } from "semantic-ui-react";
import { Link } from "../routes";
import Head from "next/head";

const Header = (props) => {
  return (
    <Menu style={{ marginTop: "10px" }}>
      <Link route="/">
        <a className="item"><p style={{fontSize:"14px", fontWeight:"bold"}}>CrowdCoin</p></a>
      </Link>

      <Menu.Menu position="right">
    <Link route= "/">
        <a className="item"><p style={{fontSize:"14px", fontWeight:"bold"}}>Campaigns</p></a>
      </Link>
    <Link route="/campaigns/new">
        <a className="item"><p style={{fontSize:"14px", fontWeight:"bold"}}>+</p></a>
      </Link>
        
       </Menu.Menu>
    </Menu>
  );
};

export default Header;
