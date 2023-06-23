import { Col, Row } from "antd";
import React from "react";
import "../resources/bus.css";

function SeatSelection({ selectedSeats, setSelectedSeats, bus }) {
  const capacity = bus.capacity;

  const selectOrUnselectedSeats = (seatNumber) => {
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter((seat) => seat !== seatNumber));
    } else {
      setSelectedSeats([...selectedSeats, seatNumber]);
    }
  };

  return (
    <div>
      <div className="bus-container">
        <Row gutter={[10, 10]}>
          {/* Loop through the number of seats */}
          {Array.from({ length: capacity }, (_, index) => {
            let seatClass = "";
            if (selectedSeats.includes(index + 1)) {
              seatClass = "selected-seat";
            }else if(bus.seatsBooked.includes(index + 1)){
              seatClass = "booked-seat"

            }
            return (
              <Col span={6} key={index}>
                <div
                  className={`seat ${seatClass}`}
                  onClick={() => selectOrUnselectedSeats(index + 1)}
                >
                  {index + 1}
                </div>
              </Col>
            );
          })}
        </Row>
      </div>
    </div>
  );
}

export default SeatSelection;
