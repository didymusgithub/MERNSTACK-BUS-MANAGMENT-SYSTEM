import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { HideLoading, showloading } from "../redux/alertSlice";
import { Row, message, Col } from "antd";
import { axiosInstance } from "../helpers/axiosinstance";
import { useNavigate, useParams } from "react-router-dom";
import SeatSelection from "../componenets/SeatSelection";
import StripeCheckout from "react-stripe-checkout";

function Booknow() {
  const navigate = useNavigate();
  const [selectedSeats, setSelectedSeats] = useState([]);
  const params = useParams();
  const dispatch = useDispatch();
  const [bus, setBus] = useState(null);
  // const userId = useSelector((state) => state.users.user?.id);
  const getBus = async () => {
    try {
      dispatch(showloading);
      const response = await axiosInstance.post("/api/buses/get-bus-by-id", {
        _id: params.id,
      });
      dispatch(HideLoading);
      if (response.data.success) {
        setBus(response.data.data);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading);
      message.error(error.message);
    }
  };
  const bookNow = async (transactionId) => {
    try {
      dispatch(showloading());
      const response = await axiosInstance.post("/api/bookings/book-seat", {
        bus: bus._id,
        index: selectedSeats,
        transactionId,
      });
      dispatch(HideLoading());
      if (response.data.success) {
        message.success(response.data.message);
        navigate("/bookings")
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };
  const onToken = async (token) => {
    try {
      dispatch(showloading());
      const response = await axiosInstance.post("/api/bookings/make-payment", {
        token,
        amount: selectedSeats.length * bus.price * 100,
      });
      dispatch(HideLoading());
      if (response.data.success) {
        message.success(response.data.message);
        bookNow(response.data.data.transactionId);
      } else {
        message.error(response.data.error);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };
  
  useEffect(() => {
    getBus();
  }, []);
  return (
    <div>
      {bus && (
        <Row className="mt-3" gutter={20}>
          <Col lg={12} xs={24} sm={24}>
            <h1 className="txt-2xl text-secondary">{bus.name}</h1>
            <h1 className="text-md">
              {bus.from} - {bus.to}
            </h1>
            <hr />

            <div className="">
              <h1 className="text-lg">
                <b>Journey Date</b>: {bus.journeyDate}
              </h1>
              <h1 className="text-lg">
                <b>Fare</b>: ${bus.price}
              </h1>
              <h1 className="text-lg">
                <b>Departure Time</b>: {bus.departure}
              </h1>
              <h1 className="text-lg">
                <b>Arrival Time</b>: {bus.arrival}
              </h1>

              <h1 className="text-lg">
                <b>capacity</b>: {bus.capacity}
              </h1>

              <h1 className="text-lg">
                <b>Seats Left</b>: {bus.capacity - bus.seatsBooked.length}
              </h1>
            </div>
            <hr />

            {/* this handles the alculation of the total number of selected setas */}
            <div className="">
              <h1 className="text-2xl">
                <b className="text-2xl">Selected Seats</b>:{" "}
                {selectedSeats.join(", ")}
              </h1>

              <h1 className="text-2xl mt-2">
                Fare:{" "}
                <b className="text-2xl">
                  ${bus.price * selectedSeats.length} /-
                </b>
              </h1>
              <hr />
              <StripeCheckout
                billingAddress
                token={onToken}
                stripeKey="pk_test_51NDPo0SBU7DGsD7vUMRzJSgHvxd8R1WUy3CYMXx6VEQhY6QaubNPrao3Cv1hFSF1NBPR4eUDNLHW1DhRmS8kXXJF00SSpPCWSu"
                amount={bus.price * selectedSeats.length * 100}
                currency="INR"
              >
                <button
                  className={`btn btn-primary btn-lg ${
                    selectedSeats.length === 0 && "disabled-btn"
                  }`}
                  onClick={bookNow}
                  disabled={selectedSeats.length === 0}
                >
                  Book now
                </button>
              </StripeCheckout>
            </div>
          </Col>
          <Col lg={12} xs={24} sm={24}>
            <SeatSelection
              selectedSeats={selectedSeats}
              setSelectedSeats={setSelectedSeats}
              bus={bus}
            />
          </Col>
        </Row>
      )}
    </div>
  );
}

export default Booknow;
