import React, { useEffect, useState } from "react";
import PageTitle from "../../componenets/PageTitle";
import BusForm from "../../componenets/BusForm";
import { useDispatch } from "react-redux";
import { HideLoading, showloading } from "../../redux/alertSlice";
import axios from "axios";
import { Table, message } from "antd";
import { axiosInstance } from "../../helpers/axiosinstance";
import moment from "moment";

function AdminUsers() {
  const dispatch = useDispatch();
  const [users, setUsers] = useState([]);

  const getUsers = async () => {
    try {
      dispatch(showloading);
      const response = await axiosInstance.post("/api/users/get-all-users", {});
      dispatch(HideLoading);
      if (response.data.success) {
        setUsers(response.data.data);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading);
      message.error(error.message);
    }
  };

  const updateuserPermissions = async (user, action) => {
    try {
      let Payload = null;
      if (action === "make-admin") {
        Payload = {
          ...user,
          isAdmin: true,
        };
      } else if (action === "remove-admin") {
        Payload = {
          ...user,
          isAdmin: false,
        };
      } else if (action === "block") {
        Payload = {
          ...user,
          isBlocked: true,
        };
      } else if (action === "unblock") {
        Payload = {
          ...user,
          isBlocked: false,
        };
      }
      dispatch(showloading());
      const response = await axiosInstance.post(
        "/api/users/update-user-permissions",
        Payload
      );
      dispatch(HideLoading());
      if (response.data.success) {
        getUsers();
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
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Status",
      dataIndex: "",
      render:  (data) =>{
        return data.isBlocked ? "Blocked":"Active";
      },

    },
    {
      title: "Role",
      dataIndex: "",
      render: (data) => {
        if (data?.isAdmin) {
          return "Admin";
        } else {
          return "User";
        }
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (action, record) => (
        <div className="d-flex gap-3">
          {record.isBlocked && (
            <p
              className="block"
              onClick={() => {
                updateuserPermissions(record, "unblock");
              }}
            >
              {" "}
              unBlock
            </p>
          )}
          {!record.isBlocked && (
            <p
              className="block"
              onClick={() => {
                updateuserPermissions(record, "block");
              }}
            >
              {" "}
              Block
            </p>
          )}

          {record.isAdmin && (
            <p
              className="makeadmin"
              onClick={() => {
                updateuserPermissions(record, "remove-admin");
              }}
            >
              Remove Admin
            </p>
          )}
          {!record.isAdmin && (
            <p
              className="makeadmin"
              onClick={() => {
                updateuserPermissions(record, "make-admin");
              }}
            >
              Make Admin
            </p>
          )}
        </div>
      ),
    },
  ];

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div>
      <div className="d-flex justify-content-between my-2 ">
        <PageTitle title="Users" />
      </div>
      <Table columns={columns} dataSource={users} />
    </div>
  );
}

export default AdminUsers;
