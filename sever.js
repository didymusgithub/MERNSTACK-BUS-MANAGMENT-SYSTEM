const express = require("express");
const app = express();
require("dotenv").config();
const dbconfig = require("./config/dbConfig");

const port = process.env.PORT || 5000;
app.use(express.json());

const usersRoute = require("./routes/usersRoute");
const busesRoute = require("./routes/busesRoute");
const bookingRoute = require("./routes/bookingRoute");

app.use("/api/users", usersRoute);
app.use("/api/buses", busesRoute);
app.use("/api/bookings", bookingRoute);
const path = require("path");


// this is for heroku deployment
if(process.env.NODE_ENV === "production"){
  app.use(express.static("client/build"));
  app.get("*",(req,res)=>{
    res.sendFile(path.resolve(__dirname, 'client/bild/index.html'));
  })

}
app.listen(port, () => {
  console.log(`node sever listenining on port ${port}`);
});
