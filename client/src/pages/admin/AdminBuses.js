import React, { useEffect, useState } from "react";
import PageTitle from "../../componenets/PageTitle";
import BusForm from "../../componenets/BusForm";
import { useDispatch } from "react-redux";
import { HideLoading, showloading } from "../../redux/alertSlice";
import axios from "axios";
import { Table, message } from "antd";
import { axiosInstance } from "../../helpers/axiosinstance";
import moment from "moment";

function AdminBuses() {
  const dispatch = useDispatch();
  const [showBusform, setShowBusForm] = useState(false);
  const [buses, setBuses] = useState([]);
  const [selectedBus, setSelectedbus] = useState(null);

  const getBuses = async () => {
    try {
      dispatch(showloading);
      const response = await axiosInstance.post("/api/buses/get-all-buses", {});
      dispatch(HideLoading);
      if (response.data.success) {
        setBuses(response.data.data);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading);
      message.error(error.message);
    }
  };

  const deleteBus = async (id) => {
    try {
      dispatch(showloading);
      const response = await axiosInstance.post("/api/buses/delete-bus", {
        _id: id,
      });
      dispatch(HideLoading);
      if (response.data.success) {
        message.success(response.data.message);
        getBuses();
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading);
      message.error(error.message);
    }
  };

  // console.log(buses);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Number",
      dataIndex: "number",
    },
    {
      title: "From",
      dataIndex: "from",
    },
    {
      title: "To",
      dataIndex: "to",
    },
    {
      title: "Journey Date",
      dataIndex: "journeyDate",
      render: (journeyDate) => moment(journeyDate).format("DD-MM-YYYY"),
    },
    {
      title: "Status",
      dataIndex: "status",
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (action, record) => (
        <div
          className="d-flex gap-3"
          onClick={() => {
            deleteBus(record._id);
          }}
        >
          <i
            class="ri-edit-line"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedbus(record);
              setShowBusForm(true);
            }}
          ></i>
          <i
            class="ri-delete-bin-line"
            onClick={(e) => {
              e.stopPropagation(); // Stop the propagation of click event
              deleteBus(record._id);
            }}
          ></i>
        </div>
      ),
    },
  ];

  useEffect(() => {
    getBuses();
  }, [dispatch, getBuses]);

  return (
    <div>
      <div className="d-flex justify-content-between my-3">
        <PageTitle title="Buses" />
        <button className="primary-btn" onClick={() => setShowBusForm(true)}>
          Add Bus
        </button>
      </div>

      <Table columns={columns} dataSource={buses} />

      {showBusform && (
        <BusForm
          showBusForm={showBusform}
          setShowBusForm={setShowBusForm}
          type={selectedBus ? "edit" : "add"}
          selectedBus={selectedBus}
          setSelectedBus={setSelectedbus}
          getData={getBuses}
        />
      )}
    </div>
  );
}

export default AdminBuses;
