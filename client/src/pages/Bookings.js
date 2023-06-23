import React, { useEffect, useRef, useState } from "react";
import PageTitle from "../componenets/PageTitle";
import BusForm from "../componenets/BusForm";
import { useDispatch } from "react-redux";
import { HideLoading, showloading } from "../redux/alertSlice";
import axios from "axios";
import { Modal, Table, message } from "antd";
import { axiosInstance } from "../helpers/axiosinstance";
import moment from "moment";
import { useReactToPrint } from "react-to-print";

function Bookings() {
  const [showPrintModal, setshowPrintModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const dispatch = useDispatch();
  const [bookings, setBookings] = useState([]);

  const getBookings = async () => {
    try {
      dispatch(showloading());
      const response = await axiosInstance.post(
        "/api/bookings/get-bookings-by-user-id",
        {}
      );
      dispatch(HideLoading());
      if (response.data.success) {
        const mappedData = response.data.data.map((booking) => {
          return {
            ...booking,
            ...booking.bus,
            key: booking._id,
          };
        });
        setBookings(mappedData);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const columns = [
    {
      title: "Bus Name",
      dataIndex: "name",
      key: "bus",
    },
    {
      title: "Bus Number",
      dataIndex: "number",
      key: "bus",
    },
    {
      title: "Journey Date",
      dataIndex: "journeyDate",
    },
    {
      title: "Journey Time",
      dataIndex: "departure",
    },
    {
      title: "Seats",
      dataIndex: "seatsBooked",
      render: (seatsBooked) =>{
        return seatsBooked.join(", ");
      }
    },
    {
      title: "Amount",
      dataIndex: "price",
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text, record) => (
        <div>
          <h1
            className="text-sm button button__text"
            onClick={() => {
              setSelectedBooking(record);
              setshowPrintModal(true);
            }}
          >
            Print Ticket
          </h1>
        </div>
      ),
    },
  ];

  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
  });

  useEffect(() => {
    getBookings();
  }, []);

  return (
    <div>
      <PageTitle title="Bookings" />
      <div className="mt-2">
        <Table dataSource={bookings} columns={columns} />
      </div>
      {showPrintModal && (
        <Modal
          title="Print ticket"
          onCancel={() => {
            setshowPrintModal(false);
            setSelectedBooking(null);
          }}
          visible={showPrintModal}
          okText="Print"
          onOk={handleprint}
        >
          <div className="d-flex flex-column p-5" ref={componentRef}>
            <p className="text-lg text-primary">{selectedBooking.name}</p>
            <hr />
            <p className="text-md text-secondary">
              {" "}
              From - To <br />
              {selectedBooking.from} - {selectedBooking.to}
            </p>
            <hr />

            <p>
              <span className="text-sm text-secondary">
                Journey date:{" "}
                {moment(selectedBooking.journeyDate).format("DD-MM-YYYY")}
              </span>
            </p>
            <p className="text-sm text-secondary">
              Departure Time: {selectedBooking.departure}
            </p>

            <hr />
            <p className="text-sm text-secondary">
              Seat(s) booked:
              <br /> {selectedBooking.seatsBooked}
            </p>
            <hr />
            <p className="text-sm text-secondary">
              Total Amount:{" "}
              {selectedBooking.price * selectedBooking.seatsBooked.length} /-
            </p>
            <hr/>
            <p className="text-sm text-secondary">
              Payment Transaction Id: {selectedBooking.transactionId} 
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default Bookings;
