import React from "react";
import { useNavigate } from 'react-router-dom';

function Bus({ bus }) {
  const navigate = useNavigate()
  return (
    <div className="card p-2">
      <h1 className="txt-lg primary-text">{bus.name}</h1>
      <hr />
      <div className="d-flex justify-content-between">
        <div>
          <p className="txt-sm"> From </p>
          <p className="txt-sm"> {bus.from}</p>
        </div>

        <div>
          <p className="txt-sm"> To </p>
          <p className="txt-sm"> {bus.to}</p>
        </div>

        <div>
          <p className="txt-sm"> Fare </p>
          <p className="txt-sm"> ${bus.price}/-</p>
        </div>
      </div>
      <div className="d-flex justify-content-between align-items-end">
        <div>
          <p className="txt-sm"> Journey Date </p>
          <p className="txt-sm"> {bus.journeyDate}</p>
        </div>
        <h1 className="txt-lg underline secondary-text" onClick={()=>{
          navigate(`/book-now/${bus._id}`)
        }}>Book now </h1>
      </div>
    </div>
  );
}

export default Bus;
