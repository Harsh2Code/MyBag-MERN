import React from "react";
import "./LoaderMinimalEnhanced.css";

const LoaderMinimalEnhanced = () => {
  return (
    <div className="loader-wrapper">
      <div className="body">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <div className="base">
          <div className="jet-pack"></div>
          <span></span>
          <div className="face"></div>
        </div>
      </div>
      <div className="fast-lines">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
      <h1>Redirecting</h1>
    </div>
  );
};

export default LoaderMinimalEnhanced;
