import React from "react";
import { Col, Form, Modal, Row, message } from "antd";
import { axiosInstance } from "../helpers/axiosinstance";
import { useDispatch } from "react-redux";
import { HideLoading, showloading } from "../redux/alertSlice";
// import moment from "moment";

function BusForm({
  showBusForm,
  setShowBusForm,
  type = "add",
  getData,
  selectedBus,
  setSelectedBus,
}) {
  const dispatch = useDispatch();
  const onFinish = async (values) => {
    try {
      dispatch(showloading);
      let response = null;
      if (type === "add") {
        response = await axiosInstance.post("/api/buses/add-bus", values);
      } else {
        response = await axiosInstance.post("/api/buses/update-bus", {
          ...values,
          _id: selectedBus._id,
        });
      }
      if (response.data.success) {
        message.success(response.data.message);
      } else {
        message.error(response.data.message);
      }
      // this clears the form after the bus have been inserted succesfully
      getData();
      setShowBusForm(false);
      setSelectedBus(null);
    } catch (error) {
      message.error(error.message);
      dispatch(HideLoading);
    }
  };

  return (
    // this props here are taken from the antd documentation and can be checked in the documentation
    <Modal
      title={type === "add" ? "Add Bus" : "Update Bus"}
      visible={showBusForm}
      onCancel={() => {
        // helps o clear the bus input feilds and make them empty again when cleared
        setShowBusForm(false);
        setSelectedBus(null);
      }}
      footer={false}
      width={800}
    >
      {/* this is the form that can be used in the addbus btton under the buses */}
      <Form layout="vertical" onFinish={onFinish} initialValues={selectedBus}>
        {/* GUTTER IS USED TO GIVE SPACES BETWEEN THE FORMS */}
        <Row gutter={[10, 10]}>
          <Col lg={24} xs={24}>
            <Form.Item label="Bus Name" name="name">
              <input type="text" className="" />
            </Form.Item>
          </Col>

          <Col lg={12} xs={24}>
            <Form.Item label="Bus Number" name="number">
              <input type="text" className="" />
            </Form.Item>
          </Col>

          <Col lg={12} xs={24}>
            <Form.Item label="Capacity" name="capacity">
              <input type="text" className="" />
            </Form.Item>
          </Col>

          <Col lg={12} xs={24}>
            <Form.Item label="From" name="from">
              <input type="text" className="" />
            </Form.Item>
          </Col>

          <Col lg={12} xs={24}>
            <Form.Item label="To" name="to">
              <input type="text" className="" />
            </Form.Item>
          </Col>

          <Col lg={8} xs={24}>
            <Form.Item label="Journey Date" name="journeyDate">
              <input type="date" className="" />
            </Form.Item>
          </Col>

          <Col lg={8} xs={24}>
            <Form.Item label="Depature" name="departure">
              <input type="time" className="" />
            </Form.Item>
          </Col>

          <Col lg={8} xs={24}>
            <Form.Item label="Arrival" name="arrival">
              <input type="time" className="" />
            </Form.Item>
          </Col>

          <Col lg={12} xs={24}>
            <Form.Item label="Type" name="type">
              <select name="" id="">
                <option value="Non-AC">AC</option>
                <option value="AC">Non-AC</option>
              </select>
            </Form.Item>
          </Col>

          <Col lg={12} xs={24}>
            <Form.Item label="Price" name="price">
              <input type="text" className="" />
            </Form.Item>
          </Col>

          <Col lg={12} xs={24}>
            <Form.Item label="Status" name="status">
              <select name="" id="">
                <option value="Yet to start">Yet to start</option>
                <option value="Running">Running</option>
                <option value="Completed">completed</option>
              </select>
            </Form.Item>
          </Col>
        </Row>

        <div className="d-flex justify-content-end">
          <button className="primary-btn" type="submit">
            Save
          </button>
        </div>
      </Form>
    </Modal>
  );
}

export default BusForm;
