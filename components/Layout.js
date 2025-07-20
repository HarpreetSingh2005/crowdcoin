import React from "react";
import Header from "./Header";
import { Container } from "semantic-ui-react";
import Head from "next/head";

const Layout = ({ children, bgClass = "default-bg" }) => {
  return (
    <div className={`layout ${bgClass}`}>
      {" "}
      {/* Use a div for full-page background */}
      <Head>
        <link
          async
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/semantic-ui@2/dist/semantic.min.css"
        />
      </Head>
      <Container style={{ padding: "20px" }}>
        <Header />
        {children}
      </Container>
    </div>
  );
};

export default Layout;
