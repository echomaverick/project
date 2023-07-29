import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const containerStyle = {
    position: "relative", 
    minHeight: "100vh",
    fontFamily: "Poppins, sans-serif",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    padding: "20px",
  };

  const overlayStyle = {
    content: "",
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0, 0, 0, 0.4)",
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
    borderRadius: "0 5px 5px 0",
    backgroundColor: "#0078d4",
    color: "#fff",
    textDecoration: "none",
    fontSize: "18px",
    fontWeight: "bold",
    transition: "background-color 0.2s",
  };

  return (
    <div style={containerStyle}>
      <div style={overlayStyle}></div>
      <h1 style={headerStyle}>Welcome to ....</h1>
      <p style={subheaderStyle}>Manage your tasks and collaborate with your team effortlessly.</p>
      <div style={inputContainerStyle}>
        <Link style={buttonStyle} to="">
          Sign up for free
        </Link>
      </div>
    </div>
  );
};

export default Home;
