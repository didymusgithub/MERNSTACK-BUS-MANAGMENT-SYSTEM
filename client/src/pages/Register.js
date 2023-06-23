import React from "react";
import "../resources/register.css";
import { Form, message } from "antd";
import { Link } from "react-router-dom";
import axios from 'axios';
import { useDispatch } from "react-redux";
import { HideLoading, showloading } from "../redux/alertSlice";
import "../resources/login.css"


function Register() {

  const navigate = useDispatch();
  const dispatch = useDispatch();
  const onFinish = async (values) => {
    try {
      dispatch(showloading());
      const response = await axios.post("/api/users/register", values);
      dispatch(HideLoading());
      if(response.data.success){
        message.success(response.data.message);
      }else{
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  return (
    <div className="h-screen d-flex justify-content-center align-items-center auth">
      <div className="w-400 card p-3 c">
        <h1 className="text-lg">DidierBus -Register</h1>
        <hr />
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item label="Name" name="name">
            <input type="text" />
          </Form.Item>
          <Form.Item label="Email" name="email">
            <input type="email" />
          </Form.Item>
          <Form.Item label="Password" name="password">
            <input type="password" />
          </Form.Item>

          <div className="d-flex justify-content-between align-items-center my-3">
            <Link to="/Login">click here to Login</Link>
            <button className="secondary-btn" type="submit">
              Register
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default Register;
