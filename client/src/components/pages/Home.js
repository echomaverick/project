import React, { useState } from "react";
import ReactLoading from "react-loading";

const Home = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };


  const handleSubscribe = async () => {
    if (!email) {
      setMessage("Please enter your email.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/emails/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",//specifies it will be send in a json format
        },
        body: JSON.stringify({ email }),//converts the js object into a json string
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setEmail("");
      } else {
        setMessage(data.error || "Something went wrong.");
      }
    } catch (error) {
      setMessage("Something went wrong. Please try again later.");
    }

    setIsLoading(false);
  };

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
    borderRadius: "20px",
    padding: "15px",
    width: "300px",
    fontSize: "18px",
    marginRight: "-20px"
  };

  const buttonStyle = {
    padding: "15px 30px",
    borderRadius: "20px",
    backgroundColor: "#0078d4",
    color: "#fff",
    textDecoration: "none",
    fontSize: "18px",
    fontWeight: "bold",
    transition: "background-color 0.2s",
    marginLeft: "30px",
  };

  return (
    <div style={containerStyle}>
      <div style={overlayStyle}></div>
      <h1 style={headerStyle}>Welcome to Proventus Nexus</h1>
      <p style={subheaderStyle}>Discover amazing things.</p>
      <div style={inputContainerStyle}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={handleEmailChange}
          style={inputStyle}
        />
        <button onClick={handleSubscribe} style={buttonStyle}>
          {isLoading ? (
            <ReactLoading type="bubbles" color="#fff" height={20} width={40} />
          ) : (
            "Subscribe"
          )}
        </button>
      </div>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Home;
