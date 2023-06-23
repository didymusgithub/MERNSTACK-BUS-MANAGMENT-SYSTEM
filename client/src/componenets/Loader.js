import React from "react";
import "../resources/spinner.css"

function Loader() {
  return (
      <div className="spinner-container">
        <div className="spinner">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    );
}

export default Loader;
