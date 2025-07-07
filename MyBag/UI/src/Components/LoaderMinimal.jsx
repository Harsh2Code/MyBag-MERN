import React from "react";

const loaderStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  backgroundColor: "#f1c40f",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
  zIndex: 9999,
};

const bodyStyle = {
  position: "relative",
  width: "100px",
  height: "20px",
  marginBottom: "20px",
};

const spanStyle = {
  display: "inline-block",
  width: "20px",
  height: "4px",
  backgroundColor: "#000",
  margin: "0 2px",
  animation: "fazer 1.2s infinite ease-in-out",
};

const LoaderMinimal = () => {
  console.log("LoaderMinimal rendered");
  return (
    <div style={loaderStyle}>
      <div style={bodyStyle}>
        <span style={{ ...spanStyle, animationDelay: "0s" }}></span>
        <span style={{ ...spanStyle, animationDelay: "0.2s" }}></span>
        <span style={{ ...spanStyle, animationDelay: "0.4s" }}></span>
        <span style={{ ...spanStyle, animationDelay: "0.6s" }}></span>
      </div>
      <h1>Redirecting</h1>
      <style>
        {`
          @keyframes fazer {
            0%, 40%, 100% {
              transform: scaleX(1);
            }
            20% {
              transform: scaleX(0.5);
            }
          }
        `}
      </style>
    </div>
  );
};

export default LoaderMinimal;
