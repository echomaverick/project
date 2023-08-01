import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ReactLoading from "react-loading";

const Home = () => {

  const containerStyle = {
    position: "fixed",
    width: "100%",
    minHeight: "100%",
    fontFamily: "Poppins, sans-serif",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    padding: "20px",
    backgroundSize: "cover",
    backgroundPosition: "center",
  };

  const overlayStyle = {
    content: "",
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0, 0, 0, 1)",
    backdropFilter: "blur(20px)",
    zIndex: -999,
  };

  const headerStyle = {
    fontSize: "54px",
    fontWeight: "bold",
    marginBottom: "40px",
    color: "#fff",
  };

  const subheaderStyle = {
    fontSize: "24px",
    marginBottom: "60px",
    color: "#fff",
  };

  const inputContainerStyle = {
    display: "flex",
    alignItems: "center",
  };

  const inputStyle = {
    border: "0 solid #0078d4",
    borderRadius: "5px 0 0 5px",
    padding: "15px",
    width: "300px",
    fontSize: "18px",
  };

  const buttonStyle = {
    padding: "15px 30px",
    borderRadius: "10px",
    backgroundColor: "#0078d4",
    color: "#fff",
    textDecoration: "none",
    fontSize: "18px",
    fontWeight: "bold",
    transition: "background-color 0.2s",
  };

  return (
    <div style={containerStyle}>
        <>
          <div style={overlayStyle}></div>
          <h1 style={headerStyle}>Welcome to...</h1>
          <p style={subheaderStyle}>Discover amazing things.</p>
          <div style={inputContainerStyle}>
          </div>
        </>
    </div>
  );
};

export default Home;
