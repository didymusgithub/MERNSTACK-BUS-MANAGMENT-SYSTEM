import { message } from "antd";
import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUser } from "../redux/usersSlice";
import { HideLoading, showloading } from "../redux/alertSlice";
import DefaultLayout from "./DefaultLayout";

function ProtectedRoute({ children }) {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.users);
  const navigate = useNavigate();
  const validateToken = async () => {
    try {
      dispatch(showloading());
      const response = await axios.post(
        "/api/users/get-user-by-id",
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(HideLoading());
      if (response.data.success) {
        dispatch(HideLoading());
        dispatch(setUser(response.data.data));
      } else {
        dispatch(HideLoading());
        localStorage.removeItem("token");
        message.error(response.data.message);
        navigate("/login");
      }
    } catch (error) {
      dispatch(HideLoading());
      localStorage.removeItem("token");
      // message.error(error.message)
      navigate("/login");
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      validateToken();
    } else {
      navigate("/login");
    }
  }, []); // pass empty array as second argument to run the effect only once

  return <div>{user && <DefaultLayout>{children}</DefaultLayout>}</div>;
}

export default ProtectedRoute;
