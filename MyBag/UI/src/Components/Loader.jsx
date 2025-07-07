import React from "react";
import "../App.css";

const Loader = () => {
  return (
    <div className="loader-wrapper">
      <div className="body">
        <span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </span>
        <div className="base">
          <span></span>
          <div className="face"></div>
        </div>
      </div>
      <div className="longfazers">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
      <h1>Redirecting</h1>
    </div>
  );
};

export default Loader;
