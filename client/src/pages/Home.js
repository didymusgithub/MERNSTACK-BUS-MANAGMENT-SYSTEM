import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { HideLoading, showloading } from "../redux/alertSlice";
import { Row, message, Col } from "antd";
import { axiosInstance } from "../helpers/axiosinstance";
import Bus from "../componenets/Bus";
import "../resources/filter.css";
// import "../resources/card.css"

function Home() {
  const { user } = useSelector((state) => state.users);
  const [filter, setfilter] = useState({});
  const dispatch = useDispatch();
  const [buses, setBuses] = useState([]);
  const getBuses = async () => {
    const tempfilters = {};
    Object.keys(filter).forEach((key) => {
      if (filter[key]) {
        tempfilters[key] = filter[key];
      }
    });

    try {
      dispatch(showloading);
      const response = await axiosInstance.post("/api/buses/get-all-buses", {
        filter: tempfilters,
      });
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

  useEffect(() => {
    getBuses();
  }, [dispatch, getBuses]);

  return (
    <div>
      <div className="my-3  py-2">
        <Row gutter={10} align="center">
          <Col lg={6} sm={24}>
            <div className="input__container">
              <input
                className="filter input__search"
                type="text"
                placeholder="FROM"
                value={filter.from}
                onChange={(e) => setfilter({ ...filter, from: e.target.value })}
              />
              <span className="shadow__input"></span>
            </div>
          </Col>
          <Col lg={6} sm={24}>
            <div className="input__container">
              <input
                className="filter input__search"
                type="text"
                placeholder="TO"
                value={filter.to}
                onChange={(e) => setfilter({ ...filter, to: e.target.value })}
              />
              <span className="shadow__input"></span>
            </div>
          </Col>
          <Col lg={6} sm={24}>
            <div className="input__container">
              <input
                className="filter input__search"
                type="date"
                placeholder="JourneyDate"
                value={filter.journeyDate}
                onChange={(e) =>
                  setfilter({ ...filter, journeyDate: e.target.value })
                }
              />
              <span className="shadow__input"></span>
            </div>
          </Col>

          <Col lg={6} sm={24}>
            <div className="d-flex gap-2">
              <button className="btn btn-success" onClick={() => getBuses()}>
                Filter
              </button>
              <button className="btn btn-outline-success" onClick={() => setfilter({})}>
                clear
              </button>
            </div>
          </Col>
        </Row>
      </div>

      {/* display all the buses from the back end */}
      <div className="card-container">
        <Row gutter={[18, 18]}>
          {buses
            .filter((bus) => bus.status === "yet to start")
            .map((bus) => (
              <Col lg={12} xs={24} sm={24}>
                <div className="card">
                  <div className="card-overlay"></div>
                  <div className="card-inner">
                    {/* Place the content of the Bus component here */}
                    <Bus bus={bus} />
                  </div>
                </div>
              </Col>
            ))}
        </Row>
      </div>
    </div>
  );
}

export default Home;
