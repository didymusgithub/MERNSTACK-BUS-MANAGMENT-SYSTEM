import React, { useState } from "react";
import "../resources/layout.css";
import { useNavigate } from "react-router-dom";
import {useSelector } from'react-redux';

function DefaultLayout({ children }) {

 
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const {user} = useSelector(state => state.users);
  const usermenu = [
    {
      name: 'Home',
      icon: "ri-home-line",
      path: '/'
    },
    {
      name: "Bookings",
      icon: "ri-file-list-line",
      path: '/bookings'
    },
    {
      name: 'profile',
      icon: "ri-file-user-fill",
      path: '/profile'

    },
    {
      name: 'Logout',
      icon: "ri-logout-box-line",
      path: '/logout'
    }
    

  ];
 
  // this is an array of the items that will rendered in the menu item of the sidebar of the application
  const adminMenu  = [
    {
      name: "home",
      path: "/",
      icon: "ri-home-line",
    },
    {
      name: "Buses",
      path: "/admin/buses",
      icon: "ri-bus-line",
    },
    {
      name: "Users",
      path: "/admin/users",
      icon: "ri-file-user-fill",
    },
    {
      name: "Booking",
      path: "/admin/bookings",
      icon: "ri-file-list-line",
    },
    {
      name: "logout",
      path: "/logout",
      icon: "ri-logout-box-line",
    },
  ];
  

  // this makes the user to either have access to the admin or user menu
  const menuToBerendered = user && user.isAdmin ? adminMenu : usermenu;
  const activeRoute = window.location.pathname;
  return (
    <div className="layout-parent">
      <div className="sidebar">
        <div className="sidebar-header">
          <h1 className="logo" >DB</h1>
          {/* displays the tope to see if user is admin or user */}
          <h1 className="role">{user && user.name}<br></br>Role:  {user && user.isAdmin ? "Admin" : "User"}</h1>
        </div>
        <div className="d-flex flex-column gap-3 justify-content-start menu">
          {menuToBerendered.map((item, index) => {
            return (
              // this checks and renders a white box around the menu item when clicked
              <div
                className={`${
                  activeRoute === item.path ? "active-menu-item" : ""
                } menu-item`}
              >
                <i className={item.icon}></i>
                {!collapsed && (
                  <span
                    onClick={() => {
                      if (item.path === "/logout") {
                        localStorage.removeItem("token");
                        navigate("/login");
                      } else {
                        navigate(item.path);
                      }
                    }}
                  >
                    {item.name}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <div className="body">
        <div className="header">
          {/* this is the araea for the cursor and navbar that controls the navabar and the side bar */}
          {collapsed ? (
            <i
              class="ri-menu-2-line"
              onClick={() => setCollapsed(!collapsed)}
            ></i>
          ) : (
            <i
              class="ri-close-line"
              onClick={() => setCollapsed(!collapsed)}
            ></i>
          )}
        </div>
        <div className="content"> {children}</div>
      </div>
    </div>
  );
}

export default DefaultLayout;
