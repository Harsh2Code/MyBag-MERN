import React, { useState, useEffect } from "react";
import "./LoaderMinimalEnhanced.css";

const LoaderMinimalEnhanced = ({ isLoading }) => {
  const [showLoader, setShowLoader] = useState(true);
  const [minTimePassed, setMinTimePassed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMinTimePassed(true);
    }, 3000); // minimum 3 seconds

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (minTimePassed && !isLoading) {
      setShowLoader(false);
    }
  }, [minTimePassed, isLoading]);

  if (!showLoader) {
    return null;
  }

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
      <h5 style={{margin: "50px", marginTop: "200px"}}>Redirecting</h5>
    </div>
  );
};

export default LoaderMinimalEnhanced;
